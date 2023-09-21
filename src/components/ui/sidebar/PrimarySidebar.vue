<template>
  <div class="primary-sidebar">
    <div class="primary-sidebar__top-part">
      <RouterLink :to="Routes.FLORPLAN" class="primary-sidebar__logo">
        <img src="@/assets/icon/harfa-logo.svg" alt="Galerie Harfa" />
      </RouterLink>
      <NavigationMenu />
    </div>
    <NavigationFooter />
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
