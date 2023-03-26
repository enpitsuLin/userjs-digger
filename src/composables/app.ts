export const useInjectContainer = () => inject<HTMLDivElement>('container')!;

export const useUserjsDiggerSettings = () =>
  useGMStorage('ud_settings', {
    locale: navigator.language ?? 'en'
  });
