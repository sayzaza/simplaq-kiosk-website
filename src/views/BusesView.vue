<template>
  <PageSkeleton :subPage="true" :fromSubPageTo="Routes.INFORMATION">
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="flex gap-2">
          <FilterBtns :showBtns="true" :pickers="busesFilter" :pickedIs="BusesFilterSelected" @pickBtn="handleFilter" />
        </div>
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-210px)] pb-10">
          <div class="w-full rounded-[24px] bg-white font-raleway">
            <div class="w-full grid grid-cols-4 px-6 py-4 border-b border-light3 gap-5">
              <p class="font-semibold text-base leading-[22px] text-grey">{{ $t('depart') }}</p>
              <p class="font-semibold text-base leading-[22px] text-grey">{{ $t('link') }}</p>
              <p class="font-semibold text-base leading-[22px] text-grey">{{ $t('direction_of_movement') }}</p>
              <p class="font-semibold text-base leading-[22px] text-grey">{{ $t('stand') }}</p>
            </div>

            <div class="flex flex-col w-full">
              <div class="w-full grid grid-cols-4 px-6 py-4 border-b border-light3 py-5 gap-5">
                <p class="font-bold text-md leading-[26px] text-black">18:25</p>
                <p class="font-bold text-md leading-[26px] text-black">40</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('random_place') }}</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('he_leaves_in') }} 3 {{ $t('minutes') }}</p>
              </div>
              <div class="w-full grid grid-cols-4 px-6 py-4 border-b border-light3 py-5 gap-5">
                <p class="font-bold text-md leading-[26px] text-black">18:25</p>
                <p class="font-bold text-md leading-[26px] text-black">43</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('random_place') }}</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('he_leaves_in') }} 5 {{ $t('minutes') }}</p>
              </div>
              <div class="w-full grid grid-cols-4 px-6 py-4 border-b border-light3 py-5 gap-5">
                <p class="font-bold text-md leading-[26px] text-black">18:25</p>
                <p class="font-bold text-md leading-[26px] text-black">44</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('random_place') }}</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('he_leaves_in') }} 7 {{ $t('minutes') }}</p>
              </div>
              <div class="w-full grid grid-cols-4 px-6 py-4 py-5 gap-5">
                <p class="font-bold text-md leading-[26px] text-black">18:25</p>
                <p class="font-bold text-md leading-[26px] text-black">40</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('random_place') }}</p>
                <p class="font-bold text-md leading-[26px] text-black">{{ $t('he_leaves_in') }} 9 {{ $t('minutes') }}</p>
              </div>
            </div>
          </div>
          <div class="w-full bg-white mt-6">
            <img class="w-full" src="@/assets/img/map.svg" alt="">
          </div>
        </div>
      </div>
    </template>

    <template v-slot:sidebar>
      <div class="w-full flex flex-col gap-5 pt-4">
        <div v-for="item in sidebarArr" :key="item.id" class="w-full rounded-xl overflow-hidden">
          <img :src="item.image" class="w-full" alt="" />
        </div>
      </div>
    </template>
  </PageSkeleton>
</template>

<script lang="ts" setup>
import { AmenitiesSidebar, Routes, FilterBtnsArr } from '@/imports'
import { ref } from 'vue'

const busesFilter = [
  {
    title: 'public_transportation',
    value: 'news'
  },
  {
    title: 'private_transport',
    value: 'events'
  }
] as FilterBtnsArr[]
let BusesFilterSelected = ref<FilterBtnsArr['value']>(busesFilter[0].value)
const handleFilter = (filter: FilterBtnsArr['value']) => {
  BusesFilterSelected.value = filter
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
</script>
