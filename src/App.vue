<script setup lang="ts">
  const target = ref(null);

  const [collapse, toggleCollapse] = useToggle(false);

  onClickOutside(target, (val) => {
    if (val) {
      toggleCollapse(false);
      toggleShowTable(false);
    }
  });

  const [showTable, toggleShowTable] = useToggle(false);
  const { isFetching, error, data } = useGreasyfork();
</script>

<template>
  <FloatActionButton v-model="collapse" />
  <div
    ref="target"
    :class="[collapse ? 'translate-x-0' : 'translate-x-[calc(100%_+_1rem)]']"
    class="fixed rounded-lg bg-$ud-bg text-$ud-text right-4 bottom-4 w-35vw transition-all shadow-md divide-y divide-$ud-border-secondary"
  >
    <header class="w-full flex px-3 items-center" @click="toggleShowTable()">
      <div>
        <div
          class="i-carbon-chevron-left"
          :class="showTable ? '-rotate-90' : 'rotate-90'"
        ></div>
      </div>
      <span class="p-2 text-sm">
        Found
        <span
          class="rounded-full px-2 py-0.25 text-xs bg-indigo-500 text-white"
          >{{ data?.length }}</span
        >
        user scripts for the page
      </span>
      <div
        class="ml-auto hover:bg-$ud-bg-hover rounded p-1"
        @click.stop="toggleCollapse(false)"
      >
        <div class="i-carbon-close"></div>
      </div>
    </header>
    <section v-if="showTable" class="h-40 overflow-y-auto">
      <DataTable :data="data ?? []" />
    </section>
  </div>
</template>
