import { ResolvedConfig } from './config'
import { CommonServerOptions } from './http'
import { ResolvedServerUrls } from './server'
import { Server } from 'http'

export function normalizePath(id: string): string {
  return id
}

export async function resolveServerUrls(
  server: Server,
  options: CommonServerOptions,
  config: ResolvedConfig,
): Promise<ResolvedServerUrls> {
  return { local: ['http://localhost:5173'], network: [] }
}

export async function resolveHostname(
  optionsHost: string | boolean | undefined,
) {
  let host: string | undefined

  if (optionsHost === undefined || optionsHost === false) {
    host = 'localhost'
  } else if (optionsHost === true) {
    host = undefined
  } else {
    host = optionsHost
  }

  return { host }
}
