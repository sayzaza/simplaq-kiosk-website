<template>
  <v-card>
    <v-app>

      <Header />
      
      <v-navigation-drawer permanent class=" lg:flex hidden">
        <TheSidebars />
      </v-navigation-drawer>

      <v-main class="!pl-0  lg:!pl-[--v-layout-left]">
        <router-view />
        <v-overlay persistent :model-value="loading" class="align-center justify-center">
          <v-progress-circular color="black" indeterminate :size="70" :width="7"></v-progress-circular>
        </v-overlay>
      </v-main>
    </v-app>
  </v-card>
</template>

<script lang="ts" setup>
import TheSidebars from '@/components/ui/sidebar/TheSidebars.vue'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { loading } = storeToRefs(appStore)
</script>