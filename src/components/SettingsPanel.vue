<template>
  <div
    v-if="show"
    ref="dialog"
    class="fixed left-1/2 -translate-x-1/2 top-1/3 w-100 shadow-md rounded bg-$ud-bg text-$ud-text"
  >
    <div class="border-b border-b-$ud-border p-4 flex items-center">
      <div>Settings</div>
      <div
        class="ml-auto p-1 hover:bg-$ud-bg-hover rounded"
        @click="$emit('update:show', false)"
      >
        <div class="i-carbon-close"></div>
      </div>
    </div>
    <ul class="divide-y divide-$ud-border px-4 py-2">
      <li class="py-2 flex items-center justify-between space-x-4">
        <div class="flex flex-col w-4/5 overflow-hidden">
          <p class="text-sm font-medium">Enable on this page</p>
          <p class="text-sm text-$ud-text-secondary text-xs">
            To enable this plugin on this page or not (Session)
          </p>
        </div>
        <Toggle v-model="enable" />
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

  const enable = useSessionStorage('ud_show', true);
</script>
