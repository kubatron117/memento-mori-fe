import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WeeksInLifeView from '@/views/WeeksInLifeView.vue'
import Login from '@/views/account/Login.vue'
import Registration from '@/views/account/Registration.vue'
import AccountVerification from '@/views/account/AccountVerification.vue'

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
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/verify-account',
      name: 'AccountVerification',
      component: AccountVerification,
    },
  ],
})

export default router
