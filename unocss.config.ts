import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  preflights: [
    {
      getCSS: () => {
        return '[data-v-app]{font-size:16px}:host{z-index:9999;position:relative}';
      }
    }
  ]
});
