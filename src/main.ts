import './style.css';
import { createApp, App as VueApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import unocss from 'uno.css?raw';
import reset from '@unocss/reset/tailwind-compat.css?raw';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en'
});

customElements.define(
  'userjs-digger',
  class extends HTMLElement {
    app: VueApp;
    constructor() {
      super();
      const app = document.createElement('div');

      const style = document.createElement('style');
      style.innerHTML = `${reset}${unocss}`;

      const shadow = this.attachShadow({ mode: 'open' });

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
