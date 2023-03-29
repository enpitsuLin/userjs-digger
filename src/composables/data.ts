import { AfterFetchContext, MaybeRef, UseFetchOptions } from '@vueuse/core';
import psl from 'psl';

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

export function useGreasyfork(
  site = 'https://greasyfork.org',
  immediate = true
) {
  const host = psl.get(window.location.hostname);
  const apiEndpoint = `${site}/scripts/by-site/${host}.json`;
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
      const nextPage = `${apiEndpoint}?page=${prevPage + 1}`;
      const { data, execute } = useFetch(nextPage, {
        fetch,
        immediate: false,
        afterFetch
      }).json<GreasyforkScript[]>();
      await execute();

      return {
        response: new Response(),
        data: prevData?.concat(
          data.value?.filter((i) => !!prevData.find((li) => i.id !== li.id)) ??
            []
        )
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

export function useDataList() {
  const settings = useUserjsDiggerSettings();
  const { data: greasyfork, isFetching } = useGreasyfork();
  const {
    data: sleazyfork,
    execute,
    isFetching: isSleazyforkFetching
  } = useGreasyfork('https://sleazyfork.org', false);
  watch(
    () => settings.value.nsfw,
    (val) => {
      if (val) {
        if (!sleazyfork.value) execute();
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
      settings.value.filter.every((keywords) => !item.name.includes(keywords))
    );
  });

  const isLoading = computed(() => {
    if (settings.value.nsfw)
      return isFetching.value && isSleazyforkFetching.value;
    return isFetching.value;
  });

  return { data, isLoading };
}
