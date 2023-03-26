<template>
  <div
    ref="fab"
    class="fixed ease-out rounded-md shadow-md bg-$ud-bg text-$ud-text p-2"
    :class="[
      isDragging ? 'transition-transform' : 'transition-all',
      modelValue
        ? isLeft
          ? '-translate-x-[calc(100%_+_1rem)]'
          : 'translate-x-[calc(100%_+_1rem)]'
        : 'translate-x-0'
    ]"
    style="touch-action: none"
    :style="style"
  >
    <div class="select-none">
      <div class="i-carbon-settings w-4 h-4"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{ modelValue: boolean }>();
  const emit = defineEmits<{ (e: 'update:modelValue', p: boolean): void }>();

  const fab = ref(null);

  const { width, height } = useWindowSize();

  const storePosition = computed({
    get: () => {
      const x = GM_getValue('ud_position_x', width.value - 64);
      const y = GM_getValue('ud_position_y', height.value - 64);
      return { x, y };
    },
    set(v) {
      GM_setValue('ud_position_x', v.x);
      GM_setValue('ud_position_y', v.y);
    }
  });

  const time = ref(+new Date());
  const { isDragging, x, y, style } = useDraggable(fab, {
    initialValue: storePosition,
    preventDefault: true,
    onStart: () => {
      time.value = +new Date();
    },
    onEnd: (pos) => {
      if (+new Date() - time.value < 100) {
        emit('update:modelValue', !props.modelValue);
      }
    }
  });

  const isLeft = computed(() => x.value < width.value / 2);

  watch(isDragging, (val) => {
    if (!val) {
      if (x.value >= width.value / 2) x.value = width.value - 32 - 32;
      else x.value = 16;

      storePosition.value = { x: x.value, y: y.value };
    }
  });

  watch(width, (w, oldW) => {
    if (x.value >= oldW / 2) x.value = w - 32 - 32;
    else x.value = 16;
  });

  watch(height, (h, oldH) => {
    if (y.value >= oldH / 2) {
      const bottom = oldH - y.value;
      y.value = h - bottom;
    }
  });
</script>
