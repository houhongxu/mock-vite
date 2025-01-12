import { Logger } from './logger'
import { HttpServer } from './server'
import { Connect } from 'dep-types/connect'

export interface CommonServerOptions {
  /**
   * 指定开发服务器端口
   */
  port?: number
  /**
   * 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
   */
  strictPort?: boolean
  /**
   * 指定服务器应该监听哪个 IP 地址
   */
  host?: string | boolean
}

export async function resolveHttpServer(
  {}: CommonServerOptions,
  app: Connect.Server,
) {
  const { createServer } = await import('node:http')

  return createServer(app)
}

export async function httpServerStart(
  httpServer: HttpServer,
  serverOptions: {
    port: number
    strictPort: boolean | undefined
    host: string | undefined
    logger: Logger
  },
) {
  let { port, host, logger } = serverOptions

  return new Promise((resolve, reject) => {
    const onError = (e: Error & { code?: string }) => {
      logger.info(e.message)
    }

    httpServer.on('error', onError)

    httpServer.listen(port, host, () => {
      httpServer.removeListener('error', onError)

      resolve(port)
    })
  })
}
