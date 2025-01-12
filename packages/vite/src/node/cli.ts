import { VERSION } from './constants'
import { ServerOptions } from './server'
import { cac } from 'cac'

interface GlobalCLIOptions {
  '--'?: string[]
}

const cli = cac('vite')

function cleanOptions<Options extends GlobalCLIOptions>(
  options: Options,
): Omit<Options, keyof GlobalCLIOptions> {
  const ret = { ...options }
  delete ret['--']

  return ret
}

cli
  .command('[root]', 'start dev server')
  .alias('serve')
  .alias('dev')
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    console.log('cli-dev')

    const { createServer } = await import('./server')

    const server = await createServer({
      root,
      server: cleanOptions(options),
    })

    await server.listen()

    server.printUrls()
  })

cli.help()

cli.version(VERSION)

cli.parse()
