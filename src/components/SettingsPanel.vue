<template>
  <div
    v-if="show"
    ref="dialog"
    class="fixed left-1/2 -translate-x-1/2 top-25vh w-100 shadow-md rounded bg-$ud-bg text-$ud-text"
  >
    <div class="border-b border-b-$ud-border p-4 flex items-center">
      <div>{{ t('settings') }}</div>
      <div
        class="ml-auto p-1 hover:bg-$ud-bg-hover rounded"
        @click="$emit('update:show', false)"
      >
        <div class="i-carbon-close"></div>
      </div>
    </div>
    <ul class="divide-y divide-$ud-border px-4 py-2 h-60 overflow-y-scroll">
      <li class="py-2 flex items-center justify-between space-x-4">
        <div class="flex flex-col w-4/5 overflow-hidden">
          <p class="text-sm font-medium">{{ t('language') }}</p>
          <p class="text-sm text-$ud-text-secondary text-xs">
            {{ t('language-desc') }}
          </p>
        </div>
        <LocaleSelect />
      </li>
      <li class="py-2 flex items-center justify-between space-x-4">
        <div class="flex flex-col w-4/5 overflow-hidden">
          <p class="text-sm font-medium">{{ t('enable') }}</p>
          <p class="text-sm text-$ud-text-secondary text-xs">
            {{ t('enable-desc') }}
          </p>
        </div>
        <Toggle v-model="enable" />
      </li>
      <li class="py-2 flex items-center justify-between space-x-4">
        <div class="flex flex-col w-4/5 overflow-hidden">
          <p class="text-sm font-medium">{{ t('nsfw') }}</p>
          <p class="text-sm text-$ud-text-secondary text-xs">
            {{ t('nsfw-desc') }}
          </p>
        </div>
        <Toggle v-model="settings.nsfw" />
      </li>
      <li class="py-2 flex flex-col space-y-2">
        <div class="flex flex-col w-4/5 overflow-hidden">
          <p class="text-sm font-medium">{{ t('filter') }}</p>
          <p class="text-sm text-$ud-text-secondary text-xs">
            {{ t('filter-desc') }}
          </p>
        </div>
        <div
          class="p-2 gap-y-1 inline-flex flex-wrap relative shadow-sm border-1px border-$ud-border rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
        >
          <div
            v-for="(item, i) of settings.filter"
            class="inline-flex mr-1 rounded-full items-center py-0.5 pl-2.5 pr-1 text-xs font-medium bg-indigo-100 text-indigo-700"
          >
            <span>
              {{ item }}
            </span>
            <button
              type="button"
              class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
              @click="settings.filter.splice(i)"
            >
              <div class="sr-only">Remove</div>
              <div class="h-3 w-3 i-carbon-close"></div>
            </button>
          </div>
          <input
            v-model="inputVal"
            type="text"
            class="bg-transparent border-none ring-none! flex-1 p-0 text-xs"
            @keypress.enter="onFilterAdd"
            @keydown.backspace="onFilterBack"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  defineProps<{ show: boolean }>();
  const emit = defineEmits<{ (e: 'update:show', p: boolean): void }>();

  const dialog = ref(null);

  onClickOutside(dialog, () => {
    emit('update:show', false);
  });

  const settings = useUserjsDiggerSettings();
  const enable = useSessionStorage('ud_show', true);

  const { t } = useI18n();

  const inputVal = ref('');
  const onFilterAdd = () => {
    if (inputVal.value !== '') {
      settings.value.filter.push(inputVal.value);
      inputVal.value = '';
    }
  };
  const onFilterBack = useThrottleFn(() => {
    if (settings.value.filter.length > 0 && inputVal.value === '')
      settings.value.filter.splice(settings.value.filter.length - 1);
  }, 500);
</script>
