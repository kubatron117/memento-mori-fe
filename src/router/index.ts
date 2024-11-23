import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WeeksInLifeView from '@/views/WeeksInLifeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/weeks-in-life',
      name: 'weeks-in-life',
      component: WeeksInLifeView,
    },
  ],
})

export default router
