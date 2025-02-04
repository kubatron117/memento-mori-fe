import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WeeksInLifeView from '@/views/WeeksInLifeView.vue'
import Login from '@/views/account/Login.vue'
import Registration from '@/views/account/Registration.vue'
import AccountVerification from '@/views/account/AccountVerification.vue'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import { useLoginStore } from '@/stores/loginStore'

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

router.beforeEach(async (to, from, next) => {
  const loginStore = useLoginStore();
  const isAuthenticated = await loginStore.checkAuthentication();


  const publicRoutes = ['login', 'registration', 'verify-account'];

  if (!isAuthenticated && !publicRoutes.includes(to.name as string)) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (isAuthenticated && publicRoutes.includes(to.name as string)) {
    next({ name: 'weeks-in-life' });
  }else {
    next();
  }
});

export default router
