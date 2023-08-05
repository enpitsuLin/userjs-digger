export function attachUnocss(root: ShadowRoot) {
  if (import.meta.env.DEV) {
    import('uno.css?raw').then(({ default: unocss }) => {
      root.appendChild(unocss as any)
    })
  }
  else {
    import('uno.css?raw').then(({ default: css }) => {
      const style = document.createElement('style')
      style.innerText = css as string
      root.appendChild(style)
    })
  }
}

if (import.meta.hot)
  import.meta.hot.accept(console.log)
