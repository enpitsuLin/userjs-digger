import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Component from 'unplugin-vue-components/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import Unocss from 'unocss/vite';
import { UnocssBuildPlugin } from './plugins/build';

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
          icon: 'https://vitejs.dev/logo.svg',
          namespace: 'userjs-digger',
          include: ['*'],
          require: [
            'https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=1134973'
          ],
          grant: ['GM_xmlhttpRequest'],
          connect: ['greasyfork.org']
        },
        build: {
          externalGlobals: [
            [
              'vue',
              cdn.jsdelivr('Vue', 'dist/vue.global.prod.js').concat(
                await util.fn2dataUrl(() => {
                  // @ts-ignore
                  window.Vue = Vue; // work with element-plus
                })
              )
            ],
            [
              '@vueuse/core',
              cdn
                .jsdelivr('VueUse')
                .concat('https://cdn.jsdelivr.net/npm/@vueuse/shared@beta')
            ],
            ['psl', cdn.bootcdn('psl', 'psl.min.js')]
          ]
        }
      })
    ]
  };
});
