<template>
  <div class="w-full h-full flex items-center justify-center">
    <v-progress-circular color="black" indeterminate :size="70" :width="7"></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import TheSidebars from '@/components/ui/sidebar/TheSidebars.vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { loading } = storeToRefs(appStore)
</script>