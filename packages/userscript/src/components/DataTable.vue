<template>
  <div class="inline-block min-w-full align-middle">
    <div
      class="relative overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5"
    >
      <table class="min-w-full divide-y divide-$ud-border-secondary">
        <thead class="bg-$ud-bg-secondary select-none">
          <tr style="table-layout: fixed" class="table">
            <th scope="col" class="w-8 relative p-2">
              <span class="sr-only">{{ t('table.toggle-expand') }}</span>
            </th>
            <th
              scope="col"
              class="w-60 py-2 pl-4 pr-3 text-left text-xs font-semibold"
            >
              {{ t('table.title') }}
            </th>
            <th
              scope="col"
              class="w-20 px-2 py-2 text-left text-xs font-semibold cursor-pointer"
              @click="onSortClick('daily')"
            >
              <div class="inline-flex items-center">
                <div>
                  {{ t('table.daily') }}
                </div>
                <div class="relative ml-0.5">
                  <div :class="sortIcon(sort.daily)"></div>
                </div>
              </div>
            </th>
            <th
              scope="col"
              class="w-22 px-2 py-2 text-left text-xs font-semibold cursor-pointer"
              @click="onSortClick('updated')"
            >
              <div class="inline-flex items-center">
                <div>
                  {{ t('table.update') }}
                </div>
                <div class="relative ml-0.5">
                  <div :class="sortIcon(sort.updated)"></div>
                </div>
              </div>
            </th>
            <th scope="col" class="relative py-2 pl-3 pr-4">
              <span class="sr-only">{{ t('table.install') }}</span>
            </th>
          </tr>
        </thead>
        <tbody
          v-bind="containerProps"
          class="h-60 overflow-y-overlay block divide-y divide-$ud-border w-full bg-$ud-bg"
        >
          <div v-bind="wrapperProps">
            <template v-if="loading">
              <div class="flex items-center justify-center py-10">
                <svg
                  class="animate-spin w-10 h-10 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </template>
            <template v-else-if="data.length === 0">
              <div class="p-3 text-center text-sm">
                {{ t('table.empty') }}
              </div>
            </template>
            <template v-else v-for="item of list" :key="item.index">
              <tr class="table w-full">
                <td
                  class="w-8 relative truncate p-2 text-right text-xs font-medium cursor-pointer"
                  @click="toggleExpand(item.index)"
                >
                  <div
                    class="i-carbon-chevron-right"
                    :class="expanded[item.index] && 'rotate-90'"
                  ></div>
                </td>
                <td
                  :title="item.data.name"
                  class="w-60 break-all truncate py-2 pl-4 pr-3 text-xs font-medium max-w-60"
                >
                  <a :href="item.data.url" target="_blank">
                    {{ item.data.name }}
                  </a>
                </td>
                <td
                  class="w-20 break-all truncate px-3 py-2 text-xs text-$ud-text-secondary"
                >
                  {{ item.data.daily_installs }}
                </td>
                <td
                  class="w-22 break-all truncate px-3 py-2 text-xs text-$ud-text-secondary"
                >
                  {{
                    formatTimeAgoWithI18n(new Date(item.data.code_updated_at))
                  }}
                </td>
                <td
                  class="relative truncate py-2 pl-3 pr-4 text-right text-xs font-medium"
                >
                  <a
                    :href="item.data.code_url"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    {{ t('table.install') }}
                    <span class="sr-only">, {{ item.data.name }}</span>
                  </a>
                </td>
              </tr>
              <tr class="table w-full" v-if="expanded[item.index]">
                <td colspan="5" class="py-2">
                  <div class="mx-2">
                    <dl class="text-xs grid grid-cols-6 gap-y-2">
                      <dt class="font-semibold">{{ t('table.version') }}</dt>
                      <dd class="text-$ud-text">{{ item.data.version }}</dd>
                      <dt class="font-semibold">{{ t('table.score') }}</dt>
                      <dd class="text-$ud-text">{{ item.data.fan_score }}</dd>
                      <dt class="font-semibold">
                        {{ t('table.total-installs') }}
                      </dt>
                      <dd class="text-$ud-text">
                        {{ item.data.total_installs.toLocaleString() }}
                      </dd>
                      <dt class="font-semibold">{{ t('table.authors') }}</dt>
                      <dd class="col-span-5 text-$ud-text">
                        <a
                          v-for="user in item.data.users"
                          :key="user.id"
                          :href="user.url"
                          target="_blank"
                          class="underline underline-$ud-border"
                        >
                          {{ user.name }}
                        </a>
                      </dd>
                      <dt class="font-semibold">
                        {{ t('table.description') }}
                      </dt>
                      <dd class="col-span-5 text-$ud-text">
                        {{ item.data.description }}
                      </dd>
                    </dl>
                  </div>
                </td>
              </tr>
            </template>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatTimeAgoWithI18n } from '../utils/date';
  import { GreasyforkScript } from '../composables/data';

  const props = defineProps<{ data: GreasyforkScript[]; loading: boolean }>();
  const expanded = ref<boolean[]>([]);

  watchArray(
    () => props.data,
    () => {
      expanded.value = Array.from({ length: props.data.length }, () => false);
    }
  );
  const toggleExpand = (i: number) => {
    expanded.value[i] = !expanded.value[i];
  };

  const sort = reactive({
    updated: '' as '' | 'desc' | 'asc',
    daily: '' as '' | 'desc' | 'asc'
  });

  const sortedData = useSorted(
    computed(() => props.data),
    (a, b) => {
      if (sort.updated !== '') {
        if (sort.updated === 'asc')
          return +new Date(a.code_updated_at) - +new Date(b.code_updated_at);
        return +new Date(b.code_updated_at) - +new Date(a.code_updated_at);
      }
      if (sort.daily === 'asc') return a.daily_installs - b.daily_installs;
      return b.daily_installs - a.daily_installs;
    }
  );

  const { list, containerProps, wrapperProps } = useVirtualList(sortedData, {
    itemHeight: (index) => {
      if (expanded.value[index]) return 112;
      else return 32;
    }
  });

  const sortIcon = (sort: '' | 'desc' | 'asc') => {
    if (sort === '') return 'i-carbon-caret-sort';
    return { desc: 'i-carbon-caret-sort-down', asc: 'i-carbon-caret-sort-up' }[
      sort
    ];
  };
  const onSortClick = (key: 'daily' | 'updated') => {
    sort[key] = sort[key] === '' ? 'desc' : sort[key] === 'desc' ? 'asc' : '';
    sort[key === 'daily' ? 'updated' : 'daily'] = '';
  };

  const { t } = useI18n();
</script>
