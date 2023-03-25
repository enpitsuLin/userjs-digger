import { type Plugin } from 'vite';
import { build } from '@unocss/cli';
import { tmpdir } from 'os';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

export function UnocssBuildPlugin(): Plugin[] {
  return [
    {
      name: 'unocss:build:raw',
      enforce: 'post',
      resolveId(source) {
        if (source === 'uno.css?raw') {
          return '/__unocss_raw';
        }
      },
      async load(id) {
        if (id === '/__unocss_raw') {
          const outFile = resolve(tmpdir(), `unocss_${+Date()}.css`);
          await build({
            outFile,
            cwd: process.cwd(),
            config: resolve(__dirname, '../unocss.config.ts'),
            patterns: ['./src/**/*.vue', './src/**/*.css']
          });
          const css = (await readFile(outFile)).toString().split('\n').join('');

          return { code: `export default ${JSON.stringify(css)}` };
        }
      }
    }
  ];
}
