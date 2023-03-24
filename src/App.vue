<script setup lang="ts">
  import FloatActionButton from './components/FloatActionButton.vue';

  const target = ref(null);

  const [collapse, toggleCollapse] = useToggle(false);

  onClickOutside(target, (val) => {
    if (val) {
      toggleCollapse(false);
      toggleShowTable(false);
    }
  });

  const [showTable, toggleShowTable] = useToggle(false);
</script>

<template>
  <FloatActionButton v-model="collapse" />
  <div
    ref="target"
    :class="[collapse ? 'translate-x-0' : 'translate-x-[calc(100%_+_1rem)]']"
    class="fixed bg-white right-4 bottom-4 w-30vw transition-all shadow-md text-black divide-y divide-gray-300"
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
    <section v-if="showTable" class="p-2">table</section>
  </div>
</template>
