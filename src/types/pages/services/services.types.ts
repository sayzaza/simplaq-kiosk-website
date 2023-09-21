export enum ServicesCategories {
  MASSAGE = 'massage',
  SPA = 'spa',
  SPORT = 'sport',
  MUSEUMS = 'museums',
  BEAUTY = 'beauty'
}

export interface ServicesArr {
  id: number
  image: string
  logo: string
  logoTitle: string
  title: string 
  icon: string
  floor: string
  category: ServicesCategories  
}
