import './style.css'
import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import reset from '@unocss/reset/tailwind-compat.css?raw'
import zh from '@userjs-digger/locales/zh.json'
import en from '@userjs-digger/locales/en.json'
import App from './App.vue'

const settings = useUserjsDiggerSettings()

const i18n = createI18n<typeof en, 'en' | 'zh'>({
  legacy: false,
  locale: settings.value.locale,
  fallbackLocale: 'en',
  messages: { zh, en },
})

if (!HTMLElement.prototype.attachShadow) {
  console.error('shadow-dom doesn\'t support in current website, load polyfill')
  useScriptTag('https://unpkg.com/attachshadow@0.3.0/min.js', () => {
    initUserjsDigger(Element.prototype.attachShadow)
  })
}
else {
  initUserjsDigger()
}

function initUserjsDigger(attachShadow = HTMLElement.prototype.attachShadow) {
  customElements.define(
    'userjs-digger',
    class extends HTMLElement {
      app: VueApp
      constructor() {
        super()
        const app = document.createElement('div')


        const shadow = attachShadow.call(this, { mode: 'open' })

        const resetStyle = document.createElement('style')
        resetStyle.innerHTML = reset


        if (import.meta.env.DEV) {
          const style = document.createElement('link')
          style.rel = "stylesheet"
          const url = new URL(import.meta.url)
          style.href = new URL(`./__uno.css`, `${url.protocol}${url.host}`).href

          shadow.appendChild(style)
        }
        else {
          import('uno.css?raw').then(({ default: css }) => {
            const style = document.createElement('style')
            style.innerText = css as string
            shadow.appendChild(style)
          })
        }
        shadow.appendChild(resetStyle)
        shadow.appendChild(app)

        this.app = createApp(App)
        this.app.use(i18n)
        this.app.provide('container', app)
        this.app.mount(app)
      }
    },
  )

  const userDigger = document.createElement('userjs-digger')
  document.body.append(userDigger)
}
