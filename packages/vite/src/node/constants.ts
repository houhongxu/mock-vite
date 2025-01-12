import { readFileSync } from 'fs'

export const DEFAULT_DEV_PORT = 5173

const { version } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url)).toString(),
)

export const VERSION = version as string
