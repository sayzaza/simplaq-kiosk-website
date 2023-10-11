export enum newsEventsCategory{
  NEWS='news',
  EVENTS='events',
}
interface Company {
  title: string,
}
export interface newsEventsArr {
  id: number,
  image: string
  logo: string
  logoTitle: string
  title: string
  description?: string
  article?: string
  picture_link?: string,
  company: Company,
  title_picture?: string,
  icon: string
  date: string
  action: string
  category: newsEventsCategory,
  created_at?: string,
  start?: string,
  publish_at?: string,
  finish? :string
}

export interface newsEvents {
  icon: string
  filter: string
}

export interface sidebar {
  id: number,
  image: string
}