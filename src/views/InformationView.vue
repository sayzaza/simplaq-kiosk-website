<template>
  <PageSkeleton>
    <template v-slot:body>
      <GridSystem>
        <div @click="openModal" class="h-max w-full flex flex-col gap-4 px-0 cursor-pointer">
          <div
            class="max-h-[150px] rounded-[26px] min-w-[195px] border border-backroundLightSeptenary bg-white w-full flex flex-col p-5 gap-5 h-full justify-between hover:!border-orange"
          >
            <div class="w-full flex justify-end">
              <Iconbase name="ClockIcon" width="40" height="40" />
            </div>
            <p class="text-xl text-black font-raleway font-bold leading-[26px] tracking-[-1%]">{{$t('opening_hours')}}</p>
          </div>
        </div>
        <RouterLink :to="Routes.BUSES" class="h-max w-full flex flex-col gap-4 px-0 cursor-pointer">
          <div
            class="max-h-[150px] rounded-[26px] min-w-[195px] border border-backroundLightSeptenary bg-white w-full flex flex-col p-5 gap-5 h-full justify-between hover:!border-orange"
          >
            <div class="w-full flex justify-end">
              <Iconbase name="BagIcon" width="40" height="40" />
            </div>
            <p class="text-xl text-black font-raleway font-bold leading-[26px] tracking-[-1%]">{{ $t('buses') }}</p>
          </div>
        </RouterLink>
        <div @click="openWifiModal" class="h-max w-full flex flex-col gap-4 px-0 cursor-pointer">
          <div
            class="max-h-[150px] rounded-[26px] min-w-[195px] border border-backroundLightSeptenary bg-white w-full flex flex-col p-5 gap-5 h-full justify-between hover:!border-orange"
          >
            <div class="w-full flex justify-end">
              <Iconbase name="WifiIcon" class="fill-none" width="40" height="40" />
            </div>
            <p class="text-xl text-black font-raleway font-bold leading-[26px] tracking-[-1%]">{{$t('wifi')}}</p>
          </div>
        </div>
      </GridSystem>
    </template>

    <template v-slot:sidebar>
      <div class="w-full flex flex-col gap-5 pt-4">
        <div v-for="item in sidebarArr" :key="item.id" class="w-full rounded-xl overflow-hidden">
          <img :src="item.image" class="w-full" alt="" />
        </div>
      </div>
    </template>
  </PageSkeleton>
  <ModalLayout v-if="showModal" @closeModal="closeModal" :title="$t('opening_hours')">
    <template #hero-image>
      <img class="w-full rounded-xl max-h-[330px] object-cover" src="@/assets/img/cards/card1.png" />
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <ModalOpening :day="$t('monday')" time="09:00 - 16:30"/>
        <ModalOpening :day="$t('tuesday')" time="09:00 - 16:30"/>
        <ModalOpening :day="$t('wednesday')" time="09:00 - 16:30"/>
        <ModalOpening :day="$t('thursday')" time="09:00 - 16:30"/>
        <ModalOpening :day="$t('friday')" time="09:00 - 16:30"/>
        <ModalOpening :day="$t('sathurday')" :time="$t('closed')"/>
        <ModalOpening :day="$t('sunday')" :time="$t('closed')"/>
      </div>
    </template>
  </ModalLayout>

  <ModalLayout v-if="showWifiModal" :customProp="true" @closeModal="closeModal" :title="$t('opening_hours')">
    <template #hero-image>
      <img class="w-full rounded-xl max-h-[330px] object-cover" src="@/assets/img/wifi.svg" />
    </template>
    <template #custom>
        <div class="w-full py-5 bg-backroundLightSeptenary rounded-[20px] flex flex-col items-center">
            <p class="font-raleway font-semibold text-black text-sm leading-[20px]">{{ $t('password') }}</p>
            <p class="font-raleway font-bold text-black text-2xl leading-[32px] tracking-[-1%]">GalIERieHarfa</p>
        </div>
    </template>
  </ModalLayout>
</template>

<script lang="ts" setup>
import { AmenitiesSidebar, Routes } from '@/imports'
import { ModalBtnProps, ModalInformationProps } from '@/types/modals/modalLayout.types'
import { ref } from 'vue'

const showModal = ref<boolean>(false)
const showWifiModal = ref<boolean>(false)

const modalBtnData: ModalBtnProps = {
  to: Routes.NEWS_AND_EVENTS,
  text: 'navigate'
}
const modalInfoContact: ModalInformationProps = {
  title: 'contact',
  tel: '+599 91 24 32'
}
const modalInfoDescription: ModalInformationProps = {
  title: 'description',
  text: `This masterclass is for anybody, regardless of gender, age or ability. Using this system will enhance your current workout and take
            you to the next level of fitness. It can be taken with you anywhere, it can be accessible in a hotel room, in the park or at home
            with the use of minimal equipment. It’s fast. It’s efficient. You get great results.`
}
const sidebarArr = [
  {
    id: 0,
    image: '/src/assets/img/sidebarItem.svg'
  },
  {
    id: 1,
    image: '/src/assets/img/sidebarItem2.svg'
  },
  {
    id: 2,
    image: '/src/assets/img/sidebarItem3.svg'
  }
] as AmenitiesSidebar[]

const openModal = () => {
  showModal.value = true
}
const openWifiModal = () => {
    showWifiModal.value = true
}
const closeModal = () => {
  showModal.value = false
  showWifiModal.value = false
}
</script>
