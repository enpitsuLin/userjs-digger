import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives
} from 'unocss';
import { presetForms } from '@julr/unocss-preset-forms';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetRemToPx(), presetForms()],
  preflights: [
    {
      getCSS: () => {
        return '[data-v-app]{font-size:16px}:host{z-index:999999;position:relative}';
      }
    }
  ],
  transformers: [transformerDirectives()]
});
