export enum ShopCategories {
  CLOTHES='clothes',
  SHOES='shoes',
  FOR_MEN='for_men',
  FOR_WOMEN='for_women',
  DECOR='decor',
  SPORT='sport',
  SPORT_EQUPMENT='sport_equipment',
  ELECTRONICS='electronics'
}

export interface shopArr {
  id: number
  logo: string
  title: string
  category: string
  to: string
}
