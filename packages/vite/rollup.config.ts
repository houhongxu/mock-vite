import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import { defineConfig } from 'rollup'
import { Plugin } from 'rollup'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean,
  declarationDir: string | false,
): (Plugin | false)[] {
  return [
    nodeResolve(),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: declarationDir !== false,
      declarationDir: declarationDir !== false ? declarationDir : undefined,
    }),
    json(),
    commonjs(),
  ]
}

const sharedNodeOptions = defineConfig({
  output: {
    dir: './dist',
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
  },
})

function createNodeConfig(isProduction: boolean) {
  return defineConfig({
    input: {
      index: path.resolve(__dirname, 'src/node/index.ts'),
      cli: path.resolve(__dirname, 'src/node/cli.ts'),
      constants: path.resolve(__dirname, 'src/node/constants.ts'),
    },
    output: {
      ...sharedNodeOptions.output,
    },
    plugins: createNodePlugins(
      isProduction,
      !isProduction,
      isProduction ? false : './dist/node',
    ),
  })
}

export default () => {
  return defineConfig([createNodeConfig(false)])
}
