<script setup lang="ts">
const collapse = ref(false)

const enable = useSessionStorage('ud_show', true)

const [settingShow, toggleSettingShow] = useToggle(false)
</script>

<template>
  <SettingsPanel v-model:show="settingShow" />
  <template v-if="enable">
    <FloatActionButton v-model="collapse" />
    <MainPanel v-model:show="collapse" @setting="toggleSettingShow(true)" />
  </template>
</template>
