<template>
  <div class="w-full flex items-center justify-between">
    <p class="text-grey text-base font-raleway font-semibold leading-[22px]">{{ props.day }} </p>
    <p class="teext-black font-bold font-raleway text-base leading-[24px]">{{ props.time }}</p>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ModalOpeningTypes } from '@/imports'

const props = defineProps({
  day: {
    type: String as PropType<ModalOpeningTypes['day']>,
    required: true
  },
  time: {
    type: String as PropType<ModalOpeningTypes['time']>,
    required: true
  }
})
</script>
