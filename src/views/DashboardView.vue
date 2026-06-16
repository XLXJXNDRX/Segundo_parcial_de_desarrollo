<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarComponent />

    <div class="flex-grow-1 d-flex flex-column">
      <NavbarComponent :seccion="'Panel de Control - ' + nombreHotel" />

      <div class="container my-5 px-4">
        <div class="card p-5 shadow-sm border-0 rounded-4 bg-white mb-5 text-center">
          <div class="mb-3">
            <i class="bi bi-building shadow-sm bg-warning p-3 rounded-circle text-white fs-1"></i>
          </div>
          <h1 class="fw-bold text-dark mb-2">Panel de Control General</h1>
          <p class="text-muted fs-5 mb-0">Software de administración de inventarios, habitaciones y tarifas base de {{
            nombreHotel }}.</p>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold text-dark mb-0 text-uppercase tracking-wide">Muestreo de Acomodaciones Activas</h4>
          <span class="badge bg-dark px-3 py-2 fs-6 rounded-pill text-warning fw-bold shadow-sm">
            {{ habitaciones.length }} Habitaciones en Sistema
          </span>
        </div>
        <div class="row g-4 mt-2">
          <div v-for="habitacion in habitaciones" :key="habitacion.id" class="col-12 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm border-0 rounded-4 text-center p-3" style="background-color: #fffde7;">
              <div class="card-body">
                <i class="bi bi-door-closed fs-1 text-warning mb-2"></i>

                <h5 class="fw-bold text-dark mb-1">{{ habitacion.name }}</h5>

                <p class="text-muted small mb-3">Habitación Disponible</p>

                <h4 class="fw-bold text-success">${{ habitacion.price }}<</h4>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div v-for="(habitacion, index) in habitaciones" :key="index" class="col-md-4 col-sm-6">
            <ProductCardComponent :nombre="habitacion.titulo" :precio="Number(habitacion.precio)"
              :categoria="habitacion.sala"
              @ver-detalle="alertaDetalle(habitacion.titulo, habitacion.sala, habitacion.precio)" />
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nombreHotel = ref('Hotel Boutique')
const habitaciones = ref([])

const API_URL = 'https://6a11afb93e35d0f37ee38a9f.mockapi.io/products'

const cargarDashboard = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    habitaciones.value = data
  } catch (error) {
    console.error("Error al cargar datos en el dashboard:", error)
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>