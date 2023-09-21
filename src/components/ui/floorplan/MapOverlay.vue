<template>
  <div id="overlay">
    <el-popover v-model:visible="popoverVisible" placement="bottom" trigger="manual" width="386" @show="handlePopoverShow">
      <template #reference>
        <el-button @click="popoverVisible = !popoverVisible">
          <el-icon><DocumentCopy /></el-icon>
        </el-button>
      </template>
      <template #default>
        <el-upload
          ref="upload"
          action="#"
          :multiple="false"
          :limit="1"
          drag
          :auto-upload="false"
          list-type="picture"
          :file-list="fileList"
          :accept="'image/png, image/jpeg'"
          :on-change="handleAdd"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ t('floorplanBuilderDropFileHere') }} <em>{{ t('floorplanBuilderClickToUpload') }}</em>
          </div>
        </el-upload>
        <div v-if="overlayImageData" class="mt-2">
          <div>
            <span style="text-color: #606266; font-weight: 500; line-height: 19px; font-size: 14px">{{ t('floorplanBuilderScaleImage') }}</span>
            <el-slider v-model="overlayImageScale" :disabled="overlayImageLocked" :max="30" :step="0.01" show-input />
          </div>
          <div>
            <span style="text-color: #606266; font-weight: 500; line-height: 19px; font-size: 14px">{{ t('floorplanBuilderRotateImage') }}</span>
            <el-slider v-model="overlayRotation" :disabled="overlayImageLocked" :max="360" :step="0.1" show-input />
          </div>
          <div>
            <span style="text-color: #606266; font-weight: 500; line-height: 19px; font-size: 14px">{{ t('floorplanBuilderOpacityImage') }}</span>
            <el-slider v-model="overlayOpacity" :disabled="overlayImageLocked" :max="1" :step="0.01" show-input />
          </div>
          <div>
            <el-checkbox v-model="overlayImageLocked" @change="onOverlayImageLockedChanged">
              <span>{{ t('floorplanBuilderLockImage') }}</span>
            </el-checkbox>
          </div>

          <el-switch
            v-model="showOverlayImage"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="100"
            inactive-value="0"
            :active-text="t('floorplanBuilderShowOnMap')"
            @change="handleShowOverlayImage"
          >
          </el-switch>
          <hr class="mt-4 mb-1" />
          <div>
            <Buttonbase :name="t('floorplanBuilderApply')" :classname="`c-button--transparent-with-borders`" @click="applyImageConfig" />
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import Buttonbase from '@/components/ui/button/Buttonbase.vue'
import { ref, watch, onMounted, onBeforeUnmount, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['update:markers', 'overlayImage'])

const props = defineProps({
  map: {
    type: mapboxgl.Map,
    default: null
  },
  overlayPreset: {
    type: Object,
    default: null
  },
  markers: {
    type: Array<{ marker: mapboxgl.Marker }>,
    default: () => []
  }
})

const overlayImageData: Ref<any> = ref(null)
const overlayImageScale = ref(15)
const overlayRotation = ref(0)
const overlayOpacity = ref(0.5)
const overlayImageCoordinates: Ref<number[]> = ref([])
const overlayImageLocked = ref(false)
const overlayMarker: Ref<mapboxgl.Marker | null> = ref(null)
const overlayMarkerElement: Ref<HTMLImageElement | null> = ref(null)
const overlayImageName = ref('')
const popoverVisible = ref(false)
const fileList: Ref<Array<{ name: string; url: string }>> = ref([])
const showOverlayImage = ref(false)

// TODO: ideally we should get rid of those watchers if there will be time for that - it was just migrated like it is from old project ...
watch(
  () => overlayImageScale.value,
  () => {
    updateOverlayScale()
  }
)

watch(
  () => overlayRotation.value,
  () => {
    updateOverlayRotation()
  }
)

watch(
  () => overlayOpacity.value,
  () => {
    updateOverlayOpacity()
  }
)

onBeforeUnmount(() => {
  props.map.off('rotate', updateOverlayRotation)
  props.map.off('zoom', updateOverlayScale)
})

onMounted(() => {
  props.map.on('rotate', updateOverlayRotation)
  props.map.on('zoom', updateOverlayScale)
})

const handleAdd = (file: any) => {
  const uploadElement = document.getElementsByClassName('el-upload--picture')
  ;(uploadElement[0] as HTMLElement).style.display = 'none'
  overlayImageName.value = file.name
  createBase64Image(file.raw)
  addOverlayImage()
}

const handleExceed = () => {
  ElNotification({
    message: t('floorplanBuilderOverlayExceeded'),
    type: 'error'
  })
}

const handleRemove = () => {
  overlayImageData.value = null
  overlayImageCoordinates.value = []
  removeOverlayImage()
  const uploadElement = document.getElementsByClassName('el-upload--picture')
  ;(uploadElement[0] as HTMLElement).style.display = ''
}

const addOverlayImage = () => {
  if (!overlayImageData.value) {
    return
  }

  if (props.markers.length) {
    props.markers.forEach(m => m.marker.remove())
    emits('update:markers', [])
  }
  overlayMarkerElement.value = null
  overlayMarkerElement.value = document.createElement('img')
  overlayMarkerElement.value.src = overlayImageData.value
  const width = Math.pow(2, ((overlayImageScale.value - 15) * 100) / 100 - 5 + props.map.getZoom())
  overlayMarkerElement.value.style.width = width + 'px'
  overlayMarkerElement.value.style.opacity = '0.5'

  let coord = props.map.getCenter()
  if (overlayImageCoordinates.value.length > 0) {
    coord = overlayImageCoordinates.value as any
  } else {
    overlayImageCoordinates.value = coord.toArray()
  }

  overlayMarker.value = new mapboxgl.Marker({
    element: overlayMarkerElement.value,
    draggable: !overlayImageLocked.value
  })
    .setLngLat(coord)
    .addTo(props.map)
    .on('dragstart', () => {
      updateOverlayRotation()
    })
    .on('drag', () => {
      updateOverlayRotation()
    })
    .on('dragend', () => {
      if (overlayMarker.value) {
        overlayImageCoordinates.value = overlayMarker.value.getLngLat().toArray()
        updateOverlayRotation()
      }
    })

  emits('update:markers', [...props.markers, ...[{ marker: overlayMarker.value }]])
}

const createBase64Image = (fileObject: any) => {
  const reader = new FileReader()
  reader.onload = e => {
    overlayImageData.value = e.target?.result
  }
  reader.readAsDataURL(fileObject)
}

const removeOverlayImage = () => {
  if (!overlayMarker.value) {
    return
  }
  overlayMarker.value.remove()
  overlayMarker.value = null
}

const onOverlayImageLockedChanged = () => {
  if (overlayMarker.value) {
    overlayMarker.value.setDraggable(!overlayImageLocked.value)
    const uploadElement = document.getElementsByClassName('el-upload-list__item')[0] as HTMLElement | undefined
    if (overlayImageLocked.value) {
      props.map.dragRotate.disable()
      if (uploadElement) {
        uploadElement.style.background = '#F4F7FA'
        ;(uploadElement.childNodes[3] as HTMLElement).style.display = 'none'
      }
    } else {
      props.map.dragRotate.enable()
      if (uploadElement) {
        uploadElement.style.background = '#FFF'
        ;(uploadElement.childNodes[3] as HTMLElement).style.display = ''
      }
    }
  }
}
const updateOverlayRotation = () => {
  if (overlayMarker.value) {
    overlayMarker.value.setRotation(overlayRotation.value - props.map.getBearing())
  }
}
const updateOverlayOpacity = () => {
  if (overlayMarker.value) {
    overlayMarkerElement.value!.style.opacity = overlayOpacity.value.toString()
  }
}
const updateOverlayScale = () => {
  if (overlayMarker.value) {
    const el = overlayMarker.value.getElement()
    if (el) {
      const width = Math.pow(2, ((overlayImageScale.value - 15) * 100) / 100 - 5 + props.map.getZoom())
      el.style.width = width + 'px'
    }
  }
}
const applyImageConfig = () => {
  popoverVisible.value = false
  emits('overlayImage', {
    data: overlayImageData.value,
    image_name: overlayImageName.value,
    rotate: overlayRotation.value,
    scale: overlayImageScale.value,
    opacity: overlayOpacity.value,
    coordinates: overlayImageCoordinates.value,
    locked: overlayImageLocked.value
  })
}

const handlePopoverShow = () => {
  if (props.overlayPreset) {
    overlayImageData.value = props.overlayPreset.data
    overlayRotation.value = props.overlayPreset.rotate
    overlayImageScale.value = props.overlayPreset.scale
    overlayOpacity.value = props.overlayPreset.opacity
    overlayImageCoordinates.value = props.overlayPreset.coordinates
    overlayImageLocked.value = props.overlayPreset.locked
    overlayImageName.value = props.overlayPreset.name
    fileList.value = [
      {
        name: props.overlayPreset.image_name,
        url: props.overlayPreset.data
      }
    ]
  }
}

const handleShowOverlayImage = (value: string) => {
  if (parseInt(value)) {
    addOverlayImage()
    updateOverlayRotation()
    updateOverlayOpacity()
    updateOverlayScale()
  } else {
    removeOverlayImage()
  }
}
</script>
