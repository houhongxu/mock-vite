import { Logger, createLogger } from './logger'
import { Plugin } from './plugin'
import {
  ResolvedServerOptions,
  ServerOptions,
  resolveServerOptions,
} from './server'
import { normalizePath } from './uitls'
import path from 'path'

export type PluginOption =
  | Plugin
  | false
  | null
  | undefined
  | PluginOption[]
  | Promise<Plugin | false | null | undefined | PluginOption[]>

export interface InlineConfig extends UserConfig {
  /**
   * 指明要使用的配置文件
   */
  configFile?: string | false
  /**
   * 设置为 false 时，则禁用 .env 文件
   */
  envFile?: false
}

export interface UserConfig {
  /**
   * 项目根目录（index.html 文件所在的位置）
   * @default process.cwd()
   */
  root?: string

  /**
   * 开发服务器选项
   */
  server?: ServerOptions

  /**
   * 需要用到的插件数组
   */
  plugins?: PluginOption[]
}

export type ResolvedConfig = Readonly<
  Omit<UserConfig, 'plugins'> & {
    server: ResolvedServerOptions
    logger: Logger
  }
>

export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
): Promise<ResolvedConfig> {
  let config = inlineConfig

  const logger = createLogger()

  const resolvedRoot = normalizePath(
    config.root ? path.resolve(config.root) : process.cwd(),
  )

  const server = resolveServerOptions(resolvedRoot, config.server, logger)

  let resolved: ResolvedConfig

  resolved = {
    root: resolvedRoot,
    server,
    logger,
  }

  return resolved
}
