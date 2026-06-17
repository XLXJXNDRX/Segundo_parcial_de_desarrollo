<template>
  <div class="bg-dark text-white p-3 vh-100 position-sticky top-0 d-flex flex-column shadow" style="width: 260px;">
    <div class="text-center my-3 pb-3 border-bottom border-secondary">
      <i class="bi bi-building-fill text-warning fs-2"></i>
      <h5 class="fw-bold text-uppercase tracking-wider mt-2 mb-0 text-warning">Hotel Admin</h5>
    </div>

    <ul class="nav nav-pills flex-column mb-auto gap-2">
      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link text-white d-flex align-items-center py-2 px-3 rounded-3" active-class="active bg-warning text-dark fw-bold">
          <i class="bi bi-speedometer2 me-3 fs-5"></i> Panel de Control
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/dashboard/usuarios" class="nav-link text-white d-flex align-items-center py-2 px-3 rounded-3" active-class="active bg-warning text-dark fw-bold">
          <i class="bi bi-people-fill me-3 fs-5"></i> Usuarios (CRUD)
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/dashboard/habitaciones" class="nav-link text-white d-flex align-items-center py-2 px-3 rounded-3" active-class="active bg-warning text-dark fw-bold">
          <i class="bi bi-door-open me-3 fs-5"></i> Habitaciones (CRUD)
        </router-link>
      </li>
    </ul>

    <div class="pt-3 border-top border-secondary">
      <button @click="cerrarSesion" class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2">
        <i class="bi bi-box-arrow-right me-2"></i> Salir del sistema
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cerrarSesion = () => {
  localStorage.removeItem('user_authenticated') 
  router.push('/') 
}
</script>