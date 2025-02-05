import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WeeksInLifeView from '@/views/WeeksInLifeView.vue'
import Login from '@/views/account/Login.vue'
import Registration from '@/views/account/Registration.vue'
import AccountVerification from '@/views/account/AccountVerification.vue'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import { useLoginStore } from '@/stores/loginStore'
import ResetPasswordRequest from '@/views/account/ResetPasswordRequest.vue'
import ResetPassword from '@/views/account/ResetPassword.vue'

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
      name: 'registration',
      component: Registration,
    },
    {
      path: '/verify-account',
      name: 'verify-account',
      component: AccountVerification,
    },
    {
      path: '/reset-password-request',
      name: 'reset-password-request',
      component: ResetPasswordRequest,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const loginStore = useLoginStore();
  const isAuthenticated = await loginStore.checkAuthentication();


  const publicRoutes = ['login', 'registration', 'verify-account', 'reset-password-request', 'reset-password'];

  if (!isAuthenticated && !publicRoutes.includes(to.name as string)) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (isAuthenticated && publicRoutes.includes(to.name as string)) {
    next({ name: 'weeks-in-life' });
  }else {
    next();
  }
});

export default router
