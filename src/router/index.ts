import { createRouter, createWebHistory } from 'vue-router'
import { Routes } from '@/imports'

import DefaultLayout from '@/layouts/default/Default.vue'

const routes = [
  { path: '/', redirect: Routes.FLORPLAN },
  {
    path: Routes.FLORPLAN,
    component: DefaultLayout,
    children: [
      {
        path: Routes.FLORPLAN,
        name: 'floorplan',
        component: () => import('@/views/FloorplanView.vue')
      }
    ]
  },
  {
    path: Routes.NEWS_AND_EVENTS,
    component: DefaultLayout,
    children: [
      {
        path: Routes.NEWS_AND_EVENTS,
        name: 'newsAndEvents',
        component: () => import('@/views/NewsAndEventsView.vue')
      }
    ]
  },
  {
    path: Routes.SHOP,
    component: DefaultLayout,
    children: [
      {
        path: Routes.SHOP,
        name: 'shop',
        component: () => import('@/views/ShopView.vue')
      }
    ],
  },
  {
    path: Routes.DINE,
    component: DefaultLayout,
    children: [
      {
        path: Routes.DINE,
        name: 'dine',
        component: () => import('@/views/DineView.vue')
      }
    ],
  },
  {
    path: Routes.ENTERTAIN,
    component: DefaultLayout,
    children: [
      {
        path: Routes.ENTERTAIN,
        name: 'entertain',
        component: () => import('@/views/EntertainView.vue')
      }
    ],
  },
  {
    path: Routes.SERVICES,
    component: DefaultLayout,
    children: [
      {
        path: Routes.SERVICES,
        name: 'services',
        component: () => import('@/views/ServicesView.vue')
      }
    ],
  },
  {
    path: Routes.PARKING,
    component: DefaultLayout,
    children: [
      {
        path: Routes.PARKING,
        name: 'parking',
        component: () => import('@/views/ParkingView.vue')
      }
    ],
  },
  {
    path: Routes.AMENITIES,
    component: DefaultLayout,
    children: [
      {
        path: Routes.AMENITIES,
        name: 'amenities',
        component: () => import('@/views/AmenitiesView.vue')
      }
    ],
  },
  {
    path: Routes.REWARDS,
    component: DefaultLayout,
    children: [
      {
        path: Routes.REWARDS,
        name: 'rewards',
        component: () => import('@/views/RewardsView.vue')
      }
    ],
  },
  {
    path: Routes.INFORMATION,
    component: DefaultLayout,
    children: [
      {
        path: Routes.INFORMATION,
        name: 'information',
        component: () => import('@/views/InformationView.vue')
      }
    ],
  },
  {
    path: Routes.BUSES,
    component: DefaultLayout,
    children: [
      {
        path: Routes.BUSES,
        name: 'buses',
        component: () => import('@/views/BusesView.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
