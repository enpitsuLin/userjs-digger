import { DefineLocaleMessage } from 'vue-i18n';
import en from '@userjs-digger/locales/en.json';

type LocaleMessage = typeof en;
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends LocaleMessage {}
}
