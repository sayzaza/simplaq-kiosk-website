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
          <div class="flex lg:hidden mt-6">
            <CategorySidebar
              :vertical="false"
              @filterCategory="filterServicesCategory"
              :categories="servicesSidebarCategories"
              :selected="servicesSidebarCategoriesSelected"
            />
          </div>
          <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-416px)] lg:h-[calc(100vh-252px)]">
            <GridSystem>
              <div
                @click="openModal"
                v-for="item in servicesArr"
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
                      <p class="font-raleway font-semibold text-xs text-backgroundLightPrimary leading-[16px]">{{ $t(item.logoTitle) }}</p>
                    </div>
                    <a
                      href="#"
                      class="border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary"
                      >{{ $t(item.category) }}</a
                    >
                  </div>
                  <div class="flex flex-col gap-1 pb-3 border-b border-b-backroundLightSeptenary">
                    <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px] uppercase">
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
          @filterCategory="filterServicesCategory"
          :categories="servicesSidebarCategories"
          :selected="servicesSidebarCategoriesSelected"
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
import { ServicesArr, Routes, ServicesCategories } from '@/imports'
import { ModalBtnProps } from '@/types/modals/modalLayout.types'
import { servicesSidebarCategories } from '@/controllers/categoryItems'
import { ref } from 'vue'

const modalBtnData: ModalBtnProps = {
  to: Routes.ENTERTAIN,
  text: 'navigate'
}

const servicesSidebarCategoriesSelected = ref<string>(servicesSidebarCategories[0].val)
const filterServicesCategory = (val: string) => {
  servicesSidebarCategoriesSelected.value = val
}
// floor picker filter
const pickedFloor = ref<string>('all')
const pickFloor = (val: string) => {
  pickedFloor.value = val
}

const servicesArr = [
  {
    id: 0,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item1.png',
    title: 'relaxation_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  },
  {
    id: 1,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item2.png',
    title: 'deep_tissue_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  },
  {
    id: 2,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item2.png',
    title: 'hot_stone_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  },
  {
    id: 3,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item4.png',
    title: 'relaxation_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  },
  {
    id: 4,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item5.png',
    title: 'deep_tissue_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  },
  {
    id: 5,
    logo: '/src/assets/img/relax.svg',
    logoTitle: 'relax',
    image: '/src/assets/img/services/item6.png',
    title: 'hot_stone_massage',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: ServicesCategories.MASSAGE
  }
] as ServicesArr[]

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
