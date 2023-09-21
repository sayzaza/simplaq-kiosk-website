import { ShopCategories } from '@/types/pages/shop/shop.types'
import { DineCategories } from '@/types/pages/dine/dine.types'
import { EntertainCategories } from '@/types/pages/entertain/entertain.types'
import { ServicesCategories } from '@/types/pages/services/services.types'

export type CategorySidebarTypes = {
  val: string
  ico: string
  name: string
  places: number
  vertical?: boolean
}

export const shopSidebarCategories: CategorySidebarTypes[] = [
  { val: 'all', ico: 'ShopIcon', name: 'all', places: 32 },
  { val: ShopCategories.CLOTHES, ico: 'ShirtIcon', name: ShopCategories.CLOTHES, places: 32 },
  { val: ShopCategories.SHOES, ico: 'ShoesIcon', name: ShopCategories.SHOES, places: 32 },
  { val: ShopCategories.FOR_MEN, ico: 'ForManIcon', name: ShopCategories.FOR_MEN, places: 32 },
  { val: ShopCategories.FOR_WOMEN, ico: 'ForWomenIcon', name: ShopCategories.FOR_WOMEN, places: 32 },
  { val: ShopCategories.DECOR, ico: 'DecorIcon', name: ShopCategories.DECOR, places: 32 },
  { val: ShopCategories.SPORT, ico: 'SportIcon', name: ShopCategories.SPORT, places: 32 },
  { val: ShopCategories.SPORT_EQUPMENT, ico: 'SportEqupmentIcon', name: ShopCategories.SPORT_EQUPMENT, places: 32 },
  { val: ShopCategories.ELECTRONICS, ico: 'electronicsIcon', name: ShopCategories.ELECTRONICS, places: 32 }
]
export const dineSidebarCategories: CategorySidebarTypes[] = [
  { val: 'all', ico: 'DineIcon', name: 'all', places: 32 },
  { val: DineCategories.HAMBURGER, ico: 'HamburgerIcon', name: DineCategories.HAMBURGER, places: 25 },
  { val: DineCategories.CHEESEBURGER, ico: 'CheeseBurgerIcon', name: DineCategories.CHEESEBURGER, places: 25 },
  { val: DineCategories.BEEF, ico: 'BeefIcon', name: DineCategories.BEEF, places: 25 },
  { val: DineCategories.PIZZA, ico: 'PizzaIcon', name: DineCategories.PIZZA, places: 25 },
  { val: DineCategories.NOODLE, ico: 'NoodleIcon', name: DineCategories.NOODLE, places: 25 },
  { val: DineCategories.SANDWICH, ico: 'SandwichIcon', name: DineCategories.SANDWICH, places: 25 },
  { val: DineCategories.DONUTS, ico: 'DonutsIcon', name: DineCategories.DONUTS, places: 25 },
  { val: DineCategories.MILK_SHAKES, ico: 'MilkShakeIcon', name: DineCategories.MILK_SHAKES, places: 25 },
  { val: DineCategories.SOFT_DRINKS, ico: 'SoftDrinkIcon', name: DineCategories.SOFT_DRINKS, places: 25 }
]
export const entertainSidebarCategories: CategorySidebarTypes[] = [
  { val: 'all', ico: 'TicketIcon', name: 'all', places: 32 },
  { val: EntertainCategories.FOR_FAMILY, ico: 'MasksIcon', name: EntertainCategories.FOR_FAMILY, places: 122 },
  { val: EntertainCategories.FOR_KIDS, ico: 'DolphinIcon', name: EntertainCategories.FOR_KIDS, places: 32 },
  { val: EntertainCategories.GAMING, ico: 'BowlingIcon', name: EntertainCategories.GAMING, places: 25 },
  { val: EntertainCategories.MUSEUMS, ico: 'ArtIcon', name: EntertainCategories.MUSEUMS, places: 25 }
]
export const servicesSidebarCategories: CategorySidebarTypes[] = [
  { val: 'all', ico: 'ServicesIcon', name: 'all', places: 32 },
  { val: ServicesCategories.MASSAGE, ico: 'MassageIcon', name: ServicesCategories.MASSAGE, places: 122 },
  { val: ServicesCategories.SPA, ico: 'SpaIcon', name: ServicesCategories.SPA, places: 323 },
  { val: ServicesCategories.SPORT, ico: 'TennisIcon', name: ServicesCategories.SPORT, places: 2 },
  { val: ServicesCategories.BEAUTY, ico: 'BeautyIcon', name: ServicesCategories.BEAUTY, places: 32 }
]
