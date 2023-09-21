<template>
  <div class="w-full flex flex-col p-6 bg-white rounded-[24px] gap-7">
    <p class="text-black text-md font-raleway font-bold">{{ $t(props.floor) }}</p>
    <div class="w-full grid grid-cols-50">
      <div
        v-for="(item, index) in totalDivs"
        :key="index"
        :class="`${index < activeDivs ? 'bg-radialPrimary scale-[1.2]' : 'bg-light3'} flex w-[3px] h-[32px] rounded-[1px]`"
      ></div>
    </div>
    <div class="w-full flex items-center justify-between">
      <p class="text-2xl text-black font-bold tracking-[-1%] font-raleway">{{ props.completed }}<span class="text-sm font-bold text-grey">/{{ props.total }}</span></p>
      <p class="text-md text-green font-bold">{{ percentage }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProgressProps } from '@/types/progress/progress.types'
import { onMounted, PropType, ref, computed } from 'vue'

const props = defineProps({
  floor: {
    type: String as PropType<ProgressProps['floor']>,
    required: true
  },
  completed: {
    type: Number as PropType<ProgressProps['completed']>,
    required: true
  },
  total: {
    type: Number as PropType<ProgressProps['total']>,
    required: true
  }
})

const totalDivs: number = 40

const activeDivs = computed(()=> {
  const percentageCompleted = Math.floor((props.completed / props.total) * 100)
  return Math.floor(totalDivs * (percentageCompleted / 100))
})
const percentage = computed(()=> {
  const percentageCompleted = (props.completed / props.total) * 100
  return percentageCompleted.toFixed(2)
})
</script>

<style scoped>
.grid-cols-50 {
  grid-template-columns: repeat(40, minmax(0, 1fr));
}
</style>
