import { Routes } from '@/imports'

type MenuItem = {
  to: string
  name: string // Note: page name this is a translateable string shown in page-body-header area. It should be always defined in language files (sk/en/cs.json).
  ico: string
}

export const primaryMenu: MenuItem[] = [
  { to: Routes.FLORPLAN, ico: 'FloorplanIcon', name: 'floorplanMap' },
  { to: Routes.NEWS_AND_EVENTS, ico: 'MegaphoneIcon', name: 'newsAndEvents' },
  { to: Routes.SHOP, ico: 'ShopIcon', name: 'shop' },
  { to: Routes.DINE, ico: 'DineIcon', name: 'dine' },
  { to: Routes.ENTERTAIN, ico: 'TicketIcon', name: 'entertain' },
  { to: Routes.SERVICES, ico: 'ServicesIcon', name: 'services' },
  { to: Routes.PARKING, ico: 'CarIcon', name: 'parking' },
  { to: Routes.AMENITIES, ico: 'AmenitiesIcon', name: 'amenities' },
  { to: Routes.REWARDS, ico: 'RewardsIcon', name: 'rewards' },
  { to: Routes.INFORMATION, ico: 'InfoIcon', name: 'information' },
]
