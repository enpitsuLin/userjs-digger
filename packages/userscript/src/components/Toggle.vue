<template>
  <button
    type="button"
    class="relative inline-flex flex-shrink-0 h-4 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    :class="modelValue ? 'bg-indigo-600' : 'bg-gray-200'"
    role="switch"
    :aria-checked="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
      :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
    ></span>
  </button>
</template>
<script setup lang="ts">
  defineProps<{ modelValue: boolean }>();
  defineEmits<{ (e: 'update:modelValue', p: boolean): void }>();
</script>
