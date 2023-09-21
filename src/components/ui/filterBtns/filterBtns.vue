<template>
  <div class="w-full flex items-center gap-[6px] dragable overflow-auto no-scrollbar select-none" ref="containerRef">
    <div v-if="showBtns" @click="pickBtn(picker.value)" v-for="picker in props.pickers">
      <Buttonbase v-if="picker.translate !== false"
        :name="$t(picker.title)"
        :classname="`${
          pickedIs.toLowerCase() === picker.value.toLowerCase() ? 'active-black' : ''
        } min-w-[60px] c-button c-button--white c-button-sm`"
      />
      <Buttonbase v-else
        :name="picker.title"
        :classname="`${
          pickedIs.toLowerCase() === picker.value.toLowerCase() ? 'active-black' : ''
        } min-w-[60px] c-button c-button--white c-button-sm`"
      />
    </div>
    <div
      v-else
      @click="pickBtn(picker.value)"
      v-for="picker in props.pickers"
      :class="`${
        pickedIs.toLowerCase() === picker.value.toLowerCase() ? '!border-orange' : '!border-backroundLightSeptenary'
      } max-h-[150px] rounded-[26px] min-w-[195px] border bg-white w-full flex flex-col p-5 gap-5 h-full justify-between`"
    >
      <div class="w-full flex justify-end">
        <Iconbase :name="picker.ico" width="40" height="40" />
      </div>
      <p class="text-xl text-black font-raleway font-bold leading-[26px] tracking-[-1%]">{{ $t(picker.title) }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FilterBtnsProps, FilterBtnsArr } from '@/types/button/FilterBtnsTypes'
import { onMounted, ref, PropType } from 'vue'

const props = defineProps({
  showBtns: {
    type: Boolean as PropType<FilterBtnsProps['showBtns']>,
    required: true
  },
  pickers: {
    type: [Array] as PropType<FilterBtnsArr[]>,
    required: true
  },
  pickedIs: {
    type: String as PropType<FilterBtnsProps['pickedIs']>,
    required: true
  },
})

const emit = defineEmits(['pickBtn'])
const pickBtn = (value: string) => {
  emit('pickBtn', value)
}

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const cont = containerRef.value
  let startY: number
  let startX: number
  let scrollLeft: number
  let scrollTop: number
  let isDown: boolean

  if (cont) {
    cont.addEventListener('mousedown', e => {
      isDown = true
      startY = e.pageY - cont.offsetTop
      startX = e.pageX - cont.offsetLeft
      scrollLeft = cont.scrollLeft
      scrollTop = cont.scrollTop
    })
    cont.addEventListener('mouseup', e => {
      isDown = false
    })
    cont.addEventListener('mouseleave', e => {
      isDown = false
    })
    cont.addEventListener('mousemove', e => {
      if (isDown) {
        e.preventDefault()

        //Move Horizontally
        const x = e.pageX - cont.offsetLeft
        const walkX = x - startX
        cont.scrollLeft = scrollLeft - walkX
      }
    })
  }
})
</script>
