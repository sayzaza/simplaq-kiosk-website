<template>
  <RouterLink
    :to="props.btnData.to"
    class="w-full mb-3 flex gap-3 items-center justify-center py-6 bg-radialPrimary rounded-[16px] opacity-90 hover:opacity-100 transition-all"
  >
    <Iconbase name="routeIcon" width="24" height="24" />
    <p class="font-raleway font-bold text-md text-white">{{ $t(props.btnData.text) }}</p>
  </RouterLink>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ModalBtnProps } from '@/types/modals/modalLayout.types'
const props = defineProps({
  btnData: {
    type: Object as PropType<ModalBtnProps>,
    required: true
  }
})
</script>
