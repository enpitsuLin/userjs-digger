import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Component from 'unplugin-vue-components/vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import Unocss from 'unocss/vite';
import { UnocssBuildPlugin } from './plugins/build';
import pkg from './package.json';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const UnocssPlugin: Plugin[] =
    command === 'serve' ? Unocss() : UnocssBuildPlugin();
  return {
    plugins: [
      AutoImport({
        imports: [util.unimportPreset, 'vue', '@vueuse/core', 'vue-i18n'],
        dts: 'src/auto-import.d.ts',
        dirs: ['./src/composables/**']
      }),
      Component({ dts: 'src/components.d.ts' }),

      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          '../locales/*.json'
        )
      }),
      UnocssPlugin,

      vue(),
      monkey({
        entry: 'src/main.ts',
        userscript: {
          namespace: 'userjs-digger',
          name: 'Userjs digger',
          homepage: pkg.homepage,
          version: pkg.version,
          description: pkg.description,
          website: 'https://enpitsulin.xyz',
          author: pkg.author,
          include: ['*'],
          grant: ['GM_xmlhttpRequest'],
          connect: ['greasyfork.org'],
          noframes: true,
          license: 'MIT',
          icon: 'https://user-images.githubusercontent.com/29378026/227717136-4c9dfba4-0f90-41a2-905a-4cf19e751b5c.png'
        },
        build: {
          externalGlobals: [
            ['vue', cdn.unpkg('Vue', 'dist/vue.global.prod.js')],
            ['psl', cdn.unpkg('psl', 'dist/psl.min.js')],
            [
              'vue-i18n',
              cdn.unpkg('VueI18n', 'dist/vue-i18n.runtime.global.js')
            ]
          ]
        }
      })
    ]
  };
});
