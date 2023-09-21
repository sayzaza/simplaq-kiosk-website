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
          <FilterBtns :showBtns="true" :pickers="alphabeticalPickerArr" :pickedIs="pickedAlphabetical" @pickBtn="pickAlphabetical" />
          <div class="flex lg:hidden mt-6">
            <CategorySidebar
            :vertical="false"
            @filterCategory="filterShopCategory"
            :categories="shopSidebarCategories"
            :selected="shopSidebarCategoriesSelected"
          />
          </div>

          <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-470px)]  lg:h-[calc(100vh-324px)]">
            <GridSystem class="md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-6">
              <div
                v-for="item in shopsArrDynamic"
                :key="item.id"
                @click="openModal"
                class="cursor-pointer w-full flex flex-col items-center bg-white rounded-[24px] p-4"
              >
                <div class="flex items-center justify-center bg-backroundLightSeptenary w-[64px] h-[64px] rounded-[12px]">
                  <img class="w-[54px]" :src="item.logo" :alt="item.title" />
                </div>
                <p class="mt-5 text-black text-center text-md font-bold font-raleway leading-[26px]">{{ item.title }}</p>
                <p class="font-semibold text-center text-sm font-semibold text-grey leading-[20px]">{{ $t(item.category) }}</p>
              </div>
            </GridSystem>
          </div>

        </div>
      </div>
    </template>
    <template v-slot:sidebar>
      <div class="w-full flex flex-col gap-5 pt-4">
        <CategorySidebar
          :vertical="true"
          @filterCategory="filterShopCategory"
          :categories="shopSidebarCategories"
          :selected="shopSidebarCategoriesSelected"
        />
      </div>
    </template>
  </PageSkeleton>

  <ModalLayout v-if="showModal" @closeModal="closeModal" title="Zara">
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
import { shopArr, FilterBtnsArr, Routes } from '@/imports'
import { ModalBtnProps } from '@/types/modals/modalLayout.types'
import { ShopCategories } from '@/types/pages/shop/shop.types'
import { shopSidebarCategories } from '@/controllers/categoryItems'
import { ref } from 'vue'

const modalBtnData: ModalBtnProps = {
  to: Routes.SHOP,
  text: 'navigate'
}

const shopSidebarCategoriesSelected = ref<string>(shopSidebarCategories[0].val)
const filterShopCategory = (val: string) => {
  shopSidebarCategoriesSelected.value = val
  if (shopSidebarCategoriesSelected.value.toLowerCase() !== 'all') {
    shopsArrDynamic.value = shopsArr.filter(item => {
      return item.category.toLowerCase() === shopSidebarCategoriesSelected.value.toLowerCase()
    })
  } else {
    shopsArrDynamic.value = shopsArr
  }
}
const pickedFloor = ref<string>('all')
const pickFloor = (val: string) => {
  pickedFloor.value = val
}
// A-Z Aplhabetical picker
const pickedAlphabetical = ref<string>('all') // A-Z
const alphabeticalPickerArr = [
  { title: 'A-Z', value: 'All', translate: false },
  { title: 'A', value: 'A', translate: false },
  { title: 'B', value: 'B', translate: false },
  { title: 'C', value: 'C', translate: false },
  { title: 'D', value: 'D', translate: false },
  { title: 'E', value: 'E', translate: false },
  { title: 'F', value: 'F', translate: false },
  { title: 'G', value: 'G', translate: false },
  { title: 'H', value: 'H', translate: false },
  { title: 'I', value: 'I', translate: false },
  { title: 'J', value: 'J', translate: false },
  { title: 'K', value: 'K', translate: false },
  { title: 'L', value: 'L', translate: false },
  { title: 'M', value: 'M', translate: false },
  { title: 'N', value: 'N', translate: false },
  { title: 'O', value: 'O', translate: false },
  { title: 'P', value: 'P', translate: false },
  { title: 'R', value: 'R', translate: false },
  { title: 'S', value: 'S', translate: false },
  { title: 'T', value: 'T', translate: false },
  { title: 'U', value: 'U', translate: false },
  { title: 'V', value: 'V', translate: false },
  { title: 'W', value: 'W', translate: false },
  { title: 'Y', value: 'Y', translate: false },
  { title: 'Z', value: 'Z', translate: false }
] as FilterBtnsArr[]
const pickAlphabetical = (val: string) => {
  pickedAlphabetical.value = val
  if (pickedAlphabetical.value.toLowerCase() !== 'all') {
    shopsArrDynamic.value = shopsArr.filter(item => {
      return item.title.toLowerCase().startsWith(pickedAlphabetical.value.toLowerCase())
    })
  } else {
    shopsArrDynamic.value = shopsArr
  }
  searchVal.value = ''
}

const searchVal = ref<string>('')
const shopsArr = [
  {
    id: 0,
    logo: '/src/assets/img/brands/converse.svg',
    title: 'Converse',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 1,
    logo: '/src/assets/img/brands/reebok.svg',
    title: 'Reebok',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 2,
    logo: '/src/assets/img/brands/pull&bear.svg',
    title: 'Pull&Bear',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 3,
    logo: '/src/assets/img/brands/nike.svg',
    title: 'Nike',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 4,
    logo: '/src/assets/img/brands/ikea.svg',
    title: 'Ikea',
    category: 'home_accessories',
    to: Routes.SHOP
  },

  {
    id: 5,
    logo: '/src/assets/img/brands/asos.svg',
    title: 'Asos',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 6,
    logo: '/src/assets/img/brands/adidas.svg',
    title: 'Adidas',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 7,
    logo: '/src/assets/img/brands/armani.svg',
    title: 'Armani',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 8,
    logo: '/src/assets/img/brands/balenciaga.svg',
    title: 'Balenciaga',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 9,
    logo: '/src/assets/img/brands/burbery.svg',
    title: 'Burbery',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 10,
    logo: '/src/assets/img/brands/cartier.svg',
    title: 'Cartier',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 11,
    logo: '/src/assets/img/brands/chanel.svg',
    title: 'Chanel',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 12,
    logo: '/src/assets/img/brands/Dior.svg',
    title: 'Dior',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 13,
    logo: '/src/assets/img/brands/columbia.svg',
    title: 'Columbia',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 14,
    logo: '/src/assets/img/brands/dolce&gabana.svg',
    title: 'Dolce & Gabbana',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 15,
    logo: '/src/assets/img/brands/fendi.svg',
    title: 'Fendi',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 16,
    logo: '/src/assets/img/brands/guchi.svg',
    title: 'Gucci',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 17,
    logo: '/src/assets/img/brands/hm.svg',
    title: 'H&M',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 18,
    logo: '/src/assets/img/brands/boss.svg',
    title: 'Boss',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  },
  {
    id: 19,
    logo: '/src/assets/img/brands/louis.svg',
    title: 'Louis Vuitton',
    category: ShopCategories.CLOTHES,
    to: Routes.SHOP
  }
] as shopArr[]
const shopsArrDynamic = ref<shopArr[]>(shopsArr)
const handleSearch = () => {
  shopsArrDynamic.value = shopsArr.filter(item => {
    // console.log(item)
    return item.title.toLowerCase().includes(searchVal.value.toLowerCase())
  })
  pickedAlphabetical.value = 'all'
}

const showModal = ref<boolean>(false)
const openModal = () => {
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}
</script>
