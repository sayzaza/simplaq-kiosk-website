import { defineStore } from 'pinia'
export interface appStoreTypes {
  loading: boolean
  defaultLanguages: Array<{ value: string; title: string }>
  lang: { value: string; title: string }
}

export const useAppStore = defineStore('app', {
  state: (): appStoreTypes => {
    return {
      loading: false,
      defaultLanguages: [
        {
          value: 'en',
          title: 'English'
        },
        {
          value: 'sk',
          title: 'Slovak'
        },
        {
          value: 'cs',
          title: 'Czech'
        }
      ],
      lang: {
        value: 'en',
        title: 'English'
      }
    }
  },
  actions: {
    toggleLoading(value: boolean) {
      this.loading = value
    },
    changeLanguage(value: { value: string; title: string }) {
      this.lang = value
    }
  }
})
