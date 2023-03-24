<script setup lang="ts">
  const target = ref(null);
  const { x, y, isOutside } = useMouseInElement(target);

  const [collapse, toggleCollapse] = useToggle(false);
  watch(isOutside, (val) => {
    if (val) {
      toggleCollapse(false);
      toggleShowTable(false);
    }
  });

  const [showTable, toggleShowTable] = useToggle(false);
</script>

<template>
  <div class="fixed right-4 bottom-4">
    <div
      ref="target"
      class="bg-white transition-all duration-500 shadow-md rounded-md cursor-pointer flex"
      :class="isOutside ? 'translate-x-5' : 'translate-x-none'"
    >
      <div :class="!collapse ? 'p-2' : ''" @click="toggleCollapse()">
        <div v-if="!collapse" class="i-carbon:settings w-4 h-4"></div>
      </div>
      <div
        :class="collapse ? 'w-30vw ' : 'w-0 h-0'"
        class="overflow-hidden transition-all text-black divide-y divide-gray-300"
      >
        <header
          class="flex px-3 items-center bg-gray-50"
          @click="toggleShowTable()"
        >
          <div>
            <div
              class="i-carbon:chevron-left"
              :class="showTable ? '-rotate-90' : 'rotate-90'"
            ></div>
          </div>
          <span class="p-2">title</span>
          <div
            class="ml-auto hover:bg-#eee rounded p-1"
            @click="toggleCollapse(false)"
          >
            <div class="i-carbon:close"></div>
          </div>
        </header>
        <section v-if="showTable">table</section>
      </div>
    </div>
  </div>
</template>
