import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Component from 'unplugin-vue-components/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import Unocss from 'unocss/vite';
import { UnocssBuildPlugin } from './plugins/build';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const UnocssPlugin: Plugin[] =
    command === 'serve' ? Unocss() : UnocssBuildPlugin();
  return {
    plugins: [
      AutoImport({
        imports: [util.unimportPreset, 'vue', '@vueuse/core'],
        dts: 'src/auto-import.d.ts',
        dirs: ['./src/composables/**']
      }),
      Component({ dts: 'src/components.d.ts' }),

      UnocssPlugin,

      vue(),
      monkey({
        entry: 'src/main.ts',
        userscript: {
          namespace: 'userjs-digger',
          name: 'Userjs digger',
          version: pkg.version,
          description: pkg.description,
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
            ['vue', cdn.jsdelivr('Vue', 'dist/vue.global.prod.js')],
            ['psl', cdn.bootcdn('psl', 'psl.min.js')]
          ]
        }
      })
    ]
  };
});
