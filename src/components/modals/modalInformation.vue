<template>
  <div class="w-full flex flex-col gap-4">
    <p class="font-raleway font-bold text-black text-base text-black">{{ $t(props.modalInfo.title) }}</p>
    <div v-if="props.modalInfo.title === 'contact'" class="flex items-center gap-3">
      <div class="w-[56px] h-[56px] rounded-full flex items-center justify-center bg-backroundLightSeptenary">
        <iconbase name="PhoneIcon" width="24" height="24" />
      </div>
      <div class="flex flex-col gap-1">
        <p class="font-raleway font-semibold text-sm text-grey">{{ $t('phone_number') }}</p>
        <p class="font-raleway font-bold text-base text-black">{{ props.modalInfo.tel }}</p>
      </div>
    </div>
    <div v-else class="flex items-center gap-3">
      <p class="font-raleway font-normal text-sm text-grey leading-[22px]">
        {{props.modalInfo.text}}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModalInformationProps } from '@/types/modals/modalLayout.types'
import { PropType } from 'vue'

const props = defineProps({
  modalInfo: {
    type: Object as PropType<ModalInformationProps>,
    required: true
  }
})
</script>
