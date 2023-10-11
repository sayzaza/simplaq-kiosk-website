<template>
  <div class="page-container">
    <div class="flex-container">
      <div class="page-body">
        <div class="flex flex-col min-h-[100vh] max-h-[100vh] rounded-[3em] bg-backroundLightSeptenary overflow-auto no-scrollbar">
          <div class="page-body-header">
            <div class="page-body-header__wrapper">
              <div v-if="props.subPage && props.fromSubPageTo" class="flex items-center gap-6">
                <RouterLink :to="props.fromSubPageTo" class="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center">
                  <Iconbase name="ArrowLeftIcon" width="24" height="24" />
                </RouterLink>
                <h2 class="page-body-header__title text-black leading-[38px] font-bold tracking-[-1%] text-4xl">
                  {{ t(currentRoute.name as string) }}
                </h2>
              </div>
              <h2 v-else class="page-body-header__title text-black leading-[38px] font-bold tracking-[-1%] text-4xl">
                {{ t(currentRoute.name as string) }}
              </h2>
              <div class="absolute top-[-10000px] opacity-0 lg:relative lg:opacity-100 lg:top-0">
                <!-- supports all the flag components from components/icons/Flag_XX.vue -->
                <LangSwitcher/>
              </div>
            </div>
          </div>
          <div class="page-body-content pb-6 py-6">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
      <div class="hidden lg:flex page-sidebar no-scrollbar">
        <slot name="sidebar"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PropType } from 'vue'
import { PageSkeletonProps } from '@/imports'

const { locale: currentLang, t } = useI18n()
const { currentRoute } = useRouter()

const props = defineProps({
  subPage: {
    type: Boolean as PropType<PageSkeletonProps['subPage']>,
    required: false,
    default: false
  },
  fromSubPageTo: {
    type: String as PropType<PageSkeletonProps['fromSubPageTo']>,
    required: false
  }
})

</script>
