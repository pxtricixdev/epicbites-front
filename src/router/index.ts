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
          path: '/registro',
          name: 'registro',
          component: () => import('@/pages/RegisterPage.vue'),
        },
        {
          path: '/terminos',
          name: 'terminos',
          component: () => import('@/pages/TerminosPage.vue'),
        },
        {
          path: '/politicas',
          name: 'politicas',
          component: () => import('@/pages/PoliticasPage.vue'),
        },
        {
          path: '/sobre-nosotros',
          name: 'sobre-nosotros',
          component: () => import('@/pages/AboutUsPage.vue'),
        },
        {
          path: '/recetas/:category?',
          name: 'recetas',
          component: () => import('@/pages/RecipesPage.vue'),
        },
        {
          path: '/receta/:id',
          name: 'detalle-receta',
          component: () => import('@/pages/RecipeDetailPage.vue'),
        },
        {
          path: '/recetas/publicar-receta',
          name: 'publicar-receta',
          component: () => import('@/pages/PostRecipePage.vue'),
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('@/pages/PerfilPage.vue'),
        },
        {
          path: '/weekly-menu',
          name: 'weekly-menu',
          component: () => import('@/pages/WeeklyMenuPage.vue'),
        }
      ],
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/AdminLoginPage.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/AdminPage.vue'),
    },
  ],
})
export default router
