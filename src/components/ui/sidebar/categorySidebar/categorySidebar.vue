<template>
  <div  v-if="vertical" class="w-full flex flex-col gap-10">
    <h6 class="text-2xl font-raleway font-bold text-black leading-[32px] tracking-[-1%]">{{ $t('categories') }}</h6>
    <div class="flex flex-col gap-4">
      <div @click="filterCategory(item.val)" v-for="(item, index) in props.categories" :key="index" :class="`${selected === item.val ? 'active' : ''} category-div flex items-center gap-2 p-2 rounded-[16px] border !border-backroundLightSeptenary cursor-pointer group`">
        <div class="rounded-div w-[56px] h-[56px] flex items-center justify-center bg-backroundLightSeptenary rounded-full group-hover:bg-greenLight2 transition-all">
          <Iconbase class="category transition-all" :name="item.ico" width="24" height="24" />
        </div>
        <div class="flex flex-col gap-1">
            <p class="text-black text-md font-raleway font-bold leading-[26px]">{{ $t(item.name) }}</p>
            <p class="text-grey text-sm font-raleway font-semibold leading-[20px]">{{ item.places }} {{ $t('places') }}</p>
        </div>
      </div>
    </div>
  </div>

  <div  v-else class="w-full flex flex-col gap-4">
    <h6 class="text-2xl font-raleway font-bold text-black leading-[32px] tracking-[-1%]">{{ $t('categories') }}</h6>
    <div class="flex flex-row gap-4 w-full overflow-auto no-scrollbar">
      <div @click="filterCategory(item.val)" v-for="(item, index) in props.categories" :key="index" :class="`${selected === item.val ? 'active' : ''} bg-white min-w-[250px] category-div flex items-center gap-2 p-2 rounded-[16px] border !border-backroundLightSeptenary cursor-pointer group`">
        <div class="rounded-div w-[56px] h-[56px] flex items-center justify-center bg-backroundLightSeptenary rounded-full group-hover:bg-greenLight2 transition-all">
          <Iconbase class="category transition-all" :name="item.ico" width="24" height="24" />
        </div>
        <div class="flex flex-col gap-1">
            <p class="text-black text-md font-raleway font-bold leading-[26px]">{{ $t(item.name) }}</p>
            <p class="text-grey text-sm font-raleway font-semibold leading-[20px]">{{ item.places }} {{ $t('places') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CategorySidebarTypes } from '@/controllers/categoryItems'
import { PropType} from 'vue'
import Iconbase from '@/components/icons/Iconbase.vue'

const props = defineProps({
  categories: {
    type: Array as PropType<CategorySidebarTypes[]>,
    required: true
  },
  selected: {
    type: String as PropType<CategorySidebarTypes['val']>,
    required: true,
  },
  vertical: {
    type: Boolean as PropType<CategorySidebarTypes['vertical']>,
    required: false,
    default: true
  }
})
const emits = defineEmits(['filterCategory'])
const filterCategory = (val: CategorySidebarTypes['val'])=> {
    emits('filterCategory', val)
}
</script>
