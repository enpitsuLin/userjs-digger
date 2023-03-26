export const useInjectContainer = () => inject<HTMLDivElement>('container')!;

const defaultSettings: UserjsDiggerSettings = {
  locale: navigator.language ?? 'en',
  nsfw: false,
  filter: '',
  debugger: false
};
export const useUserjsDiggerSettings = () =>
  useGMStorage('ud_settings', defaultSettings);
