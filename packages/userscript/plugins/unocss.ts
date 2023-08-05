import { type Plugin } from 'vite'
import Unocss from 'unocss/vite'

export function UnocssClientPlugin(): Plugin[] {
  const plugins = Unocss()

  const globalPlugin = plugins.find(i => i.name === 'unocss:global')
  const globalPostPlugin = plugins.find(i => i.name === 'unocss:global:post')
  const rest = plugins.filter(i => !['unocss:global', 'unocss:global:post'].includes(i.name))

  return [
    ...rest,
    {
      name: 'redirect:client',
      enforce: 'pre',
      async resolveId(source, importer, options) {
        if (source === '/@ud/client')
          return 'plugins/client.ts'
      },
    },
    globalPlugin,
    {
      ...globalPostPlugin,
      async transform(_code, id, options) {
        const data = await (globalPostPlugin.transform as any)(_code, id, options)

        if (data && id === '/__uno.css') {
          const { code: outcode } = data
          const l3 = outcode.split('\n')[2] as string
          const css = l3.substring('const __vite__css = "'.length, l3.length - 1)
          const code = [
            'import {updateStyle,removeStyle} from \'/@ud/client\'',
            `const __vite__id  = ${JSON.stringify(id)}`,
            `const __vite__css = "${css}"`,
            'import.meta.hot.accept()',
            'export default updateStyle(__vite__id,__vite__css)',
            `import.meta.hot.prune(() => removeStyle(__vite__id))
if (import.meta.hot) {
try {
  let hash = __vite__css.match(/__uno_hash_(\\w{6})/)
  hash = hash && hash[1]
  if (!hash)
    console.warn('[unocss-hmr]', 'failed to get unocss hash, hmr might not work')
  else
    await import.meta.hot.send('unocss:hmr', ['__ALL__', hash]);
} catch (e) {
  console.warn('[unocss-hmr]', e)
}
if (!import.meta.url.includes('?'))
  await new Promise(resolve => setTimeout(resolve, 100))}`,
          ].join('\n')

          return { code }
        }
      },
    },
  ]
}
