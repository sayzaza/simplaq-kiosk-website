<template>
  <div :class="keyboardClass">
    <div class="close-button-wrapper" style="text-align-last: right; display: flex; justify-content: right">
      <div class="hg-button hg-close-button" style="width: 50px; flex-grow: unset !important" @click="$emit('onClose')">
        <Iconbase name="Cross" width="12" height="12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Keyboard from 'simple-keyboard'
// import layout from 'simple-keyboard-layouts/build/layouts/czech'
import 'simple-keyboard/build/css/index.css'
import { onMounted } from 'vue'
import { Ref, ref, watch } from 'vue'
import Iconbase from '@/components/icons/Iconbase.vue'

const props = defineProps({
  keyboardClass: {
    default: 'simple-keyboard',
    type: String
  },
  input: {
    type: String
  }
})

const emits = defineEmits(['onChange', 'onKeyPress', 'onClose'])

const keyboard: Ref<Keyboard | null> = ref(null)

watch(
  () => props.input,
  (input: any) => {
    keyboard.value?.setInput(input)
  }
)

onMounted(() => {
  // TODO: i18n;
  keyboard.value = new Keyboard(props.keyboardClass, {
    display: {
      '{bksp}': 'vymazat ⌫',
      '{space}': 'mezera',
      '{lock}': 'caps ⇪'
    },
    mergeDisplay: true,
    layout: {
      default: ['& 1 2 3 4 5 6 7 8 9 0 {bksp}', ' q w e r t y u i o p ', '{lock} a s d f g h j k l ', ' z x c v b n m ', '.com @ {space}'],
      shift: ['1 2 3 4 5 6 7 8 9 0 {bksp}', ' Q W E R T Y U I O P ', '{lock} A S D F G H J K L ', ' Z X C V B N M ', '.com @ {space}']
    },
    onChange: onChange,
    onKeyPress: onKeyPress
  })
})

const onChange = (input: any) => {
  emits('onChange', input)
}
const onKeyPress = (button: any) => {
  emits('onKeyPress', button)
  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === '{shift}' || button === '{lock}') {
    handleShift()
  }
}
const handleShift = () => {
  const currentLayout = keyboard.value?.options.layoutName
  const shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

  keyboard.value?.setOptions({
    layoutName: shiftToggle
  })
}
</script>

<style scoped lang="scss">
$bgColor: #f9fafb;
.simple-keyboard {
  position: absolute;
  width: 100%;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%, 0%);
  padding: 0 0.5rem;
  z-index: 2; // show keyboard above map navigations buttons
  &.hg-theme-default {
    background-color: transparent;
  }
}

:deep(.hg-rows) {
  background-color: $bgColor;
  padding: 0.4rem 2rem;
}
.close-button-wrapper {
  background: $bgColor;
  padding: 0.4rem 2rem 0;
  .hg-close-button {
    &:active {
      background: $bgColor;
    }
  }
}
</style>
