export const useInjectContainer = () => inject<HTMLDivElement>('container')!;

const defaultSettings: UserjsDiggerSettings = {
  locale: navigator.language ?? 'en',
  nsfw: false,
  filter: [],
  debugger: false
};

const toString = Object.prototype.toString;

export const useUserjsDiggerSettings = () => {
  const settings = useGMStorage('ud_settings', defaultSettings);

  Object.entries(settings.value).forEach(([key, value]) => {
    if (
      toString.call(value) !==
      toString.call(defaultSettings[key as keyof UserjsDiggerSettings])
    ) {
      //@ts-expect-error
      settings.value[key as keyof UserjsDiggerSettings] =
        defaultSettings[key as keyof UserjsDiggerSettings];
    }
  });
  return settings;
};
