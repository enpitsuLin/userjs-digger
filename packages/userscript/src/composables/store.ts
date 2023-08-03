import type { RemovableRef, StorageLike } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'

export const GMStorage: StorageLike = {
  getItem(key: string): string | null {
    return GM_getValue(key)
  },
  setItem(key: string, value: string): void {
    GM_setValue(key, value)
  },
  removeItem(key: string): void {
    GM_deleteValue(key)
  },
}

export function useGMStorage<T>(key: string,
  defaults: MaybeRefOrGetter<T>): RemovableRef<T> {
  return useStorage(key, defaults, GMStorage)
}
