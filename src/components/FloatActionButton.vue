<template>
  <div class="fixed right-4 bottom-4">
    <div
      class="bg-white transition-all shadow-md overflow-hidden rounded-md cursor-pointer flex"
      :class="modelValue ? 'translate-x-[calc(100%_+_1rem)]' : 'translate-x-0'"
    >
      <div class="p-2" @click="$emit('update:modelValue', !modelValue)">
        <div class="i-carbon:settings w-4 h-4"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{ modelValue: boolean }>();
  defineEmits<{ (e: 'update:modelValue', p: boolean): void }>();
</script>
