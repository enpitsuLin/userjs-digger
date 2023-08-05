import { SETTING_KEY } from '../constants'
import type { UserjsDiggerSettings } from '../types'

export const useInjectContainer = () => inject<HTMLDivElement>('container')!

const defaultSettings: UserjsDiggerSettings = {
  locale: navigator.language ?? 'en',
  nsfw: false,
  filter: [],
  debugger: false,
}

const toString = Object.prototype.toString

export const useUserjsDiggerSettings = createGlobalState(() => {
  const settings = useGMStorage(SETTING_KEY, defaultSettings)

  Object.entries(settings.value).forEach(([key, value]) => {
    if (
      toString.call(value)
      !== toString.call(defaultSettings[key as keyof UserjsDiggerSettings])
    ) {
      // @ts-expect-error: ignore this
      settings.value[key as keyof UserjsDiggerSettings]
        = defaultSettings[key as keyof UserjsDiggerSettings]
    }
  })
  return settings
})
