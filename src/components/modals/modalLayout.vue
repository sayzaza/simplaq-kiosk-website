<template>
  <div class="fixed top-0 left-0 w-full h-screen bg-blackOverlay64 z-[9999]">
    <div class="w-full h-full flex">
      <div class="flex bg-white h-fit rounded-xl px-8 py-6 m-auto" id="modal">
        <div class="w-full max-w-[452px] max-h-[calc(100vh-100px)] overflow-auto no-scrollbar">
          <div class="w-full h-full">
            <div class="w-full flex items-center justify-between">
              <p v-if="props.title" class="font-bold font-raleway text-2xl text-black leading-[32%] tracking-[-1%]">{{ props.title }}</p>
              <div
                @click="closeModal"
                id="closeModal"
                class="ml-auto flex items-center justify-center w-[56px] h-[56px] bg-backroundLightSeptenary rounded-full cursor-pointer"
              >
                <iconbase name="closeIcon" width="24" height="24" />
              </div>
            </div>
            <div class="w-full mt-8">
              <div class="flex flex-col gap-2">
                <div class="w-full">
                  <slot name="hero-image"></slot>
                </div>
                <div class="w-full flex flex-col gap-4" >
                  <slot name="hero-info"> </slot>
                </div>
                <slot name="body"></slot>
                <slot name="custom" v-if="customProp"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Iconbase from '@/components/icons/Iconbase.vue'
import { PropType } from 'vue'
import { ModalLayoutProps } from '@/types/modals/modalLayout.types'
const props = defineProps({
  title: {
    type: String as PropType<ModalLayoutProps['title']>,
    required: false
  },
  customProp: {
    type: Boolean as PropType<ModalLayoutProps['customProp']>,
    default: false,
    required: false
  }
})
const emit = defineEmits(['closeModal'])
const closeModal = (e: Event) => {
  emit('closeModal')
}
</script>
