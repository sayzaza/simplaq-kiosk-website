<template>
  <!-- supports all the flag components from components/icons/Flag_XX.vue -->
  <div class="lang-switcher absolute top-[-10000px] opacity-0 xl:relative xl:opacity-100 xl:top-0">
    <Buttonbase
      v-for="lang in defaultLanguages"
      :key="lang.title"
      :icon="`Flag_${lang.value}`"
      :name="t(lang.title)"
      :classname="`c-button--transparent-with-borders lang-button ${lang.value === currentLang ? 'active' : ''}`"
      @click="changeLang(lang)"
    />
  </div>
  <div class="lang-switcher xl:absolute xl:top-[-10000px] xl:opacity-0 relative opacity-1 top-0">
    <Buttonbase
      v-for="lang in defaultLanguages2"
      :key="lang.title"
      :icon="`Flag_${lang.value}`"
      :name="t(lang.value)"
      :classname="`c-button--transparent-with-borders lang-button ${lang.value === currentLang ? 'active' : ''}`"
      @click="changeLang(lang)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PropType } from 'vue'
import { PageSkeletonProps } from '@/imports'

const { locale: currentLang, t } = useI18n()
const appStore = useAppStore()
const { currentRoute } = useRouter()

const { defaultLanguages } = storeToRefs(appStore)
const defaultLanguages2 = defaultLanguages
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

const changeLang = (lang: { value: string; title: string }) => {
  currentLang.value = lang.value
  appStore.changeLanguage(lang)
}
</script>
