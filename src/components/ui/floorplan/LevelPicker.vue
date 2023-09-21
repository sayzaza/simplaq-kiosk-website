<template>
  <div id="levelPicker" class="levelPicker-button-wrapper">
    <el-button
      v-for="level in existingLevels"
      :key="level"
      plain
      :disabled="actioningTree.create.state || actioningTree.edit.state || level === selectedLevel"
      class="levelPickerButton"
      :class="level === selectedLevel ? 'active' : ''"
      @click="levelClick(level)"
    >
      {{ level }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  existingLevels: {
    type: Array<string>,
    default: null
  },
  actioningTree: {
    type: Object,
    default: null
  },
  mapSelectedLevel: {
    type: String,
    default: '0'
  }
})

const emit = defineEmits(['levelChanged'])
const selectedLevel = computed({
  get: () => props.mapSelectedLevel,
  set: (level: string) => emit('levelChanged', level)
})

const levelClick = (level: string) => {
  selectedLevel.value = level
}
</script>
