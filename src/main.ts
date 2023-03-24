import { createApp } from 'vue';
import App from './App.vue';
import unocss from 'uno.css?raw';
import reset from '@unocss/reset/tailwind-compat.css?raw';

customElements.define(
  'userjs-digger',
  class extends HTMLElement {
    constructor() {
      super();
      const app = document.createElement('div');

      const style = document.createElement('style');
      style.innerHTML = `${reset}${unocss}`;

      const shadow = this.attachShadow({ mode: 'open' });

      shadow.appendChild(style);
      shadow.appendChild(app);

      createApp(App).mount(app);
    }
  }
);

const userDigger = document.createElement('userjs-digger');
document.body.append(userDigger);
