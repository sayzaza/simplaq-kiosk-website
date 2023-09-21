<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="flex gap-2">
          <div v-for="(filter, index) in newsEventsFilter" :key="index">
            <Buttonbase
              @click="handleFilter(filter.filter)"
              :name="t(filter.filter)"
              :icon="filter.icon"
              :classname="`${newsEventsSelected === filter.filter ? 'active-black' : ''} c-button--white c-button-sm`"
            />
          </div>
        </div>
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-228px)]">
          <GridSystem v-if="!spinnerLoader" class="grid-colrs-1 sm:grid-cols-2">
            <div
              @click="openModal"
              v-for="(item, index) in filteredNewsEventsArr"
              :key="item.id"
              class="w-full flex flex-col bg-white rounded-xl cursor-pointer overflow-hidden"
            >
              <div class="w-full">
                <img
                  @load="handleImageLoad(`mainImage-${index}`)"
                  v-if="item.picture_link"
                  class="h-[250px] w-full object-cover object-top opacity-0 absolute"
                  :src="item.picture_link"
                  alt=""
                  :id="`mainImage-${index}`"
                />
                <img
                  @load="handleImageLoad(`mainImage2-${index}`)"
                  v-if="item.title_picture"
                  class="h-[250px] w-full object-cover object-top opacity-0 absolute"
                  :src="item.title_picture"
                  alt=""
                  :id="`mainImage2-${index}`"
                />
              </div>
              <SkeletonLoader 
                v-if="newsEventsSelected === newsEventsCategory.EVENTS" 
                :loader-for="`mainImage-${index}`" 
                :image="true" 
              />
              <SkeletonLoader 
                v-if="newsEventsSelected === newsEventsCategory.NEWS" 
                :loader-for="`mainImage-${index}`" 
                :image="true" 
              />
              <div class="w-full h-full flex flex-col gap-3 py-4 px-5">
                <div class="w-full flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-[32px] h-[32px] rounded-full font-raleway bg-backroundLightSeptenary">
                      <img
                        @load="handleImageLoad(`logoImage2-${index}`)"
                        v-if="item.picture_link"
                        class="w-full max-w-[28px]"
                        :src="item.picture_link"
                        alt=""
                        :id="`logoImage-${index}`"
                      />
                      <img
                        @load="handleImageLoad(`logoImage2-${index}`)" 
                        v-if="item.title_picture"
                        class="w-full max-w-[28px]"
                        :src="item.title_picture"
                        alt=""
                        :id="`logoImage2-${index}`" 
                      />
                    </div>
                    <SkeletonLoader 
                      v-if="newsEventsSelected === newsEventsCategory.EVENTS" 
                      :loader-for="`logoImage-${index}`" 
                      :logo="true" 
                    />
                    <SkeletonLoader 
                      v-if="newsEventsSelected === newsEventsCategory.NEWS" 
                      :loader-for="`logoImage2-${index}`" 
                      :logo="true" 
                    />
                    <p class="font-raleway font-semibold text-xs text-backgroundLightPrimary leading-[16px]">{{ item.company.title }}</p>
                  </div>
                  <a
                    href="#"
                    class="border border-backroundLightSeptenary rounded-md p-2 text-xs font-raleway text-backgroundLightPrimary"
                    >{{ 'trnslt'}}
                  </a>
                </div>
                <div class="flex flex-col gap-1 h-ful pb-3 border-b border-b-backroundLightSeptenary">
                  <p class="font-raleway font-bold text-base text-backgroundLightPrimary leading-[24px]">
                    {{ item.title.length <= 18 ? item.title : item.title.slice(0, 18) + ' ...' }}
                  </p>
                  <p v-if="item.description" class="font-raleway text-sm leading-[24px] font-normal text-grey">
                    {{ item.description.length <= 100 ? item.description : item.description.slice(0, 100) + ' ...' }}
                  </p>
                  <p v-if="item.article" class="font-raleway text-sm leading-[24px] font-normal text-grey">
                    {{ item.article.length <= 100 ? item.article : item.article.slice(0, 100) + ' ...' }}
                  </p>
                </div>
                <div class="flex items-center gap-2 mt-auto">
                  <iconbase 
                    v-if="newsEventsCategory.EVENTS === newsEventsSelected" 
                    name="EventsIcon" 
                    width="20" 
                    height="20" 
                  />
                  <iconbase 
                    v-if="newsEventsCategory.NEWS === newsEventsSelected" 
                    name="NewsIcon" 
                    width="20" 
                    height="20" 
                  />
                  <p class="text-black text-sm leading-[20px] font-raleway font-semibold">
                    {{ newsDDMMYY[index].month + ' ' + newsDDMMYY[index].day + ', ' + newsDDMMYY[index].formattedTime }}
                  </p>
                </div>
              </div>
            </div>
          </GridSystem>
          <SpinnerLoader v-else />
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
import { newsEventsArr, newsEvents, sidebar, Routes, RestApi, newsEventsCategory } from '@/imports'
import { useFormatDate, FormatDateType } from '@/composebles/useDateFormat'
import { ModalInformationProps, ModalBtnProps } from '@/types/modals/modalLayout.types'
import { ref, onMounted, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'


onMounted(async () => {
  filteredNewsEventsArr.value = await handleFetch(newsEventsSelected.value)
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
const { locale: currentLang, t } = useI18n()
const newsEventsFilter = [
  {
    icon: 'NewsIcon',
    filter: 'news'
  },
  {
    icon: 'EventsIcon',
    filter: 'events'
  }
] as newsEvents[]
let newsEventsSelected = ref<newsEvents['filter']>(newsEventsFilter[0].filter)
const spinnerLoader = ref<boolean>(true)

// TODO: improve typing of newsEventsArr based on backed API
const filteredNewsEventsArr: Ref<newsEventsArr[]> = ref([])
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
] as sidebar[]

const newsDDMMYY = computed<FormatDateType>(() => {
  if (filteredNewsEventsArr.value) {
    if (newsEventsSelected.value === newsEventsCategory.NEWS) {
      return useFormatDate(filteredNewsEventsArr.value, 'publish_at')
    } else if (newsEventsSelected.value === newsEventsCategory.EVENTS) {
      return useFormatDate(filteredNewsEventsArr.value, 'start')
    }
  }
  return []
})

const handleImageLoad = (id: string) => {
  if (id === 'mainImage-1') {
    console.log(id)
  }
  document.getElementById(id)?.classList.remove('opacity-0')
  document.getElementById(id)?.classList.remove('absolute')
  document.querySelector(`[loader-for=${id}]`)?.classList.add('hidden')
} 

const handleFilter = async (filter: newsEvents['filter']) => {
  if (filter === newsEventsSelected.value) {
    return
  }
  newsEventsSelected.value = filter
  await handleFetch(newsEventsSelected.value).then(result => {
    filteredNewsEventsArr.value = result
  })
  
}

const handleFetch = async (selectedFilter: newsEvents['filter']) => {
  spinnerLoader.value = true
  if (selectedFilter === newsEventsCategory.NEWS) {
    const result = await getNews()
    spinnerLoader.value = false
    return result
  } else if (selectedFilter === newsEventsCategory.EVENTS) {
    const result = await getEvents()
    spinnerLoader.value = false
    return result
  }
}

const getNews = async () => {
  try {
    const news = await RestApi.getNews()
    return news.data.data.data
  } catch (error) {
    console.log(error)
  }
} 

// get events data from backend API
const getEvents = async () => {
  try {
    const events = await RestApi.getEvents()
    return events.data.data.data
  } catch (error) {
    console.log(error)
  }
}

const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}
</script>
