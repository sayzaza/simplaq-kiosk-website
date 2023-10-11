<template>
  <PageSkeleton>
    <template v-slot:body>
      <div class="floorplan-wrapper" @mousedown="resetMapTimeout" @mouseup="isDragging = false">
        <div class="map">
          <!-- Map search -->
          <div class="map-top-menu px-0">
            <div class="floorplan-search">
              <Transition name="fade" mode="out-in">
                <div>
                  <el-input
                    v-model="categoryUnitSearch"
                    @input="onInputSearch"
                    @click="onInputSearchClick"
                    class="floorplan-search-input"
                    style="width: 100%"
                    :placeholder="t('floorplanSearchInput')"
                    :clearable="true"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @clear="handleClear"
                  />

                  <div
                    class="floorplan-categories no-scrollbar"
                    ref="floorplanCategoriesRef"
                    @mousedown="onScrollAreaMouseDown($event, floorplanCategoriesRef)"
                    @mousemove="onScrollAreaMouseMove($event, floorplanCategoriesRef)"
                    @mouseLeave="isDragging = false"
                  >
                    <div class="floorplan-category" v-for="category in getAllCategories" :key="category.company_category">
                      <Buttonbase
                        :name="getTranslatedCategoryName(category)"
                        :classname="`c-button--white c-button-big floorplan-category-button ${
                          filteredCategory?.company_category === category.company_category ? 'active-black' : ''
                        }`"
                        @click="onCategoryChange(category.company_category)"
                      />
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <!-- Map wrapper -->
          <div id="map" class="map-wrapper px-0" />
          <!-- Level Picker -->
          <LevelPicker
            v-if="mapIsAssigned"
            :map-selected-level="selectedLevel"
            :existing-levels="existingLevels"
            :actioning-tree="actioningTree"
            @levelChanged="onLevelChange"
          />
          <!-- RecenterButton -->
          <div id="recenterButton">
            <div class="recenter-button-wrapper">
              <el-button plain @click="onMapRecenter">
                <Iconbase name="Mark" />
              </el-button>
            </div>
          </div>
          <!-- Keyboard -->
          <SimpleKeyboard v-if="showKeyboard" :input="categoryUnitSearch" @onChange="onInputSearch" @onClose="showKeyboard = false" />
        </div>
      </div>
    </template>
    <template v-slot:sidebar>
      <!-- Right menu -->
      <div class="right-menu" @mousedown="resetMapTimeout" @mouseup="isDragging = false">
        <!-- Current level / floor -->
        <div
          v-if="parseInt(selectedLevel) >= parseInt(minLevel) && currentSearch && Object.keys(currentSearch).length === 0"
          class="floorplan-level"
        >
          {{ getNumberWithOrdinal(parseInt(selectedLevel)) }} {{ t('floorplanFloor') }}
        </div>
        <div v-else class="floorplan-level">{{ t('floorplanAllFloors') }}</div>
        <!-- Categories -->
        <div class="floorplan-categories" :class="isUnitDetailsPopupOpened ? 'active' : ''">
          <div v-if="!currentSearch" class="floorplan-categories not-found" style="color: rgb(107 114 128); font-size: x-large">
            {{ t('notFound') }}
          </div>
          <div
            v-else
            class="floorplan-category"
            v-for="category in sidebarData"
            v-show="shouldShowCategory(category)"
            :key="category.company_category"
          >
            <div class="category-title">
              {{ getTranslatedCategoryName(category) }}
            </div>
            <!-- Selected category units -->
            <div class="category-list">
              <div
                v-for="unit in category.units"
                v-show="
                  Object.keys(currentSearch).length === 0
                    ? unit.level === selectedLevel
                    : currentSearch[category.company_category]?.includes(unit.company.store_name)
                "
                :key="unit.id"
                class="pa-2 mt-2 category-unit"
                :class="[checkedNodeInTree ? (checkedNodeInTree.unit?.id === unit.id ? 'activeUnit' : 'inactiveUnit') : 'inactiveUnit']"
                @click="paintInMapByBar(category.company_category, category.entity.find(ent => ent.unit?.id === unit.id) as Entity)"
              >
                <el-image
                  :src="unit.use_tenant_icon ? unit.tenant_icon : unit.company.logo_picture"
                  style="margin-right: 1rem; border-radius: 0.5rem; height: 60px; width: 60px; display: flex; flex-shrink: 0"
                >
                  <div class="image-slot" style="height: 60px; width: 60px; display: flex; text-align: center; border: 1px solid">
                    <i
                      class="el-icon-picture-outline"
                      style="height: 60px; width: 100%; align-self: center; display: flex; align-items: center; justify-content: center"
                    />
                  </div>
                </el-image>
                <div class="category-unit-info">
                  <h5 class="categry-unit-headline" :style="{ color: checkedNodeInTree?.unit?.id == unit.id ? 'white' : '' }">
                    {{ unit.company.store_name }}
                  </h5>
                  <p class="categry-unit-category" :style="{ color: checkedNodeInTree?.unit?.id == unit.id ? 'white' : '' }">
                    {{ getTranslatedCategoryName(category) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Entity Details - right panel popup -->
        <div v-if="isUnitDetailsPopupOpened && checkedNodeInTree?.unit" class="unit-details-popup">
          <div class="unit-heading">
            <div class="title">
              {{ checkedNodeInTree.unit.company.store_name }}
            </div>
            <div class="close-btn">
              <Iconbase @click="closeUnitDetailsPopup" class="c-edit-button rounded-btn" name="Cross" width="12" height="12" />
            </div>
          </div>
          <div class="unit-image">
            <img :src="getRandomCompanyPhoto" />
          </div>
          <div class="unit-info">
            <div class="unit-logo">
              <el-image
                :src="
                  checkedNodeInTree.unit.use_tenant_icon ? checkedNodeInTree.unit.tenant_icon : checkedNodeInTree.unit.company.logo_picture
                "
              >
                <div class="image-slot" style="height: 60px; width: 60px; display: flex; text-align: center"></div>
              </el-image>
            </div>
            <div class="unit-name-and-category">
              <h5 class="unit-name">
                {{ checkedNodeInTree.unit.company.store_name }}
              </h5>
              <p class="unit-category">
                {{ getSelectedEntityCategory }}
              </p>
            </div>
          </div>
          <!-- TODO: navigation button -->
          <!-- <div class="navigate-to-unit"></div> -->
          <!-- News -->
          <div class="unit-news" v-if="getPublishedNews.length">
            <div class="title">{{ t('floorplanUnitNews') }}</div>
            <div
              class="unit-images no-scrollbar"
              ref="floorplanNewsRef"
              @mousedown="onScrollAreaMouseDown($event, floorplanNewsRef)"
              @mousemove="onScrollAreaMouseMove($event, floorplanNewsRef)"
              @mouseLeave="isDragging = false"
            >
              <div
                class="unit-thumb-image"
                v-for="(newsItem, idx) in getPublishedNews"
                :key="idx"
                @click.stop.prevent="selectNewsAndOpenDialog(newsItem)"
              >
                <img :src="getTranslatedNewsData(newsItem)?.photo_file.public_url || checkedNodeInTree.unit.company.logo_picture" />
              </div>
              <!-- News dialog -->
              <el-dialog
                v-if="selectedNews.news && selectedNews.translated"
                class="event-dialog"
                v-model="dialogNewsVisible"
                width="450px"
                top="5vh"
                destroy-on-close
                draggable
              >
                <div class="event-dialog-content">
                  <img :src="selectedNews.translated.photo_file.public_url || checkedNodeInTree.unit.company.logo_picture" />
                  <div class="event-name">
                    <div class="title">
                      {{ selectedNews.translated.title }}
                    </div>
                  </div>
                  <div class="event-date" v-if="selectedNews.news.publish_at">
                    <div class="title">{{ t('date') }}</div>
                    <div class="content-wrapper">
                      <div class="icon"><Iconbase name="CalendarIcon" /></div>
                      <div class="content">
                        <span>
                          {{ t('floorplanNewsPublishedAt') }}
                        </span>
                        <span>{{ getFormatedDate(selectedNews.news.publish_at) }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- TODO: navigation button -->
                  <!-- <div class="navigate-to-event"></div> -->
                  <div class="event-contacts" v-if="checkedNodeInTree.unit.company.phones?.length">
                    <div class="title">{{ t('floorplanContact') }}</div>
                    <div class="content-wrapper">
                      <div class="icon"><Iconbase name="PhoneIcon" /></div>
                      <div class="content">
                        <span>{{ t('floorplanPhoneNum') }}</span>
                        <span v-for="phone in checkedNodeInTree.unit.company.phones" :key="phone">{{ phone }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="event-about" v-if="selectedNews.translated.article">
                    <div class="title">{{ t('floorplanAbout') }}</div>
                    <div>{{ selectedNews.translated.article }}</div>
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>
          <!-- Events -->
          <div class="unit-events" v-if="getPublishedEvents.length">
            <div class="title">{{ t('floorplanUnitEvents') }}</div>
            <div
              class="unit-images no-scrollbar"
              ref="floorplanEventsRef"
              @mousedown="onScrollAreaMouseDown($event, floorplanEventsRef)"
              @mousemove="onScrollAreaMouseMove($event, floorplanEventsRef)"
              @mouseLeave="isDragging = false"
            >
              <div
                class="unit-thumb-image"
                v-for="(event, idx) in getPublishedEvents"
                :key="idx"
                @click.stop.prevent="selectEventAndOpenDialog(event)"
              >
                <img :src="getTranslatedEventData(event)?.picture_link || checkedNodeInTree.unit.company.logo_picture" />
              </div>
              <!-- Event dialog -->
              <el-dialog
                v-if="selectedEvent.event && selectedEvent.translated"
                class="event-dialog"
                v-model="dialogEventsVisible"
                width="450px"
                top="5vh"
                destroy-on-close
                draggable
              >
                <div class="event-dialog-content">
                  <img :src="selectedEvent.translated.picture_link || checkedNodeInTree.unit.company.logo_picture" />
                  <div class="event-name">
                    <div class="title">
                      {{ selectedEvent.translated.title }}
                    </div>
                  </div>
                  <div class="event-date" v-if="selectedEvent.event.start || selectedEvent.event.finish">
                    <div class="title">{{ t('floorplanEventDate') }}</div>
                    <div class="content-wrapper">
                      <div class="icon"><Iconbase name="CalendarIcon" /></div>
                      <div class="content">
                        <span>{{ t('floorplanEventStart') }}</span>
                        <span>{{ selectedEvent.event.start }} - {{ selectedEvent.event.finish }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- TODO: navigation button -->
                  <!-- <div class="navigate-to-event"></div> -->
                  <div class="event-contacts" v-if="checkedNodeInTree.unit.company.phones?.length">
                    <div class="title">{{ t('floorplanContact') }}</div>
                    <div class="content-wrapper">
                      <div class="icon"><Iconbase name="PhoneIcon" /></div>
                      <div class="content">
                        <span>{{ t('floorplanPhoneNum') }}</span>
                        <span v-for="phone in checkedNodeInTree.unit.company.phones" :key="phone">{{ phone }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="event-about" v-if="selectedEvent.translated.description">
                    <div class="title">{{ t('floorplanAbout') }}</div>
                    <div>{{ selectedEvent.translated.description }}</div>
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>
          <!-- Rewards -->
          <div class="unit-rewards" v-if="getPublishedRewards.length">
            <div class="title">{{ t('floorplanRewards') }}</div>
            <div
              class="unit-images no-scrollbar"
              ref="floorplanRewardsRef"
              @mousedown="onScrollAreaMouseDown($event, floorplanRewardsRef)"
              @mousemove="onScrollAreaMouseMove($event, floorplanRewardsRef)"
              @mouseLeave="isDragging = false"
            >
              <div class="unit-thumb-image" v-for="(reward, idx) in getPublishedRewards" :key="idx">
                <img :src="reward.photo_file.is_public ? reward.photo_file.public_url : ''" @click="selectRewardAndOpenDialog(reward)" />
              </div>
              <!-- Reward dialog -->
              <el-dialog
                v-if="selectedReward"
                class="event-dialog"
                v-model="dialogRewardsVisible"
                width="450px"
                top="5vh"
                destroy-on-close
                draggable
              >
                <div class="event-dialog-content">
                  <img :src="selectedReward.photo_file.is_public ? selectedReward.photo_file.public_url : ''" />
                  <div class="event-name">
                    <div class="title">
                      {{ selectedReward.name }}
                    </div>
                  </div>
                  <div class="event-date">
                    <div class="title">{{ t('floorplanRewardValidUntil') }}</div>
                    <div class="content-wrapper" v-if="selectedReward.date_from">
                      <div class="icon"><Iconbase name="CalendarIcon" /></div>
                      <div class="content">
                        <span>{{ t('floorplanRewardStart') }}</span>
                        <span>{{ selectedReward.date_from }} - {{ selectedReward.date_to }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-dialog>
            </div>
          </div>
          <!-- About -->
          <div class="unit-about" v-if="getTranslatedAboutData">
            <div class="title">{{ t('floorplanAbout') }}</div>
            <div class="about-text">
              {{ getTranslatedAboutData.description }}
            </div>
          </div>
          <!-- Contacts -->
          <div
            class="unit-contact"
            v-if="
              checkedNodeInTree.unit.company.email ||
              checkedNodeInTree.unit.company.website ||
              checkedNodeInTree.unit.company.phones?.length
            "
          >
            <div class="title">{{ t('floorplanContact') }}</div>
            <div class="contact">
              <div class="content-wrapper" v-if="checkedNodeInTree.unit.company.email">
                <div class="icon"><Iconbase name="MailIcon" /></div>
                <div class="content">
                  <span>{{ t('floorplanEmail') }}</span>
                  <span>{{ checkedNodeInTree.unit.company.email }}</span>
                </div>
              </div>
              <div class="content-wrapper" v-if="checkedNodeInTree.unit.company.website">
                <div class="icon"><Iconbase name="LanguageIcon" /></div>
                <div class="content">
                  <span>{{ t('floorplanWebsite') }}</span>
                  <span>{{ checkedNodeInTree.unit.company.website }}</span>
                </div>
              </div>
              <div class="content-wrapper" v-if="checkedNodeInTree.unit.company.phones?.length">
                <div class="icon"><Iconbase name="PhoneIcon" /></div>
                <div class="content">
                  <span>{{ t('floorplanPhoneNum') }}</span>
                  <span v-for="phone in checkedNodeInTree.unit.company.phones" :key="phone">{{ phone }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Opening hours -->
          <div class="unit-opening-hours" v-if="checkedNodeInTree.unit.company.open_hours">
            <div class="title">{{ t('floorplanOpeningHours') }}</div>
            <div class="content-wrapper">
              <div class="icon"><Iconbase name="OpeningHoursIcon" /></div>
              <div class="content">
                <span>{{ t('floorplanToday') }} ({{ formatOpeningHours(checkedNodeInTree.unit.company.open_hours).day }})</span>
                <span>{{ formatOpeningHours(checkedNodeInTree.unit.company.open_hours).opened }}</span>
              </div>
            </div>
          </div>
          <!-- Reviews -->
          <div class="unit-reviews" v-if="getPublishedReviewsRatings.length">
            <div class="title">{{ t('floorplanReviews') }}</div>
            <div class="content-wrapper">
              <Buttonbase
                v-for="rating in getPublishedReviewsRatings"
                :key="rating"
                icon="StarIcon"
                :name="rating"
                :classname="`c-button-medium c-button--transparent-with-borders floorplan-review-button ${
                  selectedReviewRating === rating ? 'active' : ''
                }`"
                @click="changeReviewRating(rating)"
              />
              <div class="reviews">
                <div class="review" v-for="review in getPublishedReviews" :key="review.id">
                  <img
                    :src="
                      review.customer.profile_photo_file.is_public
                        ? review.customer.profile_photo_file.public_url
                        : checkedNodeInTree.unit.company.logo_picture
                    "
                    class="icon"
                  />
                  <div class="content">
                    <span>{{ review.customer.first_name }} {{ review.customer.last_name }}</span>
                    <span>{{ review.review }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="map-reset-counter">
          {{ currentCountDown }}
        </div>
      </div>
    </template>
  </PageSkeleton>
</template>

<script lang="ts" setup>
import { Ref, ref, watch, onMounted, onBeforeUnmount, computed, nextTick, toRaw } from 'vue'
import mapboxgl, { type LngLatLike } from 'mapbox-gl'
import {
  CategoryUnit,
  CompanyEvent,
  CompanyEventTranslations,
  Reward,
  Entity,
  RestApi,
  ItemState,
  CompanyNews,
  CompanyNewsTranslations
} from '@/imports'
import { useFloorPlan } from '@/composebles/useFloorPlan'
import Iconbase from '@/components/icons/Iconbase.vue'
import LevelPicker from '@/components/ui/floorplan/LevelPicker.vue'
import PageSkeleton from '@/components/ui/skeleton/PageSkeleton.vue'
import SimpleKeyboard from '@/components/ui/simpleKeyboard/SimpleKeyboard.vue'
import Buttonbase from '@/components/ui/button/Buttonbase.vue'

const {
  activateMarkerAnimation,
  addMissingIconToMap,
  appStore,
  categoriesUnit,
  categoryUnitSearch,
  centerEntity,
  centerEntityMarker,
  closeUnitDetailsPopup,
  checkedNodeInTree,
  checkToUnhighlightProperty,
  currentCountDown,
  currentLang,
  currentSearch,
  deactivateMarkerAnimation,
  defaultCategory,
  existingLevels,
  fetchProperties,
  floorplanNewsRef,
  floorplanEventsRef,
  floorplanRewardsRef,
  floorplanCategoriesRef,
  getAllCategories,
  getCenter,
  getEntityCenter,
  getYourMapPositionMarkerHtml,
  highlightClickedFeatureInTree,
  initMarkers,
  isUnitDetailsPopupOpened,
  map,
  mapLoaded,
  onSearch,
  polylabel,
  recenterMapLocal,
  resetMapTimeout,
  resetUI,
  selectedLevel,
  serverTime,
  setActiveCategory,
  setFloorLevel,
  showKeyboard,
  sidebarData,
  t,
  updateMarkersThrottled,
  filteredCategory
} = useFloorPlan()

const actioningTree = { create: { state: null }, edit: { state: null } }
const mapIsAssigned: Ref<boolean> = ref(false)
// const pointSelected = ref(null)
const mapStyle: Ref<any> = ref(null) // JSON object
const selectedReviewRating: Ref<string> = ref(t('floorplanReviewsAll'))
const minLevel: Ref<string> = computed(() => {
  return existingLevels.value ? existingLevels.value[0] : '0'
})

const selectedEvent: Ref<{
  event: CompanyEvent | null
  translated: CompanyEventTranslations | null
}> = ref({ event: null, translated: null })

const selectedNews: Ref<{
  news: CompanyNews | null
  translated: CompanyNewsTranslations | null
}> = ref({ news: null, translated: null })

const dialogNewsVisible = ref(false)
const dialogEventsVisible = ref(false)
const dialogRewardsVisible = ref(false)
const selectedReward: Ref<Reward | null> = ref(null)

watch(
  () => checkedNodeInTree.value,
  (newValue: any, oldValue: any) => {
    if (oldValue !== null) {
      map.value!.setFeatureState({ source: 'floorplan_polygon', id: oldValue.id }, { active: false })
      deactivateMarkerAnimation(oldValue.id)
    }

    if (newValue !== null) {
      map.value!.setFeatureState({ source: 'floorplan_polygon', id: newValue.id }, { active: true })
      activateMarkerAnimation(newValue.id)
    }
  }
)

// TODO: currently not in usage! Maybe could be removed.
// watch(
//   () => pointSelected.value,
//   (newValue: any, oldValue: any) => {
//     if (oldValue !== null) {
//       deactivateMarkerAnimation(oldValue)
//     }
//     if (newValue !== null) {
//       // const pointData = this.featurePointsTexts.find(marker => marker.id === newValue)
//       // this.markerForSelected = new mapboxgl.Popup({ closeOnClick: true, offset: popupOffsets })
//       //   .setLngLat(pointData.properties.geom.coordinates)
//       //   .setHTML(
//       //     this.returnReducedPopupHTML(pointData)
//       //   )
//       //   .addTo(this.map)
//       // this.markerForSelected.on('close', () => {
//       //   if (this.pointSelected === pointData.id) {
//       //     this.pointSelected = null
//       //     this.markerForSelected.remove()
//       //   }
//       // })
//       activateMarkerAnimation(newValue)
//     }
//   }
// )

onMounted(async () => {
  appStore.toggleLoading(true)
  const responseCategory = await RestApi.getCompanyCategories()
  categoriesUnit.value = responseCategory.data.data.data.filter((i: any) => i.company_category !== 'Default')
  await fetchProperties(false, true, true)
  getEntityCenter()

  await fetch('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json')
    .then(response => response.json())
    .then(data => {
      mapStyle.value = data
    })
  mapStyle.value.layers.forEach((layer: any) => {
    if (layer.paint && layer.paint['fill-opacity']) {
      layer.paint['fill-opacity'] = 0.3
    } else if (layer.paint && layer.paint['line-opacity']) {
      layer.paint['line-opacity'] = 0.3
    } else if (layer.paint && layer.paint['fill-color']) {
      layer.paint['fill-opacity'] = 0.3
    } else if (layer.paint && layer.paint['background-opacity']) {
      layer.paint['background-opacity'] = 0.3
    }
  })
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltcGxhcSIsImEiOiJjbGNxbmJvZDMwNWN3M29ucGNpNjlsaGVlIn0.0-8Z6MKNWmZF9Fw3ztPtJw'
  map.value = new mapboxgl.Map({
    container: 'map',
    style: mapStyle.value,
    center: centerEntity.value?.geom?.coordinates
      ? Array.isArray((centerEntity.value.geom.coordinates as number[][][])[0])
        ? (polylabel(centerEntity.value.geom.coordinates as number[][][]) as LngLatLike)
        : (centerEntity.value.geom.coordinates as LngLatLike)
      : (getCenter() as LngLatLike),
    minZoom: 17,
    maxZoom: 20
  })

  // disable map rotation using right click + drag
  map.value.dragRotate.disable()

  // disable map rotation using touch rotation gesture
  map.value.touchZoomRotate.disableRotation()

  map.value.addControl(
    new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true
    }),
    'bottom-right'
  )

  if (centerEntity.value?.geom?.coordinates) {
    centerEntityMarker.value = new mapboxgl.Marker(getYourMapPositionMarkerHtml(), {
      anchor: 'bottom',
      scale: 3
    })
      .setLngLat(
        Array.isArray((centerEntity.value.geom.coordinates as number[][][])[0])
          ? (polylabel(centerEntity.value.geom.coordinates as number[][][]) as LngLatLike)
          : (centerEntity.value.geom.coordinates as LngLatLike)
      )
      .addTo(map.value)
  }

  mapIsAssigned.value = true

  new ResizeObserver(() => {
    map.value!.resize()
  }).observe(document.getElementById('map') as HTMLElement)

  map.value.once('load', mapLoaded)
  map.value.on('zoom', updateMarkersThrottled)
  map.value.on('click', checkToUnhighlightProperty)
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.off('load', mapLoaded)
    map.value.off('click', ['floorplan_polygon-fill', 'floorplan_polygon-outline'], highlightClickedFeatureInTree)
    map.value.off('styleimagemissing', addMissingIconToMap)
    map.value.off('zoom', updateMarkersThrottled)
    map.value.off('click', checkToUnhighlightProperty)
  }
})

// const querySearch = (queryString: string, cb: any) => {
//   const results = unitsToSearch.value.search("'" + queryString).map((result: any) => result.item)
//   cb(results)
// }

// const createFilter (queryString: string) {
//   return (categoryUnit) => {
//     return categoryUnit.value.toLowerCase().includes(queryString.toLowerCase())
//     // return (categoryUnit.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
//   }
// }

const paintInMapByBar = (companyCategory: string, entity: Entity) => {
  const levelBeforeChange = toRaw(selectedLevel.value) // floor level before change
  recenterMapLocal(entity.level) // change level and recenter map
  onCategoryChange(companyCategory, levelBeforeChange) // change category and reload map markers

  checkedNodeInTree.value = entity
  isUnitDetailsPopupOpened.value = true // open unit details popup
  // console.log('selected entity:', checkedNodeInTree.value)

  // Create new path / line to selected unit
  // addNewRouteToMap(entity)

  // NEPOUZIVAT
  // setTimeout(() => {
  //   if (this.checkedNodeInTree) {
  //     this.markerForSelected = new mapboxgl.Popup({ closeOnClick: true, offset: popupOffsets })
  //       .setLngLat(polylabel(entity.geom.coordinates))
  //       .setHTML(
  //         this.returnPopupHTML(entity.unit, entity.level)
  //       )
  //       .addTo(this.map)
  //     this.markerForSelected.on('close', () => {
  //       if (this.checkedNodeInTree?.id === entity.id) {
  //         this.checkedNodeInTree = null
  //       }
  //     })
  //   }
  // }, 100)
}

const handleFocus = () => {
  showKeyboard.value = true
}
const handleBlur = () => {}

const handleClear = () => {
  // Note: onInputSearch() is also triggered when clear buton is pressed.
}

const getNumberWithOrdinal = (n: number) => {
  let s: string[] = []
  switch (currentLang.value) {
    case 'en':
      s = ['th', 'st', 'nd', 'rd']
      break
    case 'sk':
      s = ['.', '.', '.', '.']
      break
    default:
      s = ['.', '.', '.', '.']
      break
  }
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

watch(
  () => appStore.lang,
  () => {
    // update your map position marker based on current language
    if (centerEntityMarker.value) {
      centerEntityMarker.value.getElement().innerHTML = getYourMapPositionMarkerHtml().innerHTML
    }

    // on language switch, update reviews rating translations
    nextTick(() => {
      changeReviewRating(t('floorplanReviewsAll'))
    })
  }
)

const getPublishedReviewsRatings = computed(() => {
  const reviews = checkedNodeInTree.value?.unit?.company.company_reviews
  const availableRatings = new Set(reviews?.filter(review => review.status === 'published').map(review => review.rating.toString()))

  return availableRatings.size > 0 ? [t('floorplanReviewsAll'), ...Array.from(availableRatings)] : []
})

const getPublishedReviews = computed(() => {
  const reviews = checkedNodeInTree.value?.unit?.company.company_reviews
  const showAllReviews = selectedReviewRating.value === t('floorplanReviewsAll')
  return reviews?.filter(
    review => review.status === 'published' && (review.rating.toString() === selectedReviewRating.value || showAllReviews)
  )
})

let isDragging = false
let startingY = 0
let startingX = 0

const onScrollAreaMouseDown = (e: MouseEvent, domNodeRef: HTMLElement | null) => {
  if (!domNodeRef) {
    return
  }

  isDragging = true
  startingX = e.clientX - domNodeRef.offsetLeft
  startingY = e.clientY - (domNodeRef.offsetTop || 0)
}

const onScrollAreaMouseMove = (e: MouseEvent, domNodeRef: HTMLElement | null) => {
  if (!domNodeRef) {
    return
  }

  if (!isDragging) return
  e.preventDefault()

  const currentX = e.clientX - domNodeRef.offsetLeft
  const currentY = e.clientY - (domNodeRef.offsetTop || 0)
  const scrollX = currentX - startingX
  const scrollY = currentY - startingY

  domNodeRef.scrollLeft = domNodeRef.scrollLeft - scrollX
  domNodeRef.scrollTop = domNodeRef.scrollTop - scrollY
  startingX = currentX
  startingY = currentY
}

// these hours are automatically translated based on current lang
const formatOpeningHours = (openingHours: Array<{ from: string; to: string }>): { day: string; opened: string } => {
  const options = { hour: 'numeric' as any, minute: 'numeric' as any }

  const todayISODate = new Date(serverTime.value).toISOString()
  const todayDate = todayISODate.slice(0, 10) // 2023-01-01
  const openingTime = new Date(`${todayDate}T${openingHours[0].from}`)
  const closingTime = new Date(`${todayDate}T${openingHours[0].to}`)
  const dayOfWeek = new Date(serverTime.value).toLocaleDateString(currentLang.value, {
    weekday: 'long'
  }) // Monday, Tuesday ...
  const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1) // capitalize first letter

  return {
    day: formattedDay,
    opened: `${openingTime.toLocaleTimeString(currentLang.value, options)} - ${closingTime.toLocaleTimeString(currentLang.value, options)}`
  }
}

const changeReviewRating = (reviewValue: string) => {
  selectedReviewRating.value = reviewValue
}

const getTranslatedAboutData = computed(() => {
  return checkedNodeInTree.value?.unit?.company?.translations.find(translation => translation.locale === currentLang.value) || null
})

const getTranslatedNewsData = (event: CompanyNews) => {
  return event.translations.find(translation => translation.locale === currentLang.value) || null
}

const getTranslatedEventData = (event: CompanyEvent) => {
  return event.translations.find(translation => translation.locale === currentLang.value) || null
}

const getTranslatedCategoryName = (category: CategoryUnit) => {
  const categoryTranslation = category.translations.find(translation => translation.locale === currentLang.value)
  const defaultLanguageCategoryName = category.company_category

  // return the localized category name or the default company_category name if
  // that particular language translation is not available
  return categoryTranslation ? categoryTranslation!.company_category : defaultLanguageCategoryName
}

const getSelectedEntityCategory = computed(() => {
  const selectedCategory = checkedNodeInTree.value?.unit?.company.company_category
  if (selectedCategory) {
    return getTranslatedCategoryName(selectedCategory)
  } else {
    return 'N/A'
  }
})

const onCategoryChange = (categoryName: string, levelBeforeChange?: string) => {
  resetUI()
  onSearch('')
  // when user clicks on Unit in right panel, we also receive level before change
  // because we re-calculate initMarkers() only if level or category was changed.
  setActiveCategory(categoryName, levelBeforeChange)
}

const onInputSearchClick = () => {
  resetUI({ hideKeyboard: false })
  // setActiveCategory(defaultCategory)
}

const onInputSearch = (searchQuery: string) => {
  resetUI({ hideKeyboard: false })
  onSearch(searchQuery)

  if (searchQuery === '') {
    const categoryName = filteredCategory.value?.company_category || defaultCategory
    setActiveCategory(categoryName)
  }
}

const onLevelChange = (level: string) => {
  const levelBeforeChange = toRaw(selectedLevel.value) // floor level before change
  resetUI()
  setFloorLevel(level) // Note: we do not use recenterMapLocal(level) as we do not want to re-center whole map on level change
  const categoryName = filteredCategory.value?.units.some(u => u.level === level)
    ? filteredCategory.value.company_category // level was changed but category exist also on new level
    : defaultCategory // level was changed and category does not exist on new level

  setActiveCategory(categoryName, levelBeforeChange)
}

const onMapRecenter = () => {
  resetUI()
  recenterMapLocal(centerEntity.value?.level)

  if (centerEntity.value && centerEntity.value.level !== selectedLevel.value) {
    initMarkers() // re-init map markers
  }
}

// TODO: path navigation to selected unit was not yet finished ...
// const addNewRouteToMap = (entity: Entity) => {
//   console.log('newRoute points:', centerEntity.value?.geom.coordinates, checkedNodeInTree.value?.geom.coordinates)
//   const startCoords = centerEntity.value?.geom.coordinates // my position on map
//   const endCoords = checkedNodeInTree.value?.geom.coordinates // target position on map
//   const intermediateCoords = [ // these are the middle steps between startCoords and endCoords - TODO this should be fetched from API
//     [14.491672, 50.104522],
//     [14.491594, 50.104251]
//   ]
//   // Add the first segment of the route from startCoords to the first intermediate point
//   const features: featureData[] = [
//     {
//       id: entity.id,
//       type: 'Feature',
//       geometry: {
//         type: 'LineString',
//         coordinates: [startCoords, intermediateCoords[0]]
//       },
//       properties: { ...entity }
//     }
//   ]
//   // Add each intermediate segment of the route
//   for (let i = 0; i < intermediateCoords.length - 1; i++) {
//     features.push({
//       type: 'Feature',
//       geometry: {
//         type: 'LineString',
//         coordinates: [intermediateCoords[i], intermediateCoords[i + 1]]
//       }
//     })
//   }
//   // Add the last segment of the route from the last intermediate point to endCoords
//   features.push({
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [intermediateCoords[intermediateCoords.length - 1], endCoords[0][0]]
//     }
//   })
//   // Add the data source to the map
//   createOrUpdateSource('route', map.value, features)
//   // Add a line layer that uses the route data source
//   createLayer('route', map.value, {
//     type: 'line',
//     source: 'route',
//     paint: {
//       'line-color': 'red',
//       'line-width': 5
//     }
//   })
// }

const getRandomCompanyPhoto = computed(() => {
  const singleBigLogoUrl = checkedNodeInTree.value?.unit?.company.big_logo || ''

  // TODO take a random shop store photo
  //      for now use the big log instead
  /* const photos = checkedNodeInTree.value?.unit?.company.company_shop_photos.map(photoData => photoData.photo_file.public_url) || []
  const arrayLength = photos.length
  if (arrayLength === 0) {
    return ''
  }
  const randomIndex = Math.floor(Math.random() * arrayLength)
  return photos[randomIndex] */

  return singleBigLogoUrl
})

const getPublishedNews = computed(() => {
  return checkedNodeInTree.value?.unit?.company?.news?.filter(e => e.status === ItemState.Published) || []
})

const getPublishedEvents = computed(() => {
  return checkedNodeInTree.value?.unit?.company?.events?.filter(e => e.status === ItemState.Published) || []
})

const selectNewsAndOpenDialog = (news: CompanyNews) => {
  selectedNews.value = { news, translated: getTranslatedNewsData(news) }
  dialogNewsVisible.value = true
}

const selectEventAndOpenDialog = (event: CompanyEvent) => {
  selectedEvent.value = { event, translated: getTranslatedEventData(event) }
  dialogEventsVisible.value = true
}

const getPublishedRewards = computed(() => {
  return checkedNodeInTree.value?.unit?.company.rewards.filter(r => r.status === ItemState.Published) || []
})

const selectRewardAndOpenDialog = (reward: Reward) => {
  selectedReward.value = reward
  dialogRewardsVisible.value = true
}

// determines whether to show the category data in right panel or not
const shouldShowCategory = (category: CategoryUnit) => {
  const hasSearchMatch = currentSearch.value && category.company_category in currentSearch.value
  const hasEmptySearch = currentSearch.value && Object.keys(currentSearch.value).length === 0
  const hasMatchingCategory = filteredCategory.value && filteredCategory.value.company_category === category.company_category
  const hasMatchingLevel = category.units.some(unit => unit.level === selectedLevel.value)
  const hasMatchingDefaultCategory = filteredCategory.value && filteredCategory.value.company_category === defaultCategory

  const showCategory =
    hasSearchMatch || // search is active (searches all, globally on all categories, apart from that which category is selected)
    (hasEmptySearch && hasMatchingCategory && hasMatchingLevel) || // some category button different from defaultCategory was clicked and search is not active
    (hasMatchingDefaultCategory && hasMatchingLevel && (hasEmptySearch ? true : hasSearchMatch)) // default category is selected and search is / isnt active

  return showCategory
}

// get date in DD/MM/YYYY format
const getFormatedDate = (date: string) => {
  const newDate = new Date(date)
  const day = newDate.getDate().toString().padStart(2, '0')
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
  const year = newDate.getFullYear().toString()

  return `${day}/${month}/${year}`
}
</script>
