<template>
  <FilterBtns :showBtns="true" :pickers="floorPickerArr" :pickedIs="pickedIs" @pickBtn="pickBtn" />
</template>

<script setup lang="ts">
import {ref, PropType} from 'vue'
import { FilterBtnsArr } from '@/imports'
import { FilterBtnsProps } from '@/types/button/FilterBtnsTypes'

const floorPickerArr = [
  {
    title: 'all_floors',
    value: 'all'
  },
  {
    title: '-1',
    value: '-1',
    translate: false,
  },
  {
    title: '0',
    value: '0',
    translate: false,
  },
  {
    title: '2',
    value: '2',
    translate: false,
  },
  {
    title: '-3',
    value: '-3',
    translate: false,
  }
] as FilterBtnsArr[]
const emit = defineEmits(['pickBtn'])
const pickBtn = (value: string) => {
    emit('pickBtn', value)
}
const props = defineProps({
    pickedIs: {
    type: String as PropType<FilterBtnsProps['pickedIs']>,
    required: true
  }
})
</script>
