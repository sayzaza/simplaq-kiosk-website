<template>
  <button v-if="!to" class="c-button" :class="[{ active: activeState }, classname]" @click="emits('click')">
    <Iconbase :name="props.icon" width="18" height="18" />
    {{ name }}
  </button>
  <RouterLink v-if="to" :to="to" class="c-button" :class="classname">
    <iconbase :name="props.icon" width="18" height="18" />
    {{ name }}
  </RouterLink>
</template>
<script lang="ts" setup>
import Iconbase from '@/components/icons/Iconbase.vue'
import { ButtonProps } from '@/types/button/Button.types'
import { PropType } from 'vue'
const emits = defineEmits(['click'])
const props = defineProps({
  name: {
    type: String as PropType<ButtonProps['name']>,
    required: true
  },
  icon: {
    type: String as PropType<ButtonProps['icon']>,
    default: ''
  },
  classname: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  activeState: {
    type: Boolean,
    default: false
  }
})
</script>
