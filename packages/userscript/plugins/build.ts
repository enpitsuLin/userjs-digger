import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { build } from '@unocss/cli'
import { type Plugin } from 'vite'

export function UnocssBuildPlugin(): Plugin[] {
  return [
    {
      name: 'unocss:build:raw',
      enforce: 'post',
      resolveId(source) {
        if (source === 'uno.css?raw')
          return '/__unocss_raw'
      },
      async load(id) {
        if (id === '/__unocss_raw') {
          const outFile = resolve(tmpdir(), `unocss_${+new Date()}.css`)
          await build({
            outFile,
            cwd: process.cwd(),
            config: resolve(__dirname, '../unocss.config.ts'),
            patterns: ['./src/**/*.vue', './src/**/*.css'],
          })
          const css = (await readFile(outFile)).toString().split('\n').join('')

          return { code: `export default ${JSON.stringify(css)}` }
        }
      },
    },
  ]
}
