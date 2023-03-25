<template>
  <div
    ref="fab"
    class="fixed right-3 bottom-4 transition-transform ease-out"
    :class="isOutside ? 'translate-x-full' : 'translate-x-0'"
  >
    <div
      class="bg-$ud-bg text-$ud-text transition-all shadow-md overflow-hidden rounded-md cursor-pointer flex"
      :class="modelValue ? 'translate-x-[calc(100%_+_1rem)]' : 'translate-x-0'"
    >
      <div class="p-2" @click="$emit('update:modelValue', !modelValue)">
        <div class="i-carbon-settings w-4 h-4"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{ modelValue: boolean }>();
  defineEmits<{ (e: 'update:modelValue', p: boolean): void }>();

  const fab = ref(null);
  const { isOutside } = useMouseInElement(fab);
</script>
