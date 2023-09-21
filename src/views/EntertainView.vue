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
              @filterCategory="filterEntertainCategory"
              :categories="entertainSidebarCategories"
              :selected="entertainSidebarCategoriesSelected"
            />
          </div>
          <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-412px)] lg:h-[calc(100vh-252px)]">
            <GridSystem>
              <div
                @click="openModal"
                v-for="item in entertainArr"
                :key="item.id"
                class="w-full flex flex-col bg-white rounded-xl cursor-pointer overflow-hidden"
              >
                <div class="w-full">
                  <img class="h-[250px] w-full object-cover object-top" :src="item.image" alt="" />
                </div>
                <div class="w-full flex flex-col gap-3 py-4 px-5">
                  <div class="w-full flex">
                    <a
                      href="#"
                      class="border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary"
                      >{{ $t(item.category) }}</a
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
          @filterCategory="filterEntertainCategory"
          :categories="entertainSidebarCategories"
          :selected="entertainSidebarCategoriesSelected"
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
import { EntertainArr, Routes } from '@/imports'
import { ModalBtnProps } from '@/types/modals/modalLayout.types'
import { entertainSidebarCategories } from '@/controllers/categoryItems'
import { EntertainCategories } from '@/types/pages/entertain/entertain.types'
import { ref } from 'vue'

const modalBtnData: ModalBtnProps = {
  to: Routes.ENTERTAIN,
  text: 'navigate'
}

const entertainSidebarCategoriesSelected = ref<string>(entertainSidebarCategories[0].val)
const filterEntertainCategory = (val: string) => {
  entertainSidebarCategoriesSelected.value = val
}
// floor picker filter
const pickedFloor = ref<string>('all')
const pickFloor = (val: string) => {
  pickedFloor.value = val
}

const entertainArr = [
  {
    id: 0,
    image: '/src/assets/img/entertain/item1.png',
    title: 'dinopark',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_KIDS
  },
  {
    id: 1,
    image: '/src/assets/img/entertain/item2.png',
    title: 'aquarium',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_KIDS
  },
  {
    id: 2,
    image: '/src/assets/img/entertain/item3.png',
    title: 'aquarium',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_FAMILY
  },
  {
    id: 3,
    image: '/src/assets/img/entertain/item3.png',
    title: 'aquarium',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_FAMILY
  },
  {
    id: 4,
    image: '/src/assets/img/entertain/item5.png',
    title: 'aquarium',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_FAMILY
  },
  {
    id: 5,
    image: '/src/assets/img/entertain/item6.png',
    title: 'aquarium',
    icon: 'LocationIcon',
    floor: '2nd floor',
    category: EntertainCategories.FOR_FAMILY
  }
] as EntertainArr[]

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
