import { ref, nextTick, Ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import 'mapbox-gl/dist/mapbox-gl.css'
import styler from 'stylefire'
import polylabel from 'polylabel'
import mapboxgl, { LngLatLike } from 'mapbox-gl'
import { animate, backIn, backOut } from 'popmotion'
import Fuse from 'fuse.js'
import { normalizeSync } from 'normalize-diacritics'
import throttle from 'lodash/throttle'
import { CategoryUnit, CustomMapControl, ENTITY_TYPES, ENTITY_TYPES_SORT, Entity, RestApi, featureData } from '@/imports'
import { useI18n } from 'vue-i18n'

// Element-plus UI library used only in Floorplan view
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { app } from '@/main'
import { useAppStore } from '@/store/app'

// register ElementPlus library
app.use(ElementPlus)

// Register the ElementPlus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

export function useFloorPlan() {
  const route = useRoute()
  const { locale: currentLang, t } = useI18n()
  const appStore = useAppStore()

  const floorplanNewsRef: Ref<HTMLElement | null> = ref(null)
  const floorplanEventsRef: Ref<HTMLElement | null> = ref(null)
  const floorplanRewardsRef: Ref<HTMLElement | null> = ref(null)
  const floorplanCategoriesRef: Ref<HTMLElement | null> = ref(null)

  let markers: any = []
  const layerNames = [
    'floorplan_polygon-fill',
    'floorplan_polygon-outline',
    'floorplan_polygon-point',
    'floorplan_names-layer',
    'floorplan_polygon-extrusion'
  ] // 'floorplan_images_names-layer'
  // const popupOffsets = {
  //   'top': [0, 5],
  //   'top-left': [5, 5],
  //   'top-right': [-5, 5],
  //   'bottom': [0, -40],
  //   'bottom-left': [10, -5],
  //   'bottom-right': [-10, -5],
  //   'left': [15, 0],
  //   'right': [-15, 0]
  // }
  const iconsLoaded: any = []
  const mapMarkers: mapboxgl.Marker[] = []

  const map: Ref<mapboxgl.Map | undefined> = ref()
  const featurePointsTexts: Ref<featureData[]> = ref([])
  const featurePointsImages: Ref<featureData[]> = ref([])
  const featuresList: Ref<featureData[]> = ref([])
  const existingLevels: Ref<string[]> = ref([])
  const featureImages: Ref<any> = ref([])
  const addedImagesIds: Ref<number[]> = ref([])
  const checkedNodeInTree: Ref<Entity | null> = ref(null) // selected mall Entity
  const entitiesTree: Ref<Entity[]> = ref([])
  const entitiesFlatList: Ref<Entity[]> = ref([])
  const markerForSelected: Ref<any> = ref(null)
  const centerEntity: Ref<Entity | undefined> = ref() // your position - kiosk position
  const selectedLevel: Ref<string> = ref('0')
  const showKeyboard: Ref<boolean> = ref(false)
  const sidebarData: Ref<CategoryUnit[]> = ref([])
  const currentCountDown: Ref<any> = ref(null)
  const currentCountDownInterval: Ref<any> = ref(null)
  const currentSearch: Ref<{ [key: string]: any } | null> = ref({})
  const mapTimeout: Ref<any> = ref(null)
  const categoryUnitSearch = ref('')
  const searchUpdated: Ref<number> = ref(0)
  const unitsToSearch: Ref<any> = ref([]) // mall entities / units to search
  const centerEntityMarker: Ref<any> = ref(null) // kiosk position marker
  const categoriesUnit: Ref<CategoryUnit[]> = ref([])
  const filteredCategory: Ref<CategoryUnit | undefined> = ref()
  const isUnitDetailsPopupOpened: Ref<boolean> = ref(false)
  const defaultCategory = 'All categories' // all categories are selected by default on floorplan init or floorplan refresh;
  const serverTime = ref('')

  const highlightClickedFeatureInTree = (e: any) => {
    const features: any = map.value!.queryRenderedFeatures(e.point, {
      layers: ['floorplan_polygon-fill', 'floorplan_polygon-outline']
    })
    const clickedEntity = entitiesFlatList.value.find(entity => entity.id === features[0].id) as Entity

    if (features[0].properties?.type === 'unit' && features[0].properties?.unit && JSON.parse(features[0].properties?.unit)?.company) {
      checkedNodeInTree.value = clickedEntity
      isUnitDetailsPopupOpened.value = true // open unit details popup

      // Note: Previously we had a popup in map with info about floor and opening hours. Its no more needed.

      // if (checkedNodeInTree.value?.id === features[0].id) {
      // //@ts-ignore
      // markerForSelected.value = new mapboxgl.Popup({ closeOnClick: true, offset: popupOffsets })
      //   //@ts-ignore
      //   .setLngLat(polylabel(JSON.parse(features[0].properties.geom).coordinates as number[][][]))
      //   .setHTML(
      //     features[0].properties.attributes
      //       ? JSON.parse(features[0].properties.attributes).use_tenant_icon
      //         ? returnReducedPopupHTML(features[0].properties)
      //         : returnPopupHTML(JSON.parse(features[0].properties.unit), features[0].properties.level)
      //       : returnPopupHTML(JSON.parse(features[0].properties.unit), features[0].properties.level)
      //   )
      //   .addTo(map.value!)
      // markerForSelected.value.on('close', () => {
      //   if (checkedNodeInTree.value?.id === features[0].id) {
      //     unhighlightProperty()
      //     nextTick(() => markerForSelected.value?.remove())
      //   }
      // })
      // } else {
      //   checkedNodeInTree.value = features[0]
      // checkedNodeInTree.value.unit_id = JSON.parse(features[0].properties.unit).id
      // }
    } else {
      unhighlightProperty()
      closeUnitDetailsPopup()
    }
  }

  // const returnPopupHTML = (unit: any, level: any) => {
  //   hideKeyboard()
  //   let categoryName = 'N/A'
  //   sidebarData.value.forEach((category: any) => {
  //     if (unit.company?.company_category_id === category.id) {
  //       categoryName = category?.company_category
  //     }
  //   })

  //   return `<div class="bg-white shadow overflow-hidden" style="border-radius: 0.4rem !important; min-width: 250px;">
  //     <div class="px-7 pt-3 pb-2" style="display: flex">
  //       <img src="${unit.company?.logo_picture}" style="height: 50px; width: 50px; margin-right: 0.7rem; flex-shrink: 0;"/>
  //       <div class="w-100">
  //         <h5 class="text-lg leading-6 font-medium text-gray-900" style="width: auto; margin-bottom: 0.25rem">${unit.company?.store_name}</h5>
  //         <div style="display: flex; width:100%;">
  //           <p class="max-w-2xl text-gray-500" style="margin-bottom: 0rem; flex: 1">${categoryName}</p>
  //           <p class="max-w-2xl text-gray-500" style="margin-bottom: 0rem">Patro: ${level}</p>
  //         </div>
  //       </div>
  //     </div>
  //     <div style="border-top-width: 2px; border-color: rgb(229 231 235);">
  //       <dl style="margin-bottom: 0px">
  //         <div class="px-4 py-2" style="background: #F9FAFB">
  //           <dt class="font-medium text-gray-500 pb-1" style="font-size: 14px;">Otevírací doba</dt>
  //           <dd class="mt-1 text-xs text-gray-900">${unit.company?.open_hours ? parseOpeningHours(JSON.parse(unit.company.open_hours)) : 'N/A'}</dd>
  //         </div>
  //       </dl>
  //     </div>
  //   </div>`
  // }

  // const returnReducedPopupHTML = (property: any) => {
  //   hideKeyboard()
  //   return `<div class="bg-white shadow overflow-hidden" style="border-radius: 0.4rem !important; min-width: 250px;">
  //     <div class="px-4 py-3 pb-2" style="display: flex">
  //       <img src="${property?.icon}" style="height: 50px; width: 50px; margin-right: 0.7rem; flex-shrink: 0;"/>
  //       <div class="w-100">
  //         <h5 class="text-lg leading-6 font-medium text-gray-900" style="width: auto; margin-bottom: 0.25rem">${property?.subtitle}</h5>
  //         <div style="display: flex; width:100%;">
  //           <p class="max-w-2xl text-gray-500" style="margin-bottom: 0rem">Patro:${property?.level}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>`
  // }

  // const parseOpeningHours = (openingHours: any) => {
  //   const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
  //   const parsedOpeningHours: any[] = []
  //   days.forEach((day, index) => {
  //     parsedOpeningHours.push(
  //       day +
  //         ': ' +
  //         (openingHours[index].from ? openingHours[index].from.slice(0, 5) : 'N/A') +
  //         ' - ' +
  //         (openingHours[index].to ? openingHours[index].to.slice(0, 5) : 'N/A')
  //     )
  //   })
  //   return parsedOpeningHours.join('<br>')
  // }

  const hideKeyboard = () => {
    showKeyboard.value = false
  }

  const resetUI = (data: { hideKeyboard: boolean } = { hideKeyboard: true }) => {
    if (data.hideKeyboard) {
      hideKeyboard()
    }
    unhighlightProperty()
    closeUnitDetailsPopup()
  }

  const addFeaturesToMap = (mall = false) => {
    createOrUpdateSource('floorplan_polygon', map.value, featuresList.value)

    if (!mall) {
      createOrUpdateSource('floorplan_names', map.value, featurePointsTexts.value)
    }
    // this.createOrUpdateSource('floorplan_images_names', this.map, this.featurePointsImages)
    createLayer('floorplan_polygon-fill', map.value, {
      type: 'fill',
      source: 'floorplan_polygon',
      paint: {
        'fill-opacity': ['case', ['==', ['get', 'type'], ENTITY_TYPES.MALL], 0, 1],
        'fill-color': [
          'case',
          // // if private
          // ['all', ['has', 'access'], ['in', ['get', 'access'], ['literal', ['no', 'private']]]],
          // '#F2F1F0',
          // // if POI
          // ['all', ['==', ['get', 'is_poi'], true], ['!=', ['get', 'class'], 'corridor']],
          // '#D4EDFF',
          ['boolean', ['feature-state', 'active'], false],
          '#eb6e79',
          ['==', ['get', 'type'], ENTITY_TYPES.UNIT],
          '#EBEBEB',
          ['==', ['get', 'type'], ENTITY_TYPES.UNITNULL],
          '#cfcfcf',
          ['==', ['get', 'type'], ENTITY_TYPES.WALL],
          '#FFF',
          ['==', ['get', 'type'], ENTITY_TYPES.PRIVATE_AREA],
          '#E7DFD2',
          ['==', ['get', 'type'], ENTITY_TYPES.GRASS_AREA],
          '#DFECD3',
          ['==', ['get', 'type'], ENTITY_TYPES.FLOOR],
          '#FDFCF9',
          // default
          '#d1d1d1'
        ]
      },
      layout: {
        'fill-sort-key': ['to-number', ['get', 'priority']]
      },
      filter: ['==', ['geometry-type'], 'Polygon'],
      metadata: {
        base_filter: ['==', ['geometry-type'], 'Polygon']
      }
    })
    createLayer('floorplan_polygon-outline', map.value, {
      type: 'line',
      source: 'floorplan_polygon',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'type'], ENTITY_TYPES.UNIT],
          '#fff',
          ['==', ['get', 'type'], ENTITY_TYPES.UNITNULL],
          '#fff',
          ['==', ['get', 'type'], ENTITY_TYPES.WALL],
          '#fff',
          ['==', ['get', 'type'], ENTITY_TYPES.PRIVATE_AREA],
          '#fff',
          ['==', ['get', 'type'], ENTITY_TYPES.FLOOR],
          '#fff',
          '#A3A3A3'
        ],
        'line-width': [
          'case',
          ['==', ['get', 'nullOutline'], true],
          0,
          ['==', ['get', 'type'], ENTITY_TYPES.MALL],
          3,
          ['==', ['get', 'type'], ENTITY_TYPES.UNIT],
          3,
          ['==', ['get', 'type'], ENTITY_TYPES.UNITNULL],
          3,
          ['==', ['get', 'type'], ENTITY_TYPES.WALL],
          3,
          ['==', ['get', 'type'], ENTITY_TYPES.PRIVATE_AREA],
          3,
          1
        ]
      },
      layout: {
        'line-sort-key': ['to-number', ['get', 'priority']]
      },
      filter: ['==', ['geometry-type'], 'Polygon'],
      metadata: {
        base_filter: ['==', ['geometry-type'], 'Polygon']
      }
    })

    if (!mall) {
      createLayer('floorplan_polygon-point', map.value, {
        type: 'symbol',
        source: 'floorplan_polygon',
        filter: ['==', ['geometry-type'], 'Point'],
        metadata: {
          base_filter: ['==', ['geometry-type'], 'Point']
        },
        layout: {
          'icon-image': ['get', 'category'],
          'icon-allow-overlap': true,
          'text-variable-anchor': ['left', 'right'],
          'text-justify': 'auto',
          'text-field': ['case', ['==', ['get', 'display_name'], true], ['get', 'subtitle'], ''],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-anchor': 'center',
          'text-offset': [1, 0],
          'text-allow-overlap': false,
          'text-size': 12
        }
      })
      createLayer('floorplan_names-layer', map.value, {
        source: 'floorplan_names',
        type: 'symbol',
        layout: {
          'text-variable-anchor': ['left', 'right'],
          'text-justify': 'auto',
          'text-field': ['get', 'subtitle'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-anchor': 'center',
          'text-allow-overlap': false,
          'text-size': 12
        },
        paint: {
          'text-color': '#616161'
        }
      })
    }

    createLayer('floorplan_polygon-extrusion', map.value, {
      type: 'fill-extrusion',
      source: 'floorplan_polygon',
      paint: {
        // Get the `fill-extrusion-color` from the source `color` property.
        'fill-extrusion-color': '#FFF',

        // Get `fill-extrusion-height` from the source `height` property.
        'fill-extrusion-height': 10,

        // Get `fill-extrusion-base` from the source `base_height` property.
        'fill-extrusion-base': 0,

        // Make extrusions slightly opaque to see through indoor walls.
        'fill-extrusion-opacity': 0.5
      },
      filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'type'], ENTITY_TYPES.WALL]],
      metadata: {
        base_filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'type'], ENTITY_TYPES.WALL]]
      }
    })

    if (!mall) {
      setLevelFilter(layersExcept(), map.value!, selectedLevel.value)
    } else {
      setLevelFilter(layersExcept(['floorplan_polygon-point', 'floorplan_names-layer']), map.value!, selectedLevel.value)
    }
  }

  // Reset floorplan data and clear all the ongoing setIntervals when user did not do any action for specified time.
  // Do not start new intervals again!
  const resetMapToDefault = () => {
    resetUI()
    recenterMapLocal(centerEntity.value?.level)
    onSearch('')
    setActiveCategory(defaultCategory) // set default selected category "All categories"
    // mapTimeout.value = setTimeout(resetMapToDefault, Number(route.query.autorefresh) * 1000)

    clearInterval(currentCountDownInterval.value)
    clearTimeout(mapTimeout.value)
    currentCountDown.value = null
    // currentCountDownInterval.value = setInterval(reduceCountDown, 1000)
  }

  // Note: ../florplan?autorefresh=10 (means refresh every 10 sec)
  const resetMapTimeout = () => {
    if (route.query.autorefresh) {
      clearTimeout(mapTimeout.value)
      mapTimeout.value = setTimeout(resetMapToDefault, Number(route.query.autorefresh) * 1000)

      clearInterval(currentCountDownInterval.value)
      currentCountDown.value = Number(route.query.autorefresh)
      currentCountDownInterval.value = setInterval(reduceCountDown, 1000)
    }
  }

  const reduceCountDown = () => {
    currentCountDown.value -= 1
  }

  const recenterMapLocal = (level: string | null | undefined) => {
    setFloorLevel(level)

    if (entitiesTree.value.length) {
      mapRecenter((entitiesTree.value[0].geom.coordinates as number[][][])[0])
    }
  }

  // unhighlight highlighted node from map
  const unhighlightProperty = () => {
    checkedNodeInTree.value = null
    // this.pointSelected = null
  }

  const onSearch = (value: string) => {
    categoryUnitSearch.value = value // update search input value based on user input

    if (value === '') {
      currentSearch.value = {}
      searchUpdated.value++
    } else {
      resetMapTimeout()
      currentSearch.value = {}
      const searchedUnits = unitsToSearch.value.search("'" + value).map((result: any) => result.item)

      searchedUnits.forEach((unit: any) => {
        if (currentSearch.value && !currentSearch.value[unit.category]) {
          currentSearch.value[unit.category] = []
        }
        if (currentSearch.value) {
          currentSearch.value[unit.category].push(unit.value)
        }
        searchUpdated.value += 1
      })

      if (Object.keys(currentSearch.value).length === 0) {
        currentSearch.value = null // null if nothing was found, we show info message for the user.
      }
    }
  }

  const mapLoaded = () => {
    map.value!.on('styleimagemissing', addMissingIconToMap)
    map.value!.on('click', 'floorplan_polygon-fill', highlightClickedFeatureInTree)
    const customControlPickerBar = new CustomMapControl({
      id: ['levelPicker'],
      class: 'levelPicker'
    }) as mapboxgl.Control
    map.value!.addControl(customControlPickerBar, 'bottom-left')

    const customRecenterButton = new CustomMapControl({
      id: ['recenterButton'],
      class: 'recenterButton'
    }) as mapboxgl.Control
    map.value!.addControl(customRecenterButton, 'bottom-right')

    // TODO: this could be simplified and .getCompanyCategories() wont be needed
    sidebarData.value = categoriesUnit.value
    sidebarData.value.forEach(category => {
      category.units = []
      category.entity = []
    })

    const unitsForSearching: any[] = []
    entitiesFlatList.value.forEach((entity: Entity) => {
      if (entity.unit) {
        sidebarData.value.forEach((category: CategoryUnit) => {
          if (entity.unit?.company?.company_category_id === category.id) {
            entity.unit.use_tenant_icon = entity.attributes?.use_tenant_icon
            entity.unit.tenant_icon = entity?.icon

            // assign level to unit
            if (entity.unit.level === null) {
              entity.unit.level = entity.level
            }

            category.units.push(entity.unit)
            category.entity.push(entity)
            unitsForSearching.push({
              value: entity.unit.company.store_name,
              category: category.company_category
            })
          }
        })
      }
    })

    unitsToSearch.value = new Fuse(unitsForSearching, {
      keys: ['value'],
      useExtendedSearch: true,
      getFn: (obj: any, path: any) => {
        return normalizeSync(Fuse.config.getFn(obj, path) as string)
      }
    })

    addFeaturesToMap(true)
    appStore.toggleLoading(false)

    recenterMapLocal(centerEntity.value?.level ? centerEntity.value.level : existingLevels.value[0])
    setActiveCategory(defaultCategory) // set default selected category "All categories"
  }

  const checkToUnhighlightProperty = (e: any) => {
    // if (this.pointSelected) {
    //   const foundElement = e?.originalEvent?.path?.find(element => element.id === ('markerId-' + this.pointSelected))
    //   if (!foundElement) {
    //     this.pointSelected = null
    //   }
    // }
    if (
      map.value!.queryRenderedFeatures(e.point, {
        layers: ['floorplan_polygon-fill', 'floorplan_polygon-outline']
      }).length === 0
    ) {
      unhighlightProperty()
      closeUnitDetailsPopup()
    }
  }

  const getCenter = () => {
    return [17.1077, 48.1486]
  }

  const getEntityCenter = () => {
    if (route.query.entity) {
      centerEntity.value = entitiesFlatList.value.find((entity: any) => String(entity.id) === route.query.entity)
    } else {
      centerEntity.value = undefined
    }
  }

  const initMarkers = () => {
    // remove all map-markers
    mapMarkers.forEach((marker: any) => {
      markers = []
      marker.remove()
    })

    featurePointsTexts.value
      .filter((point: featureData) => point.properties.hasCompany)
      .filter((points: any) => points.properties.level === selectedLevel.value)
      ?.forEach((marker: { geometry: any; id: number; properties: Entity }) => {
        const svgMarker = renderMarker(marker)
        const placeholder = document.createElement('div')
        placeholder.innerHTML = svgMarker
        const el = placeholder.firstChild as HTMLElement

        const newMarker = {
          object: el?.nextSibling,
          id: marker.id,
          category_id: marker.properties.unit?.company.company_category_id,
          coordinates: marker.geometry.coordinates
        }

        // show map-markers only for filteredCategory
        const showMarkerForCategory =
          filteredCategory.value?.id === newMarker.category_id || filteredCategory.value?.company_category === defaultCategory
        if (showMarkerForCategory) {
          const mapMarker = new mapboxgl.Marker(el?.nextSibling as HTMLElement, {
            offset: [-10, 0],
            anchor: 'left'
          })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map.value!)

          markers.push(newMarker)
          mapMarkers.push(mapMarker)
        }

        // const that = this
        // if (marker.properties.type === 'point' && marker.properties.category === 'bank') {
        //   // TMP disable klik
        //   document.getElementsByClassName('markerId-' + marker.id).forEach((element) => {
        //     if (marker.eventListener) {
        //       element.removeEventListener(marker.eventListener)
        //     }
        //     marker.eventListener = element.addEventListener('click', this.pointClicked(marker.id, that), false)
        //   })
        // }
      })
    updateMarkers()
  }

  const renderMarker = (marker: any) => {
    return `
          <div style="display: inline-flex;">
            <div>
              <div id="marker-${marker.id}" class="map-marker" style="transform-origin: left">
                <img class="markerId-${marker.id}" id="markerId-${marker.id}" style="width: 20px; height: 20px; place-self: center; margin-right: 2px" src="${marker.properties.icon}" />
                <div class="markerId-${marker.id}" id="markerId-${marker.id}" style="font-size: 10px; place-self: center; display: inline-flex;">${marker.properties.subtitle}</div>
              </div>
            </div>
          </div>
      `
  }

  const updateMarkers = () => {
    const zoom = map.value!.getZoom()
    const hiddenMarkersSet = new Set()

    if (zoom < 20) {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i]

        for (let j = i + 1; j < markers.length; j++) {
          const comperingMarker = markers[j]

          if (marker.id !== comperingMarker.id && !hiddenMarkersSet.has(comperingMarker.id) && !hiddenMarkersSet.has(marker.id)) {
            if (isCollide(marker.object.children[0].children[0], comperingMarker.object.children[0].children[0])) {
              if (checkedNodeInTree.value !== null) {
                if (checkedNodeInTree.value.id === marker.id) {
                  hiddenMarkersSet.add(comperingMarker.id)
                } else {
                  hiddenMarkersSet.add(marker.id)
                }
              } else {
                hiddenMarkersSet.add(comperingMarker.id)
              }
            }
          }
        }
      }
    }

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i]
      const id = marker.id

      if (!hiddenMarkersSet.has(id)) {
        marker.object.children[0].children[0].children[1].style.visibility = 'inherit'
      } else {
        marker.object.children[0].children[0].children[1].style.visibility = 'hidden'
      }

      const scalePercent = 1 + (zoom - 17.5) * 0.5
      marker.object.children[0].children[0].style.transform = `scale(${scalePercent})`
    }
  }

  const updateMarkersThrottled = throttle(updateMarkers, 250)

  const isCollide = (a: HTMLElement, b: HTMLElement) => {
    const aRect = a.getBoundingClientRect()
    const bRect = b.getBoundingClientRect()

    return !(
      aRect.top + aRect.height < bRect.top ||
      aRect.top > bRect.top + bRect.height ||
      aRect.left + aRect.width < bRect.left ||
      aRect.left > bRect.left + bRect.width
    )
  }

  const activateMarkerAnimation = (id: any) => {
    const marker = markers.find((marker: any) => marker.id === id)
    if (marker) {
      const markerDiv = marker.object.children[0].children[0]
      const markerText = markerDiv.querySelector('div')
      const markerImage = markerDiv.querySelector('img')
      const markerStylerImage = styler(markerImage)
      const markerStylerText = styler(markerText)
      const markerStylerDiv = styler(marker.object.children[0])
      markerDiv.style.transformOrigin = 'center'
      animate({
        from: 0,
        to: -((markerDiv.clientWidth / 2 + 3 - markerText.clientWidth / 2) * 2),
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerText.set('translateX', x)
      } as any)
      animate({
        from: 0,
        to: -(markerDiv.clientWidth / 2 + 10),
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerDiv.set('translateX', x)
      } as any)
      animate({
        from: 0,
        to: 30,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (y: any) => markerStylerText.set('translateY', y)
      } as any)

      animate({
        from: 20,
        to: 60,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerImage.set('width', x)
      } as any)
      animate({
        from: 20,
        to: 60,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerImage.set('height', x)
      } as any)
      animate({
        from: 0,
        to: markerDiv.clientWidth / 2 - 10,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerImage.set('translateX', x)
      } as any)
      animate({
        from: 0,
        to: -5,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerImage.set('translateY', x)
      } as any)
      setTimeout(() => {
        updateMarkers()
      }, 200)
    }
  }

  const deactivateMarkerAnimation = (id: any) => {
    const marker = markers.find((marker: any) => marker.id === id)
    if (marker) {
      const markerDiv = marker.object.children[0].children[0]
      const markerText = markerDiv.querySelector('div')
      const markerImage = markerDiv.querySelector('img')
      const markerStylerImage = styler(markerImage)
      const markerStylerText = styler(markerText)
      const markerStylerDiv = styler(marker.object.children[0])
      // marker.object.children[0].style.transform = 'null'
      markerDiv.style.transformOrigin = 'left'
      animate({
        from: -((markerDiv.clientWidth / 2 + 3 - markerText.clientWidth / 2) * 2),
        to: 0,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backIn,
        onUpdate: (x: any) => markerStylerText?.set('translateX', x)
      } as any)
      animate({
        from: -(markerDiv.clientWidth / 2),
        to: 0,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backOut,
        onUpdate: (x: any) => markerStylerDiv.set('translateX', x)
      } as any)
      animate({
        from: 30,
        to: 0,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backIn,
        onUpdate: (y: any) => markerStylerText?.set('translateY', y)
      } as any)
      animate({
        from: 60,
        to: 20,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backIn,
        onUpdate: (x: any) => markerStylerImage?.set('width', x)
      } as any)
      animate({
        from: 60,
        to: 20,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backIn,
        onUpdate: (x: any) => markerStylerImage?.set('height', x)
      } as any)
      animate({
        from: 0,
        to: 0,
        ease: backIn,
        onUpdate: (x: any) => markerStylerImage?.set('translateX', x)
      })
      animate({
        from: -5,
        to: 0,
        velocity: 20,
        spring: 300,
        friction: 0.8,
        ease: backIn,
        onUpdate: (x: any) => markerStylerImage?.set('translateY', x)
      } as any)
      setTimeout(() => {
        updateMarkers()
      }, 200)
    }
  }

  const fetchProperties = async (forEditor: boolean, client: boolean, publicMap = false) => {
    entitiesTree.value = []
    featurePointsTexts.value = []
    featurePointsImages.value = []
    featuresList.value = []

    const response = await RestApi.getEntities({ format: 'tree', forEditor })
    serverTime.value = response.data.current_server_datetime
    entitiesTree.value = response.data.data
    entitiesFlatList.value = convertTreeToList(response.data.data[0])
    const haveFloor = entitiesFlatList.value.some((entity: Entity) => entity.type === 'floor')
    entitiesFlatList.value.forEach(async (entity: Entity) => {
      entity.subtitle = entity.unit?.company?.store_name ?? entity.subtitle ?? 'N/A'
      entity.priority = 0
      Object.keys(ENTITY_TYPES_SORT).forEach((entityType: string) => {
        if (entity.type === entityType) {
          entity.priority = ENTITY_TYPES_SORT[entityType as keyof typeof ENTITY_TYPES_SORT]
        }
      })
      if (entity.type === ENTITY_TYPES.POINT) {
        entity.display_name = entity.attributes?.display_name
      }
      featuresList.value.push(entityToGeoJson(entity))
      if (entity.type === ENTITY_TYPES.UNIT && !entity.unit && client) {
        entity.type = ENTITY_TYPES.UNITNULL
      }
      if (entity.type === ENTITY_TYPES.MALL && haveFloor) {
        entity.nullOutline = true
      }
      if (
        haveFloor
          ? [ENTITY_TYPES.UNIT].includes(entity.type)
          : [ENTITY_TYPES.UNIT, ENTITY_TYPES.MALL].includes(entity.type) && (publicMap ? entity.unit?.company !== null : true)
      ) {
        if (entity.unit?.company && !addedImagesIds.value.includes(entity.unit?.company?.id)) {
          featureImages.value.push({
            name: 'unit-image-' + entity.unit.company.id,
            url: entity.unit.company.logo_picture,
            id: entity.unit.id
          })
          addedImagesIds.value.push(entity.unit?.company?.id)
          entity.icon_name = 'unit-image-' + entity.unit?.company?.id
          entity.offset = [0, 2]
          featurePointsImages.value.push({
            id: entity.id,
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: polylabel(entity.geom.coordinates as number[][][]) as LngLatLike
            },
            properties: entity
          })
          // this.createUnitImages(this.map, this.featureImages)
        } else if (entity.unit?.company) {
          entity.icon_name = 'unit-image-' + entity.unit?.company?.id
          entity.offset = [0, 2]
          featurePointsImages.value.push({
            id: entity.id,
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: polylabel(entity.geom.coordinates as number[][][]) as LngLatLike
            },
            properties: entity
          })
        } else {
          entity.offset = [0, 0]
        }
        if (entity.unit?.company?.id) {
          entity.hasCompany = true
        }
        let iconLocal = await returnCompanyCategoryIcon(entity)
        if (entity.attributes?.use_tenant_icon && entity?.category) {
          iconLocal = new URL(`/src/assets/mapicons/simplaq-${entity.category}.svg`, import.meta.url).href
          entity.icon = iconLocal
        }
        featurePointsTexts.value.push({
          id: entity.id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates:
              entity.geom.type === 'Polygon' ? (polylabel(entity.geom.coordinates as number[][][]) as LngLatLike) : entity.geom.coordinates
          },
          properties: { ...entity, icon: iconLocal }
        })
      } else if (entity.type === ENTITY_TYPES.POINT && entity.category && publicMap) {
        entity.hasCompany = true
        entity.subtitlePopup = entity.subtitle
        if (!entity.attributes?.display_name) {
          entity.subtitle = ''
        }

        featurePointsTexts.value.push({
          id: entity.id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates:
              entity.geom.type === 'Polygon' ? (polylabel(entity.geom.coordinates as number[][][]) as LngLatLike) : entity.geom.coordinates
          },
          properties: {
            ...entity,
            icon: new URL(`/src/assets/mapicons/simplaq-${entity.category}.svg`, import.meta.url).href
          }
        })
      }
    })
    findExistingLevels()
  }

  const convertTreeToList = (root: Entity) => {
    const stack = []
    const array: Entity[] = []
    const hashMap = {}

    stack.push(root)

    while (stack.length !== 0 && stack[0] !== undefined) {
      const node: Entity | undefined = stack.pop()
      if (node) {
        if (!node.children) {
          visitNode(node, hashMap, array)
        } else {
          for (let i: number = node.children.length - 1; i >= 0; i--) {
            stack.push(node.children[i])
          }
          visitNode(node, hashMap, array)
        }
      }
    }

    return array
  }

  const visitNode = (node: Entity, hashMap: any, array: Entity[]) => {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true
      array.push(node)
    }
  }

  const entityToGeoJson = (property: Entity) => {
    return {
      id: property.id,
      type: 'Feature',
      geometry: {
        type: property.geom.type,
        coordinates: property.geom.coordinates
      },
      properties: property
    }
  }

  const returnCompanyCategoryIcon = async (entity: Entity) => {
    // const name = this.categoriesUnit.find(category => category.id === entity?.unit?.company?.company_category_id)?.company_category
    if (entity?.unit?.company?.company_category_id === 15) {
      return new URL(`/src/assets/mapicons/simplaq-grocery.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 14) {
      return new URL(`/src/assets/mapicons/occupants/jewellery.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 13) {
      return new URL(`/src/assets/mapicons/occupants/electronics.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 11) {
      return new URL(`/src/assets/mapicons/occupants/kids-activities.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 10) {
      return new URL(`/src/assets/mapicons/simplaq-entertainment-area.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 9) {
      return new URL(`/src/assets/mapicons/occupants/pharmacy.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 8) {
      return new URL(`/src/assets/mapicons/occupants/book-shop.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 7) {
      return new URL(`/src/assets/mapicons/occupants/home-decor.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 6) {
      return new URL(`/src/assets/mapicons/occupants/fast-food.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 5) {
      return new URL(`/src/assets/mapicons/occupants/clothing.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 4) {
      return new URL(`/src/assets/mapicons/occupants/shoes.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 3) {
      return new URL(`/src/assets/mapicons/occupants/outdoor-sports-shop.svg`, import.meta.url).href
    }
    if (entity?.unit?.company?.company_category_id === 2) {
      return new URL(`/src/assets/mapicons/simplaq-convenience-stores.svg`, import.meta.url).href
    } else {
      return new URL(`/src/assets/mapicons/simplaq-convenience-stores.svg`, import.meta.url).href
    }
  }

  const findExistingLevels = () => {
    existingLevels.value = Array.from(
      new Set(
        entitiesFlatList.value.filter((item: Entity) => typeof item.level === 'string').map((entity: Entity) => entity.level as string)
      )
    )
    existingLevels.value.sort(function (a: any, b: any) {
      return a - b
    })
  }

  const mapRecenter = (coordinates: any) => {
    if (markerForSelected.value) {
      markerForSelected.value.remove()
    }
    // map.value?.setCenter(coordinates[0])
    // return
    // if (this.pointSelected) {
    //   this.pointSelected = null
    // }
    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    for (const coord of coordinates) {
      bounds.extend(coord)
    }

    map.value!.fitBounds(bounds, {
      padding: 50,
      duration: 0.001
    })

    setTimeout(() => map.value!.setMaxBounds(map.value!.getBounds()), 300)
  }

  const createLayer = (layerName: string, map: any, layerProperties: any) => {
    if (!map.getLayer(layerName)) {
      map.addLayer({
        ...{
          id: layerName,
          type: 'fill'
        },
        ...layerProperties
      })
    }
  }
  const createOrUpdateSource = (sourceName: string, map: any, features: featureData[]) => {
    if (map.getSource(sourceName)) {
      map.getSource(sourceName).setData({
        type: 'FeatureCollection',
        features
      })
    } else {
      map.addSource(sourceName, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      })
    }
  }

  const setLevelFilter = (layers: string[], map: mapboxgl.Map, level: string) => {
    layers.forEach((layer: string) => {
      const mapLayer: any = findLayerById(layer)
      if (layer === 'floorplan_polygon-point') {
        const filter = ['all', ['all', ['==', ['geometry-type'], 'Point'], ['==', ['get', 'level'], level]]]
        if (mapLayer?.metadata && mapLayer?.metadata.base_filter) {
          filter.push(mapLayer?.metadata.base_filter)
        }
        map.setFilter(layer, filter)
      } else {
        const filter = ['all', ['any', ['==', ['get', 'level'], level], ['==', ['get', 'level'], null]]]
        if (mapLayer?.metadata && mapLayer?.metadata.base_filter) {
          filter.push(mapLayer?.metadata.base_filter)
        }

        map.setFilter(layer, filter)
      }
    })
  }

  const findLayerById = (id: any) => {
    return map.value?.getStyle().layers.find((l: any) => l.id === id)
  }

  const layersExcept = (except: any = []) => {
    return layerNames.filter((x: any) => !except.includes(x))
  }

  const addMissingIconToMap = async (e: any) => {
    if (!e.id.includes('unit-image') && !iconsLoaded.includes(e.id)) {
      const img = document.createElement('img')
      img.src = new URL(`/src/assets/mapicons/simplaq-${e.id}.svg`, import.meta.url).href
      img.setAttribute('height', '24')
      img.setAttribute('width', '24')
      img.onload = () => map.value?.addImage(e.id, img)
      iconsLoaded.push(e.id)
    }
  }

  const setFloorLevel = (level: string | null | undefined) => {
    if (level && selectedLevel.value !== level) {
      selectedLevel.value = level

      // Note: moved here from watcher()
      markerForSelected.value ? markerForSelected.value.remove() : (() => {})()

      // change level
      setLevelFilter(['floorplan_polygon-fill', 'floorplan_polygon-outline'], map.value!, selectedLevel.value) // 'floorplan_images_names-layer'

      if (centerEntity.value !== null) {
        if (centerEntity.value?.level !== String(level) && centerEntityMarker.value) {
          centerEntityMarker.value.remove()
          centerEntityMarker.value = null
        } else if (centerEntity.value?.level === String(level) && centerEntityMarker.value === null) {
          centerEntityMarker.value = new mapboxgl.Marker(getYourMapPositionMarkerHtml(), {
            anchor: 'bottom',
            scale: 3
          })
            .setLngLat(
              Array.isArray((centerEntity.value.geom.coordinates as number[][][])[0])
                ? (polylabel(centerEntity.value.geom.coordinates as number[][][]) as LngLatLike)
                : (centerEntity.value.geom.coordinates as LngLatLike)
            )
            .addTo(map.value!)
        }
      }
    }
  }

  const closeUnitDetailsPopup = () => {
    isUnitDetailsPopupOpened.value = false // close unit details popup
  }

  const getYourMapPositionMarkerHtml = () => {
    const placeholder = document.createElement('div')
    placeholder.innerHTML = `<div class="marker-your-position"><div class="marker-your-position-text-wrapper"><div class="marker-your-position-text-inner">${t(
      'floorplanYouMarker'
    )}</div></div></div>`

    return placeholder.firstChild as HTMLElement
  }

  // get all sidebar categories, first category is 'Al places' which includes all units from all categories
  const getAllCategories = computed(() => {
    return [
      {
        company_category: defaultCategory,
        units: sidebarData.value.map(categoryUnit => categoryUnit.units).flat(1),
        description: null,
        entity: [],
        id: 0,
        parent_id: null,
        sort: 0,
        subcategory: null,
        translations: [
          {
            company_category: t('floorplanAllCategories'),
            company_category_id: 0,
            description: null,
            id: 0,
            locale: currentLang.value
          }
        ]
      },
      // filter only categories which has units for selected lvel
      ...sidebarData.value.filter(category => category.units.some(unit => unit.level === selectedLevel.value))
    ]
  })

  // filter units for right panel, based on selected category
  const setActiveCategory = (categoryName: string, levelBeforeChange?: string) => {
    // filter units only when new category is not the same as the current active category
    const categoryChanged = filteredCategory.value?.company_category !== categoryName
    const levelHasChanged = !!levelBeforeChange && levelBeforeChange !== selectedLevel.value

    if (categoryChanged) {
      filteredCategory.value = getAllCategories.value.find(categoryUnit => categoryUnit.company_category === categoryName)
      initMarkers() // re-init map markers after category change
      scrollToActiveCategory()
    } else if (levelHasChanged) {
      initMarkers() // re-init map markers after level changed
      scrollToActiveCategory()
    }
  }

  const scrollToActiveCategory = () => {
    nextTick(() => {
      const activeButton = document.querySelector('.floorplan-category-button.active-black')
      if (activeButton) {
        const categoriesWrapper = floorplanCategoriesRef.value as HTMLElement
        const buttonRect = activeButton.getBoundingClientRect()
        const categoriesWrapperRect = categoriesWrapper.getBoundingClientRect()

        if (buttonRect.left < categoriesWrapperRect.left || buttonRect.right > categoriesWrapperRect.right) {
          categoriesWrapper.scrollTo({
            left: buttonRect.left - categoriesWrapperRect.left + categoriesWrapper.scrollLeft,
            behavior: 'smooth'
          })
        }
      }
    })
  }

  const setLayerVisibility = (layers: string[], map: mapboxgl.Map, visibility: string) => {
    layers.forEach(layer => {
      map.setLayoutProperty(layer, 'visibility', visibility)
    })
  }

  return {
    activateMarkerAnimation,
    addFeaturesToMap,
    addMissingIconToMap,
    appStore,
    categoriesUnit,
    categoryUnitSearch,
    centerEntity,
    centerEntityMarker,
    checkedNodeInTree,
    checkToUnhighlightProperty,
    closeUnitDetailsPopup,
    createLayer,
    createOrUpdateSource,
    currentCountDown,
    currentLang,
    currentSearch,
    deactivateMarkerAnimation,
    defaultCategory,
    entitiesFlatList,
    entitiesTree,
    existingLevels,
    featurePointsTexts,
    featuresList,
    fetchProperties,
    floorplanNewsRef,
    floorplanEventsRef,
    floorplanRewardsRef,
    floorplanCategoriesRef,
    getAllCategories,
    getCenter,
    getEntityCenter,
    getYourMapPositionMarkerHtml,
    hideKeyboard,
    highlightClickedFeatureInTree,
    initMarkers,
    isUnitDetailsPopupOpened,
    layersExcept,
    map,
    mapLoaded,
    mapRecenter,
    markerForSelected,
    onSearch,
    polylabel,
    recenterMapLocal,
    resetMapTimeout,
    resetMapToDefault,
    resetUI,
    scrollToActiveCategory,
    searchUpdated,
    selectedLevel,
    setActiveCategory,
    setFloorLevel,
    setLayerVisibility,
    setLevelFilter,
    serverTime,
    showKeyboard,
    sidebarData,
    t,
    updateMarkersThrottled,
    unitsToSearch,
    filteredCategory
  }
}
