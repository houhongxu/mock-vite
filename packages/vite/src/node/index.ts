import type * as Rollup from 'rollup'

export type { Rollup }

export { createServer } from './server'

export type {
  InlineConfig,
  PluginOption,
  ResolvedConfig,
  UserConfig,
} from './config'

export type { CommonServerOptions } from './http'

export type {
  ViteDevServer,
  ServerOptions,
  ResolvedServerOptions,
  ResolvedServerUrls,
} from './server'

export type { Plugin } from './plugin'

export type { Logger } from './logger'

export type { Connect } from 'dep-types/connect'
