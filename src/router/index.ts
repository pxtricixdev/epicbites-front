import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import UsersPage from '@/pages/UsersPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/pages/HomePage.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/UsersPage.vue'),
        },
      ],
    },
  ],
});
export default router
