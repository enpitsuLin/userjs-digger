import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

class UserjsDigger extends HTMLElement {
  constructor() {
    super();
    const app = document.createElement('div');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(app);

    createApp(App).mount(app);
  }
}

customElements.define('userjs-digger', UserjsDigger);

const userDigger = document.createElement('userjs-digger');
document.body.append(userDigger);
