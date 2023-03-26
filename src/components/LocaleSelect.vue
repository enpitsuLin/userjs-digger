<template>
  <div class="mt-1 relative">
    <button
      ref="button"
      type="button"
      class="relative w-full bg-$ud-bg border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      aria-haspopup="listbox"
      :aria-expanded="show"
      @click="toggleShow()"
      @keydown.arrow-down.prevent="onKeyboardShow()"
    >
      <div class="flex items-center">
        <span class="block truncate uppercase"> {{ locale }} </span>
      </div>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <div class="i-carbon-chevron-sort"></div>
      </span>
    </button>

    <Transition
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        v-if="show"
        ref="listbox"
        class="absolute z-10 mt-1 w-full bg-$ud-bg shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        tabindex="-1"
        :aria-activedescendant="`listbox-option-${activedescendant}`"
      >
        <li
          v-for="(lang, index) in locales"
          class="group text-$ud-text cursor-default select-none relative py-2 pl-3 pr-9 focus:text-white focus:bg-indigo-600 hover:text-white hover:bg-indigo-600"
          role="option"
          tabindex="0"
          :id="`listbox-option-${index + 1}`"
          @click="onChangeLocale(lang)"
          @keydown.enter.prevent="onLocaleEnter(lang)"
          @keydown.arrow-up.prevent="onKeyArrowUp"
          @keydown.arrow-down.prevent="onKeyArrowDown"
          @keydown.esc.prevent="onEsc"
        >
          <div class="flex items-center">
            <span
              class="font-normal block truncate uppercase"
              :class="locale === lang ? 'font-semibold' : 'font-normal'"
            >
              {{ lang }}
            </span>
          </div>

          <span
            v-if="lang === locale"
            class="text-indigo-600 group-focus:text-$ud-text hover:text-$ud-text absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <div class="i-carbon-checkmark"></div>
          </span>
        </li>
      </ul>
    </Transition>
  </div>
</template>
<script setup lang="ts">
  const { locale, messages } = useI18n({ useScope: 'global' });
  const [show, toggleShow] = useToggle(false);

  const locales = computed(() => Object.keys(messages.value));

  const onChangeLocale = (to: string) => {
    locale.value = to;
    toggleShow(false);
  };

  const button = ref<HTMLButtonElement | null>(null);

  const listbox = ref<HTMLUListElement | null>(null);

  const activedescendant = ref(0);

  const onKeyboardShow = () => {
    toggleShow(true);
    nextTick(() => {
      (listbox.value?.children.item(0) as HTMLLIElement).focus();
    });
  };

  const onKeyArrowUp = (e: KeyboardEvent) => {
    activedescendant.value =
      activedescendant.value - 1 < 0
        ? locales.value.length - 1
        : activedescendant.value - 1;
    const parentEl = (e.target as HTMLLIElement).parentElement;
    if (!parentEl) return;

    activedescendant.value,
      (parentEl.children.item(activedescendant.value) as HTMLLIElement).focus();
  };

  const onKeyArrowDown = (e: KeyboardEvent) => {
    activedescendant.value =
      activedescendant.value + 1 > locales.value.length - 1
        ? 0
        : activedescendant.value + 1;
    const parentEl = (e.target as HTMLLIElement).parentElement;
    if (!parentEl) return;

    activedescendant.value,
      (parentEl.children.item(activedescendant.value) as HTMLLIElement).focus();
  };

  const onLocaleEnter = (to: string) => {
    onChangeLocale(to);
    button.value?.focus();
  };

  const onEsc = () => {
    toggleShow(false);
    button.value?.focus();
  };

  watch(locale, (val) => {
    GM_setValue('ud_locale', val);
  });
</script>
