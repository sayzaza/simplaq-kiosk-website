export enum EntertainCategories {
  FOR_FAMILY='for_family',
  FOR_KIDS='for_kids',
  GAMING='gaming',
  MUSEUMS='museums',
}


export interface EntertainArr {
  id: number
  image: string
  title: string
  icon: string
  floor: string
  category: EntertainCategories
}
