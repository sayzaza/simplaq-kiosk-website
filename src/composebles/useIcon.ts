import { defineAsyncComponent } from 'vue'
export const useIcon = () => {
  const getIconComponent = (iconPath: string): string => {
    if (iconPath) {
      return defineAsyncComponent(() => import(`@/components/icons/${iconPath}.vue`))
    }

    return ''
  }

  return { getIconComponent }
}
