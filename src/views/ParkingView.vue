<template>
  <PageSkeleton class="sidebar-hidden">
    <template v-slot:body>
      <div class="w-full flex flex-col gap-4 px-0">
        <div class="w-full overflow-auto no-scrollbar h-[calc(100vh-140px)] mt-5">
          <div class="w-full flex items-center gap-10 mb-6">
            <label class="cursor-pointer flex items-center gap-2">
              <input
                @change="handleChange"
                value="occupied"
                type="radio"
                class="peer sr-only"
                :checked="selectedVal === 'occupied' ? true : false"
                name="props.name"
                v-model="selectedVal"
              />
              <div class="w-[14px] h-[14px] rounded-[4px] bg-greyMilk peer-checked:bg-radialPrimary"></div>
              <p class="font-bold text-black font-raleway text-base leading-[24px]">{{ $t('occupied') }}</p>
            </label>
            <label class="cursor-pointer flex items-center gap-2">
              <input
                @change="handleChange"
                value="available"
                type="radio"
                class="peer sr-only"
                name="props.name"
                :checked="selectedVal === 'available' ? true : false"
                v-model="selectedVal"
              />
              <div class="w-[14px] h-[14px] rounded-[4px] bg-greyMilk peer-checked:bg-radialPrimary"></div>
              <p class="font-bold text-black font-raleway text-base leading-[24px]">{{ $t('available') }}</p>
            </label>
          </div>
          <GridSystem>
            <Progress floor="1st_floor" :completed="1244" :total="2000" />
            <Progress floor="2nd_floor" :completed="500" :total="2600" />
            <Progress floor="3rd_floor" :completed="128" :total="180" />
          </GridSystem>

          <div class="overflow-auto w-full bg-white rounded-[24px] mt-6 font-raleway">
            <!-- Table Head -->
            <div class="lg:min-w-[1200px] grid grid-cols-[200px,1fr] xl:grid-cols-[200px,1fr,200px] border-b border-light3 pl-6 xl:px-6">
              <div class="font-raleway text-grey font-semibold w-full flex items-center py-10">{{ $t('time') }}</div>
              <div class="flex flex-col">
                <div class="grid grid-cols-3">
                  <div
                    class="font-semibold font-raleway text-base flex text-purple w-full items-center justify-center py-4 bg-purpleLight border-l border-light3"
                  >
                    {{ $t('1st_floor') }}
                  </div>
                  <div
                    class="font-semibold font-raleway text-base flex text-blue w-full items-center justify-center py-4 bg-purpleLight2 border-l border-light3"
                  >
                    {{ $t('2nd_floor') }}
                  </div>
                  <div
                    class="font-semibold font-raleway text-base flex text-sky w-full items-center justify-center py-4 bg-purpleLight3 border-r border-l border-light3"
                  >
                    {{ $t('3rd_floor') }}
                  </div>
                </div>
                <div class="w-full grid grid-cols-6 place-items-center">
                  <div class="text-black font-semibold font-raleway py-4 border-l border-r w-full flex items-center justify-center">
                    {{ $t('working_days') }}
                  </div>
                  <div class="text-black font-semibold font-raleway py-4 border-r border-light3 w-full flex items-center justify-center">
                    {{ $t('weekends') }}
                  </div>
                  <div class="text-black font-semibold font-raleway py-4 border-r border-light3 w-full flex items-center justify-center">
                    {{ $t('working_days') }}
                  </div>
                  <div class="text-black font-semibold font-raleway py-4 border-r border-light3 w-full flex items-center justify-center">
                    {{ $t('weekends') }}
                  </div>
                  <div class="text-black font-semibold font-raleway py-4 border-r border-light3 w-full flex items-center justify-center">
                    {{ $t('working_days') }}
                  </div>
                  <div class="text-black font-semibold font-raleway py-4 border-r w-full flex items-center justify-center">
                    {{ $t('weekends') }}
                  </div>
                </div>
              </div>
              <div class="hidden xl:flex font-raleway text-grey font-semibold w-full items-center py-10 pl-5">{{ $t('hourly') }}</div>
            </div>
            <!-- Table Body -->
            <div class="lg:min-w-[1200px] w-full flex flex-col">
              <div class="grid grid-cols-[225px,1fr] xl:grid-cols-[225px,1fr,225px]">
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-b border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
                <div class="hidden xl:flex w-full row-span-6 px-6 items-center justify-center">
                  <div class="flex flex-col gap-6 items-center justify-center">
                    <p class="text-md text-black font-semibold leading-[26px]">$2 {{ $t('per_hour') }}</p>
                    <img src="/src/assets/img/table.svg" alt="" />
                  </div>
                </div>
                <!---->
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-b border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-b border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-b border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-b border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
                <!---->
                <div class="px-6 border-b text-md text-black font-bold leading-[26px] flex items-center">0 - 2 {{ $t('hours') }}</div>
                <div class="border-r border-light3 w-full grid grid-cols-6 place-items-center">
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway border-r w-full flex items-center justify-center">
                    $5.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway py-4 w-full flex items-center justify-center">
                    $4.00
                  </div>
                  <div class="text-md text-black font-bold font-semibold font-raleway w-full flex items-center justify-center">$5.00</div>
                </div>
              </div>
            </div>
          </div>

          <div class="xl:hidden flex bg-white mt-6 rounded-[24px] w-full px-6 items-center justify-center p-3">
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex font-raleway text-grey font-semibold">{{ $t('hourly') }}</div>
              <p class="text-md text-black font-semibold leading-[26px]">$2 {{ $t('per_hour') }}</p>
              <img src="/src/assets/img/table.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:sidebar> </template>
  </PageSkeleton>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const selectedVal = ref('occupied')
const handleChange = () => {
  console.log(selectedVal.value)
}
</script>
