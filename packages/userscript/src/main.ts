import './style.css';
import { createApp, App as VueApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import unocss from 'uno.css?raw';
import reset from '@unocss/reset/tailwind-compat.css?raw';
import zh from '@userjs-digger/locales/zh.json';
import en from '@userjs-digger/locales/en.json';

const settings = useUserjsDiggerSettings();

const i18n = createI18n<typeof en, 'en' | 'zh'>({
  legacy: false,
  locale: settings.value.locale,
  fallbackLocale: 'en',
  messages: { zh, en }
});

if (!HTMLElement.prototype.attachShadow) {
  console.log("shadow-dom doesn't support in current website, load polyfill");
  useScriptTag('https://unpkg.com/attachshadow@0.3.0/min.js', () => {
    initUserjsDigger(Element.prototype.attachShadow);
  });
} else {
  initUserjsDigger();
}

function initUserjsDigger(attachShadow = HTMLElement.prototype.attachShadow) {
  customElements.define(
    'userjs-digger',
    class extends HTMLElement {
      app: VueApp;
      constructor() {
        super();
        const app = document.createElement('div');

        const style = document.createElement('style');
        style.innerHTML = `${reset}${unocss}`;

        const shadow = attachShadow.call(this, { mode: 'open' });

        shadow.appendChild(style);
        shadow.appendChild(app);

        this.app = createApp(App);
        this.app.use(i18n);
        this.app.provide('container', app);
        this.app.mount(app);
      }
    }
  );

  const userDigger = document.createElement('userjs-digger');
  document.body.append(userDigger);
}
