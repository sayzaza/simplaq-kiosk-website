import { createApp } from 'vue'

// 3rd party dependencies
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

// Languages
import en from '@/locales/en.json'
import sk from '@/locales/sk.json'
import cs from '@/locales/cs.json'

// Fonts
import { loadFonts } from '@/plugins/webfontloader'

// Pinia
import { createPinia } from 'pinia'

// Router
import router from '@/router/index'

// Styles
import 'vuetify/styles'
import '@/styles/index.scss'

// Import global components
import App from './App.vue'
// Nav
import Header from '@/components/ui/Header/Header.vue'
import NavigationMenu from '@/components/ui/nav/NavigationMenu.vue'
import NavigationFooter from '@/components/ui/nav/NavigationFooter.vue'

import LangSwitcher from '@/components/ui/langSwitcher/LangSwitcher.vue'

import GridSystem from '@/components/ui/grid-system/GridSystem.vue'
import PageSkeleton from '@/components/ui/skeleton/PageSkeleton.vue'
import Iconbase from '@/components/icons/Iconbase.vue'
import Buttonbase from '@/components/ui/button/Buttonbase.vue'
// modals
import ModalLayout from '@/components/modals/modalLayout.vue'
import ModalBtn from '@/components/modals/modalBtn.vue'
import ModalInformation from '@/components/modals/modalInformation.vue'
import ModalGallery from '@/components/modals/modalGallery.vue'
import ModalHeadInfo from '@/components/modals/ModalHeadInfo.vue'
import ModalOpening from '@/components/modals/ModalOpening.vue'
//end  modals
import FilterBtns from '@/components/ui/filterBtns/filterBtns.vue'
import FloorFilterBtns from '@/components/ui/filterBtns/floorFilter.vue'
import CategorySidebar from '@/components/ui/sidebar/categorySidebar/categorySidebar.vue'
// Loaders
import SpinnerLoader from '@/components/ui/loaders/SpinnerLoader.vue'
import SkeletonLoader from "@/components/ui/loaders/SkeletonLoader.vue"
// End loaders
import Progress from '@/components/ui/progress/Progress.vue'

const i18n: any = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  allowComposition: true,
  messages: {
    en,
    sk,
    cs
  },
  fallbackWarn: false,
  silentFallbackWarn: true,
  missingWarn: true
})

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6'
        }
      }
    }
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  }
})

const app = createApp(App)

// Load app fonts
loadFonts()

// Use global components
app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(vuetify)
  .component('GridSystem', GridSystem)
  .component('PageSkeleton', PageSkeleton)
  .component('Iconbase', Iconbase)
  .component('Buttonbase', Buttonbase)
  .component('ModalLayout', ModalLayout)
  .component('ModalBtn', ModalBtn)
  .component('ModalInformation', ModalInformation)
  .component('ModalGallery', ModalGallery)
  .component('FilterBtns', FilterBtns)
  .component('ModalHeadInfo', ModalHeadInfo)
  .component('FloorFilterBtns', FloorFilterBtns)
  .component('CategorySidebar', CategorySidebar)
  .component('Progress', Progress)
  .component('ModalOpening', ModalOpening)
  .component('NavigationMenu', NavigationMenu)
  .component('NavigationFooter', NavigationFooter)
  .component('Header', Header)
  .component('LangSwitcher', LangSwitcher)
  .component('SpinnerLoader', SpinnerLoader)
  .component('SkeletonLoader', SkeletonLoader)
  
  .mount('#app')

export { app }
