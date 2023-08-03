import { RemovableRef, StorageLike } from '@vueuse/core';
import { MaybeRefOrGetter } from 'vue';

export const GMStorage: StorageLike = {
  getItem: function (key: string): string | null {
    return GM_getValue(key);
  },
  setItem: function (key: string, value: string): void {
    GM_setValue(key, value);
  },
  removeItem: function (key: string): void {
    GM_deleteValue(key);
  }
};

export const useGMStorage = <T>(
  key: string,
  defaults: MaybeRefOrGetter<T>
): RemovableRef<T> => useStorage(key, defaults, GMStorage);
