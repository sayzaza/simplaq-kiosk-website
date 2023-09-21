<template>
  <div class="flex flex-row  lg:!flex-col gap-2 lg:gap-0 items-start lg:h-full lg:max-h-[calc(100vh-220px)] overflow-auto no-scrollbar">
    <div v-for="(item, index) in primaryMenu" :key="index">
      <RouterLink :to="item.to" :class="`primary-sidebar__link lg:border-0 border rounded-[24px] !border-backroundLightSeptenary lg:!border-transparent w-[156px] h-[134px] lg:w-auto lg:h-auto flex items-center justify-center  flex-col lg:flex-row`">
        <v-tooltip location="end" content-class="black tooltip-right tooltip-main-sidebar" :text="t(item.name)">
          <template v-slot:activator="{ props }">
            <Iconbase v-bind="props" width="24px" height="24px" class="nav-menu-icon" :name="item.ico"></Iconbase>
            <div v-bind="props" class="link-label text-center lg:!text-start">
              {{ t(item.name) }}
            </div>
          </template>
        </v-tooltip>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { primaryMenu } from '@/controllers/MenuConfig'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
