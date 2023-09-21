<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-120px)]">
          <GridSystem>
            <div
              @click="openModal"
              v-for="item in rewardsArr"
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
                  <a href="#" class="flex items-center gap-2 border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary">
                    <iconbase name="MedalIcon" width="20" height="20" />
                    {{ item.rewards }}</a
                  >
                </div>
                <div class="flex flex-col gap-1 pb-3 border-b border-b-backroundLightSeptenary">
                  <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px]">
                    {{ $t(item.title) }}
                  </p>
                  <p class="font-raleway text-sm leading-[24px] font-normal text-grey">
                    {{ item.description }}
                  </p>
                </div>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-2">
                    <iconbase :name="item.icon" width="20" height="20" />
                    <p class="text-black text-sm leading-[20px] font-raleway font-semibold">{{ item.date }}</p>
                  </div>
                  <p class="text-end text-black text-sm leading-[20px] font-raleway font-semibold">{{ item.amount }}</p>

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
import { RewardsArr, RewardsSidebar, Routes } from '@/imports'
import { ModalBtnProps, ModalInformationProps } from '@/types/modals/modalLayout.types'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const rewardsArr = [
  {
    id: 0,
    image: '/src/assets/img/rewards/item1.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: t('unlimited_amount')
  },
  {
    id: 1,
    image: '/src/assets/img/rewards/item2.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: `100/100 ${t('in_stock')}`
  },
  {
    id: 2,
    image: '/src/assets/img/rewards/item3.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: t('unlimited_amount')
  },
  {
    id: 3,
    image: '/src/assets/img/rewards/item4.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: t('unlimited_amount')
  },
  {
    id: 4,
    image: '/src/assets/img/rewards/item5.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: `100/100 ${t('in_stock')}`
  },
  {
    id: 5,
    image: '/src/assets/img/rewards/item6.png',
    logo: '/src/assets/img/brands/zara.svg',
    logoTitle: 'Zara store',
    title: 'informational_for_visitors_of_our_mall',
    description: 'There are some things you can control easily, and others you can’t. There’s no doubt that ...',
    icon: 'EventsIcon',
    date: 'Jan 16, 5:00 AM',
    rewards: 100,
    amount: t('unlimited_amount')
  }
] as RewardsArr[]
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
