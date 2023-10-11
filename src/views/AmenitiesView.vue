<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-120px)]">
          <GridSystem>
            <div
              @click="openModal"
              v-for="item in amenitiesArr"
              :key="item.id"
              class="w-full flex flex-col bg-white rounded-xl cursor-pointer overflow-hidden"
            >
              <div class="w-full">
                <img class="h-[250px] w-full object-cover object-top" :src="item.title" alt="" />
              </div>
              <div class="w-full flex flex-col gap-3 py-4 px-5">
                <div class="flex flex-col gap-1">
                  <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px]">
                    {{ $t(item.title) }}
                  </p>
                </div>
              </div>
            </div>
          </GridSystem>
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
  <ModalLayout v-if="showModal" @closeModal="closeModal">
    <template #hero-image>
      <img class="w-full rounded-xl max-h-[330px] object-cover" src="@/assets/img/cards/card1.png" />
    </template>
    <template #hero-info>
      <p class="font-raleway font-bold text-black text-xl trackng-[-1%] text-black">Ice Masterclass - Fitness master burn your calories</p>
      <div class="flex items-center gap-3">
        <Iconbase name="EventsIcon" width="24" height="24" />
        <p class="font-raleway font-semibold text-black text-base">Jan 16, 5:00 AM - Jan 18, 5:00 AM</p>
      </div>
      <ModalBtn :btnData="modalBtnData" />
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <ModalInformation :modalInfo="modalInfoContact" />
        <ModalInformation :modalInfo="modalInfoDescription" />
      </div>
    </template>
  </ModalLayout>
</template>

<script lang="ts" setup>
import { AmenitiesArr, AmenitiesSidebar, Routes, RestApi } from '@/imports'
import { ModalBtnProps, ModalInformationProps } from '@/types/modals/modalLayout.types'
import { ref, onMounted } from 'vue'
// importing sidebar images
import SidebarImg1 from '@/assets/img/sidebarItem.svg'
import SidebarImg2 from '@/assets/img/sidebarItem2.svg'
import SidebarImg3 from '@/assets/img/sidebarItem3.svg'
onMounted(async()=> {
  amenitiesArr.value = await getAmenities()
})
const showModal = ref<boolean>(false)
const amenitiesArr = ref<AmenitiesArr[]>([])
const getAmenities = async () => {
  try {
    const amenites = await RestApi.getAmenities()
    return amenites.data.data.data
  } catch (err) {
    console.log(err)
  }
}

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
    image: SidebarImg1
  },
  {
    id: 1,
    image: SidebarImg2
  },
  {
    id: 2,
    image: SidebarImg3
  }
] as AmenitiesSidebar[]

const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}
</script>
