<template>
  <div role="status" class="max-w-sm animate-pulse p-2">
    <div v-if="props.image" class="h-[250px] bg-gray-200 rounded-lg dark:bg-gray-700 w-full mb-4"></div>
    <div v-if="props.logo || props.logoTitle" class="flex items-center gap-2">
      <div v-if="props.logo" class="h-[30px] w-[30px] bg-greyLight rounded-full"></div>
      <div v-if="props.logoTitle" class="h-6 w-[40%] bg-greyLight rounded-full dark:bg-gray-700"></div>
    </div>
    <div v-if="props.title" class="h-4 bg-greyLight rounded-full w-[50%] dark:bg-gray-700 my-2.5"></div>
    <div v-if="props.description" class="flex flex-col gap-2">
      <div class="h-2 bg-greyLight rounded-full dark:bg-gray-700"></div>
      <div class="h-2 bg-greyLight rounded-full dark:bg-gray-700"></div>
      <div class="h-2 bg-greyLight rounded-full dark:bg-gray-700"></div>
      <div class="h-2 bg-greyLight rounded-full dark:bg-gray-700"></div>
      <div class="h-2 bg-greyLight rounded-full dark:bg-gray-700"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
interface SkeletonLoaderType {
  image: boolean
  logo: boolean
  logoTitle: boolean
  title: boolean
  description: boolean
}
const props = defineProps({
  image: { type: Boolean as PropType<SkeletonLoaderType['image']>, required: false, default: false },
  logo: { type: Boolean as PropType<SkeletonLoaderType['logo']>, required: false, default: false },
  logoTitle: { type: Boolean as PropType<SkeletonLoaderType['logoTitle']>, required: false, default: false },
  title: { type: Boolean as PropType<SkeletonLoaderType['title']>, required: false, default: false },
  description: { type: Boolean as PropType<SkeletonLoaderType['description']>, required: false, default: false },
})
</script>