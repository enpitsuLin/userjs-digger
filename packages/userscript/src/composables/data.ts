import { AfterFetchContext } from '@vueuse/core';
import { getTypedFilter } from '@userjs-digger/utils';
import { MaybeRefOrGetter } from 'vue';

export type GreasyforkScriptUser = {
  id: number;
  name: string;
  url: string;
};

export type GreasyforkScript = {
  bad_ratings: number;
  code_updated_at: string;
  code_url: string;
  contribution_amount: null | number;
  contribution_url: null | string;
  created_at: string;
  daily_installs: number;
  deleted: false;
  description: string;
  fan_score: string;
  good_ratings: number;
  id: number;
  license: null | string;
  locale: string;
  name: string;
  namespace: string;
  ok_ratings: number;
  support_url: null | string;
  total_installs: number;
  url: string;
  users: GreasyforkScriptUser[];
  version: string;
};

const cacheData = new Map<string, GreasyforkScript[]>();

export function useGreasyfork(
  host: MaybeRefOrGetter<string>,
  { site, immediate }: { site?: string; immediate?: boolean } = {
    site: 'https://greasyfork.org',
    immediate: true
  }
) {
  const apiEndpoint = computed(
    () => `${site}/scripts/by-site/${resolveUnref(host)}.json`
  );
  const fetch = unsafeWindow.fetch;
  const afterFetch = async ({
    data: prevData,
    response
  }: AfterFetchContext<GreasyforkScript[]>): Promise<
    Partial<AfterFetchContext<GreasyforkScript[]>>
  > => {
    if (prevData?.length === 50) {
      const prevPage =
        Number(new URL(response.url).searchParams.get('page')) || 1;
      const nextPage = `${apiEndpoint.value}?page=${prevPage + 1}`;
      const { data, execute } = useFetch(nextPage, {
        fetch,
        immediate: false,
        afterFetch
      }).json<GreasyforkScript[]>();
      await execute();

      return {
        response: new Response(),
        data: prevData?.concat(data.value ?? [])
      };
    }
    return { data: prevData };
  };
  return useFetch(apiEndpoint, {
    fetch,
    immediate,
    afterFetch
  }).json<GreasyforkScript[]>();
}

export function useDataList(host: MaybeRefOrGetter<string>) {
  const settings = useUserjsDiggerSettings();
  const {
    data: greasyfork,
    isFetching,
    execute: executeGreasyfork
  } = useGreasyfork(host);
  const {
    data: sleazyfork,
    execute: executeSleazyfork,
    isFetching: isSleazyforkFetching
  } = useGreasyfork(host, { site: 'https://sleazyfork.org', immediate: false });
  watch(
    () => settings.value.nsfw,
    (val) => {
      if (val) {
        if (!sleazyfork.value) executeSleazyfork();
      }
    },
    { immediate: true }
  );

  const data = computed(() => {
    return (
      greasyfork.value?.concat(
        settings.value.nsfw ? sleazyfork.value ?? [] : []
      ) ?? []
    ).filter((item) =>
      settings.value.filter.every((keywords) => {
        const filter = getTypedFilter(keywords);
        if (filter.type === 'title') return !filter.regexp.test(item.name);
        else return item.users.every((user) => !filter.regexp.test(user.name));
      })
    );
  });

  const isLoading = computed(() => {
    if (settings.value.nsfw)
      return isFetching.value || isSleazyforkFetching.value;
    return isFetching.value;
  });

  const execute = () => {
    greasyfork.value = [];
    sleazyfork.value = [];
    executeGreasyfork();
    if (settings.value.nsfw) {
      executeSleazyfork();
    }
  };

  return { data, isLoading, execute };
}
