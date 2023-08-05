<script setup lang="ts">
import type { Position } from '@vueuse/core'
import { FAB_POSITION_KEY } from '../constants'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', p: boolean): void }>()

const fab = ref(null)

const { width: fabWidth, height: fabHeight } = useElementBounding(fab)

const { width, height } = useWindowSize()

const position = useGMStorage<Position>(FAB_POSITION_KEY, {
  x: width.value - 64,
  y: height.value - 64,
})

const time = ref(+new Date())
const { isDragging, x, y, style } = useDraggable(fab, {
  initialValue: position,
  preventDefault: true,
  onStart: () => {
    time.value = +new Date()
  },
  onEnd: (_pos) => {
    if (+new Date() - time.value < 100)
      emit('update:modelValue', !props.modelValue)
  },
})

const isLeft = computed(() => x.value < width.value / 2)

watchDebounced(
  () => ({ x: x.value, y: y.value }),
  (val) => {
    position.value = val
  },
  { debounce: 500, deep: true },
)

watch(isDragging, (val) => {
  if (!val) {
    if (x.value >= width.value / 2)
      x.value = width.value - fabWidth.value - 32
    else x.value = 16
    if (y.value >= height.value - fabHeight.value)
      y.value = height.value - fabHeight.value
    else if (y.value < -16)
      y.value = 0
  }
})

watch(width, (w, oldW) => {
  if (x.value >= (oldW ?? height.value) / 2)
    x.value = w - fabWidth.value - 16
  else x.value = 16
})

watch(height, (h, oldH) => {
  if (y.value >= (oldH ?? height.value) / 2) {
    const bottom = (oldH ?? height.value) - y.value
    y.value = h - bottom
  }
})
</script>

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
        : 'translate-x-0',
    ]"
    style="touch-action: none"
    :style="style"
  >
    <div class="select-none">
      <div class="i-carbon-settings w-4 h-4" />
    </div>
  </div>
</template>
