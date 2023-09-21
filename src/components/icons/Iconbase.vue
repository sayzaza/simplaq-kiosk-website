<template>
  <div v-if="hasName" class="c-icon" :class="customClass">
    <component :is="iconComponent" :width="width" :height="height"></component>
  </div>
</template>
<script lang="ts" setup>
import { IconProps } from '@/types/icon/Icon.types'
import { useIcon } from '@/composebles/useIcon'
import { PropType, watch, shallowRef, computed } from 'vue'

const props = defineProps({
  name: {
    type: String as PropType<IconProps['name']>,
    required: true
  },
  width: {
    type: String as PropType<IconProps['width']>,
    default: '20'
  },
  height: {
    type: String as PropType<IconProps['height']>,
    default: '20'
  },
  customClass: {
    type: String as PropType<IconProps['class']>,
    default: ''
  }
})

const { getIconComponent } = useIcon()
const iconComponent = shallowRef(getIconComponent(props.name))

watch(
  () => props.name,
  () => (iconComponent.value = getIconComponent(props.name))
)

const hasName = computed(() => props.name && props.name.length > 0)
</script>
<style lang="scss">
.c-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  &.nav-menu-icon {
    min-width: 56px;
    min-height: 56px;
    border-radius: 100px;
  }
}
</style>
