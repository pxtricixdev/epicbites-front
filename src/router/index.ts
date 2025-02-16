import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/pages/HomePage.vue'),
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
        },
        {
          path: '/terminos',
          name: 'Terminos',
          component: () => import('@/pages/TerminosPage.vue'),
        },
        {
          path: '/politicas',
          name: 'Politicas',
          component: () => import('@/pages/PoliticasPage.vue'),
        }
      ],
    },
  ],
});
export default router
