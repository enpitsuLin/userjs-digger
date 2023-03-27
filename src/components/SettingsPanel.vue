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
        <TagsInput v-model:tags="settings.filter" />
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
</script>
