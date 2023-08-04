
const sheetsMap = new Map<string, HTMLStyleElement>()

export function updateStyle(id: string, content: string): HTMLStyleElement {
  let style = sheetsMap.get(id)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('data-vite-dev-id', id)
    style.textContent = content

  } else {
    style.textContent = content
  }
  sheetsMap.set(id, style)
  return style
}

export function removeStyle(id: string): void {
  const style = sheetsMap.get(id)
  if (style) {
    style.remove()
    sheetsMap.delete(id)
  }
}
