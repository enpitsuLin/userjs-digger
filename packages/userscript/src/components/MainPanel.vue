<script setup lang="ts">
  import psl from 'psl';
  defineProps<{ show: boolean }>();
  const emit = defineEmits<{
    (e: 'update:show', p: boolean): void;
    (e: 'setting'): void;
  }>();

  const target = ref(null);

  const container = useInjectContainer();
  onClickOutside(
    target,
    (val) => {
      if (val) {
        emit('update:show', false);
        toggleShowTable(false);
      }
    },
    { ignore: [container] }
  );

  const [showTable, toggleShowTable] = useToggle(false);

  const pagePsl = computed(() => {
    if (searchSite.value === '') return psl.get(window.location.hostname) ?? '';
    return searchSite.value;
  });

  const searchSite = ref('');
  const [search, toggleSearch] = useToggle(false);
  const searchInput = ref<HTMLInputElement>();

  const onSearchEnter = () => {
    toggleSearch(false);
    execute();
  };

  const { data, isLoading, execute } = useDataList(pagePsl);
</script>
<template>
  <div
    ref="target"
    :class="[show ? 'translate-x-0' : 'translate-x-[calc(100%_+_1rem)]']"
    class="fixed rounded-lg bg-$ud-bg text-$ud-text right-4 bottom-4 w-130 transition-all shadow-md divide-y divide-$ud-border-secondary"
  >
    <header
      class="relative w-full flex px-3 items-center select-none cursor-pointer"
      @click="toggleShowTable()"
    >
      <div>
        <div
          class="i-carbon-chevron-left"
          :class="showTable ? '-rotate-90' : 'rotate-90'"
        ></div>
      </div>
      <div v-show="!search" class="p-2 text-sm truncate">
        <i18n-t keypath="tip">
          <template #count>
            <span
              :class="isLoading && 'animate-pulse text-transparent'"
              class="rounded-full mx-1 px-2 py-0.25 text-xs bg-indigo-500 text-white"
            >
              {{ data?.length }}
            </span>
          </template>
          <template #host>
            <span :title="pagePsl ?? ''">
              {{ pagePsl }}
            </span>
          </template>
        </i18n-t>
      </div>
      <div v-show="search" class="p-2 leading-5 flex-1">
        <input
          ref="searchInput"
          v-model="searchSite"
          type="text"
          class="bg-$ud-bg text-sm p-0 border-none rounded-sm px-1 w-full"
          :placeholder="$t('search-placeholder')"
          @click.stop
          @keypress.enter="onSearchEnter()"
        />
      </div>
      <div
        class="ml-auto hover:bg-$ud-bg-hover rounded p-1"
        @click.stop="toggleSearch()"
      >
        <div class="i-carbon:search"></div>
      </div>
      <div
        class="hover:bg-$ud-bg-hover rounded p-1"
        @click.stop="$emit('setting')"
      >
        <div class="i-carbon:settings-adjust"></div>
      </div>
      <div
        class="hover:bg-$ud-bg-hover rounded p-1"
        @click.stop="$emit('update:show', false)"
      >
        <div class="i-carbon-close"></div>
      </div>
    </header>
    <section v-if="showTable">
      <DataTable :data="data ?? []" :loading="isLoading" />
    </section>
  </div>
</template>
