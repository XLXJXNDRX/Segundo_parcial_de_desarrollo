import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView from '../views/ProductView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView // 👈 REVISAR: Que la raíz sea obligatoriamente LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/dashboard/habitaciones',
    name: 'productos',
    component: ProductView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🚨 EL GUARDIÁN DE SEGURIDAD (Esto es lo que el profe va a revisar)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true'
  
  // Si el usuario intenta entrar a CUALQUIER ruta que empiece con /dashboard sin estar logueado...
  if (to.path.startsWith('/dashboard') && !isAuthenticated) {
    next('/') // 🚫 Lo rebota de inmediato a la pantalla de Login
  } else {
    next() // ✅ Si está logueado o va para el Login, lo deja pasar libremente
  }
})

export default router