export enum DineCategories {
  HAMBURGER = 'hamburger',
  CHEESEBURGER = 'cheeseburger',
  BEEF = 'beef',
  PIZZA = 'pizza',
  NOODLE = 'noodle',
  SANDWICH = 'sandwich',
  DONUTS = 'donuts',
  MILK_SHAKES = 'milk_shake',
  SOFT_DRINKS = 'soft_drink'
}
export interface DineArr {  
  id: number
  image: string
  logo: string
  logoTitle: string
  title: string
  type: string
  icon: string
  floor: string
  name: string
  category: DineCategories,
}
