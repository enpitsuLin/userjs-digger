import { defineConfig, presetUno, presetIcons } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetRemToPx()],
  preflights: [
    {
      getCSS: () => {
        return '[data-v-app]{font-size:16px}:host{z-index:9999;position:relative}';
      }
    }
  ]
});
