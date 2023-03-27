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
  import { Position } from '@vueuse/core';

  const props = defineProps<{ modelValue: boolean }>();
  const emit = defineEmits<{ (e: 'update:modelValue', p: boolean): void }>();

  const fab = ref(null);

  const { width: fabWidth, height: fabHeight } = useElementBounding(fab);

  const { width, height } = useWindowSize();

  const storePosition = computed<Position>({
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

  watchDebounced(
    () => ({ x: x.value, y: y.value }),
    (val) => {
      storePosition.value = val;
    },
    { debounce: 500, deep: true }
  );

  watch(isDragging, (val) => {
    if (!val) {
      if (x.value >= width.value / 2)
        x.value = width.value - fabWidth.value - 16;
      else x.value = 16;
      if (y.value >= height.value - fabHeight.value)
        y.value = height.value - fabHeight.value;
      else if (y.value < -16) y.value = 0;
    }
  });

  watch(
    width,
    (w, oldW) => {
      if (x.value >= (oldW ?? height.value) / 2)
        x.value = w - fabWidth.value - 16;
      else x.value = 16;
    },
    { immediate: true }
  );

  watch(
    height,
    (h, oldH) => {
      if (y.value >= (oldH ?? height.value) / 2) {
        const bottom = (oldH ?? height.value) - y.value;
        y.value = h - bottom;
      }
    },
    { immediate: true }
  );
</script>
