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
  const apiEndpoint = `${site}/en/scripts/by-site/${host}.json`;
  return useFetch(apiEndpoint, { fetch: unsafeWindow.fetch, immediate }).json<
    GreasyforkScript[]
  >();
}

export function useDataList() {
  const settings = useUserjsDiggerSettings();
  const { data: greasyfork } = useGreasyfork();
  const { data: sleazyfork, execute } = useGreasyfork(
    'https://sleazyfork.org',
    false
  );
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
    );
  });

  return data;
}
