<template>
  <div
    class="p-2 gap-y-1 inline-flex flex-wrap relative shadow-sm border-1px border-$ud-border rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"
  >
    <div
      v-for="(item, i) of tags"
      class="inline-flex mr-1 rounded-full items-center py-0.5 pl-2.5 pr-1 text-xs font-medium bg-indigo-100 text-indigo-700"
    >
      <span>
        {{ item }}
      </span>
      <button
        type="button"
        class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
        @click="removeByIndex(i)"
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
</template>
<script setup lang="ts">
  const inputVal = ref('');
  const props = defineProps<{ tags: string[] }>();
  const emit = defineEmits<{ (e: 'update:tags', p: string[]): void }>();
  const onFilterAdd = () => {
    if (inputVal.value !== '') {
      emit('update:tags', [...props.tags, inputVal.value]);
      inputVal.value = '';
    }
  };
  const onFilterBack = useThrottleFn(() => {
    if (props.tags.length > 0 && inputVal.value === '') {
      removeByIndex(props.tags.length - 1);
    }
  }, 500);

  const removeByIndex = (index: number) => {
    emit(
      'update:tags',
      props.tags.filter((_, i) => i !== index)
    );
  };
</script>
