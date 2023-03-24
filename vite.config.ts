import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [util.unimportPreset, 'vue', '@vueuse/core'],
      dts: 'src/auto-import.d.ts'
    }),

    Unocss(),

    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'userjs-digger',
        include: ['*']
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
          ]
        ]
      }
    })
  ]
});
