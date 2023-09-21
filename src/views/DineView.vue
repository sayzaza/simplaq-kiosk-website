<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="w-full grid grid-cols-[35px,auto] gap-2 px-5 bg-white rounded-full">
          <Iconbase name="SearchIcon" width="24" height="24" />
          <input
            placeholder="Search"
            v-model="searchVal"
            @input="handleSearch"
            class="py-4 bg-transparent outline-none text-base placeholder:text-grey text-black font-raleway font-semibold"
          />
        </div>
        <div class="flex flex-col gap-4 w-full">
          <FloorFilterBtns @pickBtn="pickFloor" :pickedIs="pickedFloor" />
          <FilterBtns :showBtns="false" :pickers="dinePickerArr" :pickedIs="pickedDine" @pickBtn="pickDine" />
          <div class="flex lg:hidden mt-6">
            <CategorySidebar
              :vertical="false"
              @filterCategory="filterDineCategory"
              :categories="dineSidebarCategories"
              :selected="dineSidebarCategoriesSelected"
            />
          </div>
          <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-555px)] lg:h-[calc(100vh-395px)]">
            <GridSystem>
              <div
                @click="openModal"
                v-for="item in dineArr"
                :key="item.id"
                class="w-full flex flex-col bg-white rounded-xl cursor-pointer overflow-hidden"
              >
                <div class="w-full">
                  <img class="h-[250px] w-full object-cover object-top" :src="item.image" alt="" />
                </div>
                <div class="w-full flex flex-col gap-3 py-4 px-5">
                  <div class="w-full flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center justify-center w-[32px] h-[32px] rounded-full font-raleway bg-backroundLightSeptenary">
                        <img class="w-full max-w-[28px]" :src="item.logo" :alt="item.logoTitle" />
                      </div>
                      <p class="font-raleway font-semibold text-xs text-backgroundLightPrimary leading-[16px]">{{ item.logoTitle }}</p>
                    </div>
                    <a
                      href="#"
                      class="border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary"
                      >{{ $t(item.type) }}</a
                    >
                  </div>
                  <div class="flex flex-col gap-1 pb-3 border-b border-b-backroundLightSeptenary">
                    <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px]">
                      {{ $t(item.title) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <iconbase :name="item.icon" width="20" height="20" />
                    <p class="text-black text-sm leading-[20px] font-raleway font-semibold">{{ item.floor }}</p>
                  </div>
                </div>
              </div>
            </GridSystem>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:sidebar>
      <div class="w-full flex flex-col gap-5 pt-4">
        <CategorySidebar
          @filterCategory="filterDineCategory"
          :categories="dineSidebarCategories"
          :selected="dineSidebarCategoriesSelected"
        />
      </div>
    </template>
  </PageSkeleton>
  <ModalLayout v-if="showModal" @closeModal="closeModal" title="Hamburger">
    <template #hero-image>
      <img class="w-full rounded-xl max-h-[330px] object-cover" src="@/assets/img/cards/card1.png" />
    </template>
    <template #hero-info>
      <ModalHeadInfo />
      <ModalBtn :btnData="modalBtnData" />
    </template>
    <template #body>
      <ModalGallery />
    </template>
  </ModalLayout>
</template>

<script lang="ts" setup>
import { FilterBtnsArr, DineArr, Routes } from '@/imports'
import { DineCategories } from '@/types/pages/dine/dine.types'
import { ModalBtnProps } from '@/types/modals/modalLayout.types'
import { ref } from 'vue'
import { dineSidebarCategories } from '@/controllers/categoryItems'

const modalBtnData: ModalBtnProps = {
  to: Routes.DINE,
  text: 'navigate'
}

const dineSidebarCategoriesSelected = ref<string>(dineSidebarCategories[0].val)
const filterDineCategory = (val: string) => {
  dineSidebarCategoriesSelected.value = val
}
// floor picker filter
const pickedFloor = ref<string>('all')

const pickFloor = (val: string) => {
  pickedFloor.value = val
}

const pickedDine = ref<string>('coffee')
const dinePickerArr = [
  {
    title: 'coffee',
    value: 'coffee',
    ico: 'CoffeeIcon'
  },
  {
    title: 'fast_food',
    value: 'fast_food',
    ico: 'HamburgerLightIcon'
  },
  {
    title: 'special_food',
    value: 'special_food',
    ico: 'FishIcon'
  },
  {
    title: 'natural_food',
    value: 'natural_food',
    ico: 'AppleIcon'
  },
  {
    title: 'restaurant',
    value: 'restaurant',
    ico: 'RestaurantIcon'
  }
] as FilterBtnsArr[]
const pickDine = (val: string) => {
  pickedDine.value = val
}

const dineArr = [
  {
    id: 0,
    image: '/src/assets/img/dine/item1.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger_spice',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  },
  {
    id: 1,
    image: '/src/assets/img/dine/item2.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  },
  {
    id: 2,
    image: '/src/assets/img/dine/item3.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  },
  {
    id: 3,
    image: '/src/assets/img/dine/item1.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger_spice',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  },
  {
    id: 4,
    image: '/src/assets/img/dine/item2.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  },
  {
    id: 5,
    image: '/src/assets/img/dine/item3.png',
    logo: '/src/assets/img/brands/kfc.svg',
    logoTitle: 'KFC',
    title: 'cheeseburger',
    type: 'cheeseburger',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: DineCategories.CHEESEBURGER
  }
] as DineArr[]

const searchVal = ref<string>('')
const handleSearch = () => {
  // handle Search
}

const showModal = ref<boolean>(false)
const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}
</script>
