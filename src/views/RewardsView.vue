<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-120px)]">
          <GridSystem v-if="!spinnerLoader">
            <div
              @click="openModal"
              v-for="(item, index) in rewardsArr"
              :key="item.id"
              class="w-full flex flex-col bg-white rounded-xl cursor-pointer overflow-hidden"
            >
              <div class="w-full">
                <img @load="handleImageLoad(`mainImage-${index}`)" :id="`mainImage-${index}`" class="h-[250px] w-full object-cover object-top opacity-0 absolute" :src="item.photo_link" alt="" />
                <SkeletonLoader :loader-for="`mainImage-${index}`" :image="true" />
              </div>
              <div class="w-full h-full flex flex-col gap-3 py-4 px-5">
                <div class="w-full flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-[32px] h-[32px] rounded-full font-raleway bg-backroundLightSeptenary">
                      <img @load="handleImageLoad(`logoImage-${index}`)" :id="`logoImage-${index}`" class="w-full h-full rounded-full object-fit w-full opacity-0 absolute" :src="item.company.logo_picture" :alt="item.company.title" />
                    </div>
                    <p class="font-raleway font-semibold text-xs text-backgroundLightPrimary leading-[16px]">{{ item.company.title }}</p>
                  </div>
                  <a href="#" class="flex items-center gap-2 border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary">
                    <iconbase name="MedalIcon" width="20" height="20" />
                    {{ item.rewards }}</a
                  >
                </div>
                <div class="flex flex-col h-full gap-1 pb-3 border-b border-b-backroundLightSeptenary">
                  <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px]">
                    {{ item.title.length <= 18 ? item.title : item.title.slice(0, 18) + ' ...' }}
                  </p>
                  <p class="font-raleway text-sm leading-[24px] font-normal text-grey">
                    {{ item.description.length <= 100 ? item.description : item.description.slice(0, 100) + ' ...' }}
                  </p>
                </div>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-2">
                    <iconbase name="EventsIcon" width="20" height="20" />
                    <p class="text-black text-sm leading-[20px] font-raleway font-semibold">asd {{ item.date }}</p>
                  </div>
                  <p class="text-end text-black text-sm leading-[20px] font-raleway font-semibold">{{ item.unlimited_amount ? "Unlimited amount" : item.limit_left + "/" + item.limit + " in stock" }}</p>
                </div>
              </div>
            </div>
          </GridSystem>
          <SpinnerLoader v-else/>
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
import { RewardsArr, RewardsSidebar, Routes, RestApi } from '@/imports'
import { useFormatDate, FormatDateType } from '@/composebles/useDateFormat'
import { ModalBtnProps, ModalInformationProps } from '@/types/modals/modalLayout.types'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const rewardsArr = ref()
const spinnerLoader = ref<boolean>(true)
onMounted(async()=> {
  rewardsArr.value = await getRewards()
})
const getRewards = async()=> {
  try {
    const data = await RestApi.getRewards()
    spinnerLoader.value = false
    return data.data.data.data
  }
  catch (error){
    console.log(error)
  }
}
const handleImageLoad = (id: string) => {
  if(id === 'mainImage-1') {
    console.log(id)
  }
  console.log(document.getElementById(id))
  document.getElementById(id)?.classList.remove('opacity-0')
  document.getElementById(id)?.classList.remove('absolute')
  document.querySelector(`[loader-for=${id}]`)?.classList.add('hidden')
}
const newsDDMMYY = computed<FormatDateType>(() => {
  return useFormatDate(rewardsArr.value, 'start')
})
const showModal = ref<boolean>(false)

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
] as RewardsSidebar[]

const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}
</script>
