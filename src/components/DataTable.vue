<template>
  <div class="inline-block min-w-full align-middle">
    <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50 sticky">
          <tr>
            <th scope="col" class="relative py-2 px-2">
              <span class="sr-only">Toggle expand</span>
            </th>
            <th
              scope="col"
              class="py-2 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 max-w-60"
            >
              Title
            </th>
            <th
              scope="col"
              class="px-3 py-2 text-left text-xs font-semibold text-gray-900"
            >
              Author(s)
            </th>
            <th
              scope="col"
              class="px-3 py-2 text-left text-xs font-semibold text-gray-900"
            >
              Daily
            </th>
            <th
              scope="col"
              class="px-3 py-2 text-left text-xs font-semibold text-gray-900"
            >
              Update
            </th>
            <th scope="col" class="relative py-2 pl-3 pr-4">
              <span class="sr-only">Install</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <template v-for="(item, i) of data" :key="item.id">
            <tr>
              <td
                class="relative whitespace-nowrap py-2.5 px-2 text-right text-xs font-medium cursor-pointer"
                @click="toggleExpand(i)"
              >
                <div
                  class="i-carbon:chevron-right"
                  :class="expanded[i] && 'rotate-90'"
                ></div>
              </td>
              <td
                :title="item.name"
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden py-2.5 pl-4 pr-3 text-xs font-medium text-gray-900 max-w-60"
              >
                {{ item.name }}
              </td>
              <td
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden px-3 py-2.5 text-xs text-gray-500"
              >
                {{ item.users.map((u) => u.name).join(',') }}
              </td>
              <td
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden px-3 py-2.5 text-xs text-gray-500"
              >
                {{ item.daily_installs }}
              </td>
              <td
                class="whitespace-nowrap text-ellipsis break-all overflow-hidden px-3 py-2.5 text-xs text-gray-500"
              >
                {{ formatTimeAgo(new Date(item.code_updated_at)) }}
              </td>
              <td
                class="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-xs font-medium"
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatTimeAgo } from '@vueuse/core';
  import { GreasyforkScript } from '../composables/data';

  const props = defineProps<{ data: GreasyforkScript[] }>();
  const expanded = ref<boolean[]>([]);
  watchArray(props.data, () => {
    expanded.value = Array.from({ length: props.data.length }, () => false);
  });
  const toggleExpand = (i: number) => {
    expanded.value[i] = !expanded.value[i];
  };
</script>
