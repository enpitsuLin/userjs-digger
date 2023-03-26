<template>
  <div class="inline-block min-w-full align-middle">
    <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
      <table class="min-w-full divide-y divide-$ud-border-secondary">
        <thead class="bg-$ud-bg-secondary sticky">
          <tr>
            <th scope="col" class="relative p-2">
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
              class="w-18 px-3 py-2 text-left text-xs font-semibold"
            >
              {{ t('table.daily') }}
            </th>
            <th
              scope="col"
              class="w-20 px-3 py-2 text-left text-xs font-semibold"
            >
              {{ t('table.update') }}
            </th>
            <th scope="col" class="relative py-2 pl-3 pr-4">
              <span class="sr-only">{{ t('table.install') }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-$ud-border bg-$ud-bg">
          <template v-for="(item, i) of data" :key="item.id">
            <tr>
              <td
                class="relative truncate p-2 text-right text-xs font-medium cursor-pointer"
                @click="toggleExpand(i)"
              >
                <div
                  class="i-carbon-chevron-right"
                  :class="expanded[i] && 'rotate-90'"
                ></div>
              </td>
              <td
                :title="item.name"
                class="break-all truncate py-2 pl-4 pr-3 text-xs font-medium max-w-60"
              >
                {{ item.name }}
              </td>
              <td
                class="break-all truncate px-3 py-2 text-xs text-$ud-text-secondary"
              >
                {{ item.daily_installs }}
              </td>
              <td
                class="break-all truncate px-3 py-2 text-xs text-$ud-text-secondary"
              >
                {{ formatTimeAgoWithI18n(new Date(item.code_updated_at)) }}
              </td>
              <td
                class="relative truncate py-2 pl-3 pr-4 text-right text-xs font-medium"
              >
                <a
                  :href="item.code_url"
                  target="_blank"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  {{ t('table.install') }}
                  <span class="sr-only">, {{ item.name }}</span>
                </a>
              </td>
            </tr>
            <tr v-if="expanded[i]">
              <td colspan="5" class="py-2">
                <div class="mx-2">
                  <dl class="text-xs grid grid-cols-6 gap-y-2">
                    <dt class="font-semibold">{{ t('table.version') }}</dt>
                    <dd class="text-$ud-text">{{ item.version }}</dd>
                    <dt class="font-semibold">{{ t('table.score') }}</dt>
                    <dd class="text-$ud-text">{{ item.fan_score }}</dd>
                    <dt class="font-semibold">
                      {{ t('table.total-installs') }}
                    </dt>
                    <dd class="text-$ud-text">
                      {{ item.total_installs.toLocaleString() }}
                    </dd>
                    <dt class="font-semibold">{{ t('table.authors') }}</dt>
                    <dd class="col-span-5 text-$ud-text">
                      <a
                        v-for="user in item.users"
                        :key="user.id"
                        :href="user.url"
                        target="_blank"
                        class="underline underline-2 underline-$ud-bg"
                      >
                        {{ user.name }}
                      </a>
                    </dd>
                    <dt class="font-semibold">{{ t('table.description') }}</dt>
                    <dd class="col-span-5 text-$ud-text">
                      {{ item.description }}
                    </dd>
                  </dl>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <template v-if="data.length === 0">
        <div class="p-3 text-center text-sm">
          {{ t('table.empty') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatTimeAgo, UseTimeAgoUnitNamesDefault } from '@vueuse/core';
  import { GreasyforkScript } from '../composables/data';

  const props = defineProps<{ data: GreasyforkScript[] }>();
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

  const { t } = useI18n();

  const formatTimeAgoWithI18n = (from: Date) => {
    return formatTimeAgo<UseTimeAgoUnitNamesDefault>(from, {
      messages: {
        justNow: t('time-ago.just-now'),
        past: (n) => (n.match(/\d/) ? t('time-ago.past', { n }) : n),
        future: (n) => (n.match(/\d/) ? t('time-ago.future', { n }) : n),
        month: (n, past) =>
          n === 1
            ? past
              ? t('time-ago.month.past')
              : t('time-ago.month.future')
            : t('time-ago.month.n', { n }),
        year: (n, past) =>
          n === 1
            ? past
              ? t('time-ago.year.past')
              : t('time-ago.year.future')
            : t('time-ago.year.n', { n }),
        day: (n, past) =>
          n === 1
            ? past
              ? t('time-ago.day.past')
              : t('time-ago.day.future')
            : t('time-ago.day.n', { n }),
        week: (n, past) =>
          n === 1
            ? past
              ? t('time-ago.week.past')
              : t('time-ago.week.future')
            : t('time-ago.week.n', { n }),
        hour: (n) => t('time-ago.hour', { n }),
        minute: (n) => t('time-ago.minute', { n }),
        second: (n) => t('time-ago.second', { n }),
        invalid: 'invalid'
      }
    });
  };
</script>
