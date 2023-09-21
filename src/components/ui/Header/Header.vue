<template>
  <div class="opacity-100 lg:opacity-0 relative lg:absolute top-0 lg:top-[-10000px] w-full py-[1vh] px-[2rem]">
    <div class="w-full flex flex-col gap-5">
      <div class="w-full flex items-center justify-between">
        <NavigationFooter class="!self-center" />
        <RouterLink :to="Routes.FLORPLAN" class="primary-sidebar__logo !mb-0">
          <img src="@/assets/icon/harfa-logo.svg" alt="Galerie Harfa" />
        </RouterLink>
        <div class="lang-switcher flex items-center">
          <LangSwitcher />
        </div>
      </div>
      <NavigationMenu />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Routes } from '@/imports'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss">
.weather-widget {
  display: flex;
  padding-right: 0px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  .weather-data {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>
