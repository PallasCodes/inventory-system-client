import { RouteRecordRaw } from 'vue-router'
import inventoryRoutes from './inventoryRoutes'
import employeeRoutes from './employee-routes'
import borrowingRoutes from './borrowings-routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../modules/main/layouts/MainLayout.vue'),
    redirect: 'home',
    children: [...inventoryRoutes, ...employeeRoutes, ...borrowingRoutes],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../modules/auth/pages/LoginPage.vue'),
    meta: {
      noAuth: true,
      pageTitle: 'Iniciar sesión',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../modules/main/pages/ErrorNotFound.vue'),
    meta: {
      pageTitle: 'Página no encontrada',
    },
  },
]

export default routes
