import { LngLatLike } from 'mapbox-gl'

export interface CategoryUnit {
  company_category: string // all places, bank, clothes ...
  description: string | null
  entity: Entity[]
  id: number
  parent_id: number | null
  sort: number
  subcategory: any
  translations: {
    id: number
    company_category_id: number
    locale: string
    company_category: string
    description: string | null
  }[]
  units: Unit[]
}

export interface Company {
  id: number
  title: string
  store_name: string
  vat: string | null
  stop_words: string[] | null
  company_type_id: number
  mall_id: number
  company_category_id: number
  open_hours: OpenHours[]
  non_stop: boolean
  temporary_closed: boolean
  logo_picture: string
  big_logo: string | null
  email: string | null
  website: string | null
  facebook: string | null
  instagram: string | null
  zip_code: string | null
  country_id: number
  city: string | null
  address: string | null
  map_link: string | null
  loyalty_status: number
  status: ItemState
  company_sub_category_id: number
  organization_id: number | null
  phones: string[] | null
  shop_photo_file_id: number
  floor: number | null
  description: string | null
  events: CompanyEvent[] | null
  news: CompanyNews[] | null
  company_shop_photos: CompanyShopPhoto[]
  company_category: CategoryUnit
  company_type: {
    id: number
    company_type: string
  }
  mall: {
    id: number
    title: string
    description: string | null
    zip_code: string | null
    country_id: number | null
    city: string | null
    address: string | null
  }
  country: {
    id: number
    country: string
    code_short: string
    code_full: string
    code_number: string
  }
  products: any[]
  receipts: any[]
  rewards: Reward[]
  tiers: any[]
  company_identification: any
  settings: any[]
  organization: any
  receipt_templates: any[]
  company_reviews: CompanyReview[]
  translations: CompanyTranslations[]
}

export interface ProfilePhoto {
  bucket_title: string
  created_at: string
  file_extension: string
  file_name: string
  file_size: number
  id: number
  is_public: boolean
  public_url: string
  storage_file_path: string
  updated_at: string
}

export interface Reward {
  archived: number
  classHandler: any
  company_id: number
  date_from: string
  date_to: string
  description: string | null
  id: number
  limit: number
  limit_left: number
  loyalty_program_id: number
  name: string
  params: any
  photo_file: ProfilePhoto
  photo_link: string | null
  photo_file_id: number | null
  points_cost: number
  published: number
  sort: number
  status: ItemState
  sync_status: number
  tag_ids: any[]
  tags: any[]
  termless: boolean
  title: string | null
  translations: any[]
  type: any
  unlimit: boolean
  unlimited_amount: boolean
  uuid: string
}

export interface OpenHours {
  from: string
  to: string
}

export interface CompanyTranslations {
  id: number
  locale: string
  floor: string
  description: string
  company_id: number
}

export interface CompanyNewsTranslations {
  article: string
  id: number
  locale: string
  news_id: number
  photo_file_id: number
  photo_file: PhotoFile
  title_picture: string | null
  title: string
}

export interface CompanyEventTranslations {
  description: string
  event_id: number
  id: number
  locale: string
  picture_link: string | null
  title: string
}

export interface CompanyNews {
  article: string
  company_id: number
  created_at: string
  id: number
  photo_file_id: number
  publish_at: string
  status: ItemState
  tag_ids: any[]
  tags: any[]
  title_picture: string | null
  title: string
  translations: CompanyNewsTranslations[]
  unpublish_at: string | null
  updated_at: string
}

export interface CompanyEvent {
  company_id: number
  created_at: string
  // description: string
  finish: string
  id: number
  picture_link: string | null
  publish_at: string
  published: number | null
  start: string
  status: ItemState
  tag_ids: any[]
  tags: any[]
  title: string
  translations: CompanyEventTranslations[]
  unpublish_at: string | null
  updated_at: string
}

export interface FloorplanCustomer {
  id: number
  firestore_customer_id: number
  gender_id: any
  first_name: string
  last_name: string
  email: string
  birthday: any
  profile_photo: any
  profile_photo_file: ProfilePhoto
  profile_photo_file_id: number | null
  phone: any
  status: ItemState
  uuid: any
  sync_status: any
  address: any
  car_number: any
  address_coordinates: any
  selected_app_language: any
  selected_malls: any
  created_at: string
  updated_at: string
  tag_ids: any[]
  tags: any[]
}

export interface PhotoFile {
  id: number
  created_at: string
  updated_at: string
  bucket_title: string
  file_name: string
  file_size: number
  file_extension: string
  public_url: string
  storage_file_path: string
  is_public: boolean
}

export interface CompanyShopPhoto {
  id: number
  company_id: number
  photo_file_id: number
  description: string | null
  photo_file: PhotoFile
}

export interface CompanyReview {
  company_id: number
  created_at: string
  customer_id: number
  customer: FloorplanCustomer
  id: number
  rating: number
  review: string
  status: string
  updated_at: string
}

export interface Unit {
  area: any
  company: Company
  created_at: string
  id: number
  level: string | null | undefined
  meta: any
  name: string
  price_m2: number | null
  tenant_icon: string | null
  updated_at: string
  use_tenant_icon: boolean
}

export interface Entity {
  attributes: any
  category: string | null
  children: Entity[] | null
  created_at: string
  display_name: string | null
  geom: { type: string; coordinates: LngLatLike | number[][][] }
  hasCompany: boolean
  icon_name: string | null
  icon: string | null
  id: number
  level: string | null | undefined
  nullOutline: boolean
  offset: number[]
  priority: number
  subtitle: string | null
  subtitlePopup: string | null
  tree_path: string
  type: string
  unit: Unit | null
  updated_at: string
}

export interface featureData {
  id: number
  type: string
  geometry: {
    type: string
    coordinates: LngLatLike | number[][][]
  }
  properties: Entity
}

export enum ItemState {
  Archived = 0,
  Published = 1,
  Draft = 2,
  Scheduled = 3,
  InApproval = 4,
  Approved = 5,
  Rejected = 6
}

export const ENTITY_TYPES = {
  MALL: 'mall',
  UNIT: 'unit',
  UNITNULL: 'unitnull',
  FLOOR: 'floor',
  POINT: 'point',
  WALL: 'wall',
  PRIVATE_AREA: 'private-area',
  GRASS_AREA: 'grass-area',
  LINE: 'line'
}

export const ENTITY_TYPES_SORT = {
  'mall': 0,
  'unit': 5,
  'unitnull': 6,
  'floor': 1,
  'point': 7,
  'wall': 2,
  'private-area': 3,
  'grass-area': 4,
  'line': 8
}

export const mapCategories = [
  'airport',
  'amusement-park',
  'aquarium',
  'arcade',
  'art-gallery',
  'auditorium',
  'auto-parts',
  'baccarat',
  'bagage-claim',
  'bagage-claim-int',
  'bakery',
  'bank',
  'bank-eur',
  'bar',
  'barber',
  'beach',
  'beach-1',
  'bingo',
  'blackjack',
  'boating',
  'bowling',
  'brewery',
  'bricks',
  'camping',
  'car-rental',
  'car-rental-2',
  'car-rental-drop-off',
  'casino',
  'castle',
  'checking',
  'cinema',
  'city-hall',
  'city-hall-japan',
  'classroom',
  'college',
  'column',
  'concession',
  'concrete',
  'conferenceroom',
  'convenience-stores',
  'craps',
  'cubicle',
  'defibrillator',
  'dinning',
  'doctors',
  'drywall',
  'duty-free',
  'eating-drinking',
  'elevator',
  'elevator',
  'entertainment-area',
  'entertainment-area-game',
  'entertainment-area-music',
  'entertainment-area-perfomance',
  'entertainment-area-play',
  'escalator',
  'escalator-down',
  'escalator-up',
  'exhibit',
  'exhibition',
  'fashion',
  'fast-food',
  'fire-department',
  'fire-department-japan',
  'firstaid',
  'fitness',
  'fitness-room',
  'food-service',
  'footbridge',
  'gambling',
  'gate-area',
  'gate-area-holding',
  'glass',
  'golf',
  'grocery',
  'guns',
  'heliport',
  'hospital',
  'hospital-japan',
  'hotel',
  'hundle-room',
  'immigration',
  'immigration-schengen',
  'information',
  'karaoke',
  'keno',
  'kitchen',
  'laboratory',
  'laundry',
  'libriary',
  'lobby',
  'lounge',
  'mahjong',
  'mail-room',
  'medal-game',
  'military',
  'military-japan',
  'mini-bacaarat',
  'mothersroom',
  'motorcycle',
  'mountain',
  'movie-theater',
  'moving-walkway',
  'museum',
  'music',
  'non-public',
  'off-track-betting',
  'office',
  'open',
  'pachinko',
  'paid-area',
  'paigow',
  'park',
  'park-and-ride',
  'parking',
  'parking',
  'parking-bycycle',
  'parking-compact',
  'parking-ev',
  'parking-longterm',
  'parking-motorcycle',
  'parking-short-term',
  'parking-waiting-area',
  'parking.bicycle',
  'pharmacy',
  'phone',
  'planetarium',
  'platform',
  'platform-blue',
  'playground',
  'poker',
  'poker-let-it-ride',
  'poker-paigow',
  'poker-three-card',
  'poker-video',
  'police-department',
  'police-department-london',
  'post-office',
  'post-office-australia',
  'post-office-japan',
  'posts-security',
  'pre-security',
  'prefectural-office',
  'private',
  'private-lounge',
  'public-service',
  'radio-station',
  'ramp',
  'recompose-area',
  'recreation',
  'rental',
  'restroom-family',
  'restroom-female',
  'restroom-female-wheelchair',
  'restroom-male',
  'restroom-male-wheelchair',
  'restroom-transgender',
  'restroom-transgender-wheelchair',
  'restroom-unisex',
  'restroom-unisex-wheelchair',
  'restroom-wheelchair',
  'retail',
  'retail-department',
  'road',
  'room',
  'roulette',
  'rummy',
  'seating',
  'seating-grow',
  'security',
  'server-room',
  'service-area',
  'sevice-station',
  'shower',
  'shrines-japan',
  'sicbo',
  'skating',
  'skiing',
  'slotmachine',
  'slotmachine-highlimit',
  'smoke-area',
  'speciality-food',
  'stadium',
  'stairs',
  'stairs',
  'steps',
  'storage',
  'structure',
  'swimming-pool',
  'temples',
  'temples-japan',
  'tenis',
  'terrace',
  'theater',
  'ticketing',
  'toilets',
  'toll',
  'tour',
  'train',
  'train-japan',
  'train-london',
  'transportation',
  'unclosed-area',
  'unspecified',
  'vegetation',
  'vegetation-blue',
  'venue',
  'veterenarian',
  'waiting-room',
  'walk-way',
  'walk-way-island',
  'walkway-blue',
  'ward-office-japan',
  'winery',
  'wood'
]
