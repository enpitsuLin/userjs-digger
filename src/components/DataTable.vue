<template>
  <div class="inline-block min-w-full align-middle">
    <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
      <table class="min-w-full divide-y divide-$ud-border-secondary">
        <thead class="bg-$ud-bg-secondary sticky">
          <tr>
            <th scope="col" class="relative p-2">
              <span class="sr-only">Toggle expand</span>
            </th>
            <th
              scope="col"
              class="w-60 py-2 pl-4 pr-3 text-left text-xs font-semibold"
            >
              Title
            </th>
            <th
              scope="col"
              class="w-16 px-3 py-2 text-left text-xs font-semibold"
            >
              Daily
            </th>
            <th
              scope="col"
              class="w-20 px-3 py-2 text-left text-xs font-semibold"
            >
              Update
            </th>
            <th scope="col" class="relative py-2 pl-3 pr-4">
              <span class="sr-only">Install</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-$ud-border bg-$ud-bg">
          <template v-for="(item, i) of data" :key="item.id">
            <tr>
              <td
                class="relative whitespace-nowrap p-2 text-right text-xs font-medium cursor-pointer"
                @click="toggleExpand(i)"
              >
                <div
                  class="i-carbon-chevron-right"
                  :class="expanded[i] && 'rotate-90'"
                ></div>
              </td>
              <td
                :title="item.name"
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden py-2 pl-4 pr-3 text-xs font-medium max-w-60"
              >
                {{ item.name }}
              </td>
              <td
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden px-3 py-2 text-xs text-$ud-text-secondary"
              >
                {{ item.daily_installs }}
              </td>
              <td
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden px-3 py-2 text-xs text-$ud-text-secondary"
              >
                {{ formatTimeAgo(new Date(item.code_updated_at)) }}
              </td>
              <td
                class="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-xs font-medium"
              >
                <a
                  :href="item.code_url"
                  target="_blank"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Install
                  <span class="sr-only">, {{ item.name }}</span>
                </a>
              </td>
            </tr>
            <tr v-if="expanded[i]">
              <td colspan="5" class="py-2">
                <div class="m-4">expand content</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <template v-if="data.length === 0">
        <div class="p-3 text-center text-sm">
          There has no Userjs for this site
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatTimeAgo } from '@vueuse/core';
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
</script>
