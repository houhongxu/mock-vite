import { InlineConfig, ResolvedConfig, resolveConfig } from '../config'
import { DEFAULT_DEV_PORT } from '../constants'
import {
  CommonServerOptions,
  httpServerStart,
  resolveHttpServer,
} from '../http'
import { Logger } from '../logger'
import { resolveHostname, resolveServerUrls } from '../uitls'
import connect from 'connect'
import { Connect } from 'dep-types/connect'
import http from 'http'

export interface ServerOptions extends CommonServerOptions {
  /**
   * 以中间件模式创建 Vite 服务器。
   * @default false
   */
  middlewareMode?:
    | boolean
    | {
        server: http.Server
      }
}

export interface ResolvedServerOptions extends ServerOptions {}

export type HttpServer = http.Server

export interface ResolvedServerUrls {
  local: string[]
  network: string[]
}

export interface ViteDevServer {
  /**
   * 解析后的配置对象
   */
  config: ResolvedConfig
  /**
   * 中间件实例
   */
  middlewares: Connect.Server
  /**
   * 原生http服务器，在middleware开启时为null
   */
  httpServer: HttpServer | null
  /**
   * 打印在命令行的解析后的url
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 开启服务器
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 停止服务器
   */
  close(): Promise<void>
  /**
   * 打印服务器url
   */
  printUrls(): void
}

async function startServer(server: ViteDevServer, inlinePort?: number) {
  console.log('startServer')

  const httpServer = server.httpServer

  if (!httpServer) {
    throw new Error('处于中间件模式，无服务器')
  }
  const options = server.config.server

  const hostname = await resolveHostname(options.host)

  const configPort = inlinePort ?? options.port

  const port = configPort ?? DEFAULT_DEV_PORT

  const serverPort = await httpServerStart(httpServer, {
    port,
    strictPort: options.strictPort,
    host: hostname.host,
    logger: server.config.logger,
  })
}

export async function _createServer(
  inlineConfig: InlineConfig = {},
  options: { ws: boolean },
) {
  console.log('_createServer')

  const config = await resolveConfig(inlineConfig, 'serve')

  const { root, server: serverConfig } = config

  const { middlewareMode } = serverConfig

  const middlewares = connect() as Connect.Server

  const httpServer = middlewareMode
    ? null
    : await resolveHttpServer(serverConfig, middlewares)

  let exitProcess: () => void

  let server: ViteDevServer = {
    config,
    middlewares,
    httpServer,
    resolvedUrls: null,
    async listen(port?: number, isRestart?: boolean) {
      await startServer(server, port)

      if (httpServer) {
        server.resolvedUrls = await resolveServerUrls(
          httpServer,
          config.server,
          config,
        )
      }

      return server
    },
    printUrls() {
      if (server.resolvedUrls) {
        console.log(server.resolvedUrls)
      }
    },
    async close() {
      await Promise.allSettled([])

      server.resolvedUrls = null
    },
  }

  return server
}

export function createServer(inlineConfig: InlineConfig = {}) {
  return _createServer(inlineConfig, { ws: true })
}

export function resolveServerOptions(
  root: string,
  raw: ServerOptions | undefined,
  logger: Logger,
) {
  const server: ResolvedServerOptions = {}

  return server
}
