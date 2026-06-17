import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView from '../views/ProductView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ReservasView from '../views/ReservasView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView 
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/dashboard/usuarios',
    name: 'usuarios',
    component: UsuariosView
  },
  {
    path: '/dashboard/habitaciones',
    name: 'productos',
    component: ProductView
  },
  {
    path: '/dashboard/reservas/:id/:nombre',
    name: 'reservas',
    component: ReservasView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true'
  if (to.path.startsWith('/dashboard') && !isAuthenticated) {
    next('/') 
  } else {
    next() 
  }
})

export default router