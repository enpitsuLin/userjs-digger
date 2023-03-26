<script setup lang="ts">
  import psl from 'psl';

  const target = ref(null);

  const [collapse, toggleCollapse] = useToggle(false);

  const container = useInjectContainer();

  onClickOutside(
    target,
    (val) => {
      if (val) {
        toggleCollapse(false);
        toggleShowTable(false);
      }
    },
    { ignore: [container] }
  );

  const [showTable, toggleShowTable] = useToggle(false);
  const data = useDataList();

  const pagePsl = computed(() => {
    return psl.get(window.location.hostname);
  });
  const enable = useSessionStorage('ud_show', true);

  const [settingShow, toggleSettingShow] = useToggle(false);
</script>

<template>
  <SettingsPanel v-model:show="settingShow" />
  <template v-if="enable">
    <FloatActionButton v-model="collapse" />
    <div
      ref="target"
      :class="[collapse ? 'translate-x-0' : 'translate-x-[calc(100%_+_1rem)]']"
      class="fixed rounded-lg bg-$ud-bg text-$ud-text right-4 bottom-4 w-130 transition-all shadow-md divide-y divide-$ud-border-secondary"
    >
      <header
        class="w-full flex px-3 items-center select-none cursor-pointer"
        @click="toggleShowTable()"
      >
        <div>
          <div
            class="i-carbon-chevron-left"
            :class="showTable ? '-rotate-90' : 'rotate-90'"
          ></div>
        </div>
        <span class="p-2 text-sm truncate">
          <i18n-t keypath="tip">
            <template #count>
              <span
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
        </span>
        <div
          class="ml-auto hover:bg-$ud-bg-hover rounded p-1"
          @click.stop="toggleSettingShow(true)"
        >
          <div class="i-carbon:settings-adjust"></div>
        </div>
        <div
          class="hover:bg-$ud-bg-hover rounded p-1"
          @click.stop="toggleCollapse(false)"
        >
          <div class="i-carbon-close"></div>
        </div>
      </header>
      <section v-if="showTable" class="h-60 overflow-y-auto">
        <DataTable :data="data ?? []" />
      </section>
    </div>
  </template>
</template>
