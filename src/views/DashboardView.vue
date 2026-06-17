<script setup>
import { ref, onMounted } from 'vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import { Modal } from 'bootstrap'

const usuarios = ref([])
const habitacionSeleccionada = ref({ id: '', name: '', price: '' })
const API_URL = 'https://6a11afb93e35d0f37ee38a9f.mockapi.io/products'

const cargarDashboard = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }
    usuarios.value = await response.json()
  } catch (error) {
    console.error('Error al cargar el dashboard:', error)
  }
}

const obtenerImagenHabitacion = (nombre) => {
  if (!nombre) return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&q=80'
  const nombreLimpio = nombre.toLowerCase()
  if (nombreLimpio.includes('suit') || nombreLimpio.includes('suite') || nombreLimpio.includes('presidencial')) {
    return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'
  }
  if (nombreLimpio.includes('doble') || nombreLimpio.includes('twin')) {
    return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80'
  }
  if (nombreLimpio.includes('deluxe') || nombreLimpio.includes('lujo')) {
    return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80'
  }
  if (nombreLimpio.includes('individual') || nombreLimpio.includes('single')) {
    return 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'
  }
  return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80'
}

const obtenerServicios = (nombre) => {
  const nombreLimpio = (nombre || '').toLowerCase()
  if (nombreLimpio.includes('suit') || nombreLimpio.includes('suite') || nombreLimpio.includes('presidencial')) {
    return ['Jacuzzi Privado', 'Cama King Size', 'Minibar Premium', 'Wi-Fi 6 Ultra', 'Servicio a la habitación 24h', 'Vista Panorámica']
  }
  if (nombreLimpio.includes('deluxe') || nombreLimpio.includes('lujo')) {
    return ['Cama Queen Size', 'Balcón Privado', 'Smart TV 55"', 'Cafetera Espresso', 'Wi-Fi Gratis']
  }
  return ['Cama Confortable', 'Baño Privado', 'Aire Acondicionado', 'Wi-Fi Gratis', 'TV por Cable']
}

const abrirDetalles = (habitacion) => {
  habitacionSeleccionada.value = habitacion
  const modalElement = document.getElementById('detallesModal')
  if (modalElement) {
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)
    modalInstance.show()
  }
}

const cerrarModal = () => {
  const modalElement = document.getElementById('detallesModal')
  if (modalElement) {
    const modalInstance = Modal.getInstance(modalElement)
    if (modalInstance) modalInstance.hide()
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>

<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarComponent />

    <div class="flex-grow-1 d-flex flex-column">
      <NavbarComponent :seccion="'Panel de Control'" />

      <div class="container my-5 px-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold text-dark m-0">TARJETAS DE HABITACIONES DISPONIBLES</h2>
          <span class="badge bg-dark px-3 py-2 rounded-pill fw-bold">
            {{ usuarios.length }} Disponibles
          </span>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="item in usuarios" :key="item.id" class="col">
            <div class="card h-100 border-0 shadow-sm text-center p-0 rounded-4 overflow-hidden bg-white">
              
              <div class="position-relative" style="height: 160px;">
                <img 
                  :src="obtenerImagenHabitacion(item.name)" 
                  alt="Foto de la Habitación"
                  class="w-100 h-100"
                  style="object-fit: cover;"
                />
                <span class="position-absolute top-0 start-0 bg-warning text-white fw-bold m-3 px-2 py-1 small rounded-pill shadow-sm">
                  #{{ item.id }}
                </span>
              </div>

              <div class="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <h5 class="fw-bold text-dark mb-1 text-truncate">{{ item.name }}</h5>
                  <p class="text-success fw-bold mb-3">Tarifa: ${{ item.price }}</p>
                </div>
                
                <button @click="abrirDetalles(item)" class="btn btn-warning text-white fw-bold w-100 rounded-pill py-2 shadow-sm mt-2">
                  Gestionar
                </button>
              </div>

            </div>
          </div>
        </div>

        <div v-if="usuarios.length === 0" class="text-center py-5">
          <p class="text-muted fs-5">No hay registros de habitaciones para mostrar.</p>
        </div>
      </div>
    </div>

    <div class="modal fade" id="detallesModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          <div class="position-relative" style="height: 220px;">
            <img 
              :src="obtenerImagenHabitacion(habitacionSeleccionada.name)" 
              class="w-100 h-100" 
              style="object-fit: cover;" 
              alt="Preview"
            />
            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 p-2 bg-dark rounded-circle" @click="cerrarModal" aria-label="Close" style="--bs-bg-opacity: 0.5;"></button>
            <div class="position-absolute bottom-0 start-0 w-100 bg-gradient p-3 text-white d-flex align-items-end justify-content-between" style="background: linear-gradient(transparent, rgba(0,0,0,0.8));">
              <h4 class="fw-bold m-0 text-truncate" style="max-width: 70%;">{{ habitacionSeleccionada.name || 'Cargando...' }}</h4>
              <span class="badge bg-warning text-white px-3 py-2 rounded-pill fw-bold fs-6 shadow-sm">
                ${{ habitacionSeleccionada.price || '0' }} / Noche
              </span>
            </div>
          </div>

          <div class="modal-body p-4 bg-white">
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="p-3 bg-light rounded-3 border-start border-warning border-3">
                  <small class="text-uppercase text-secondary fw-bold d-block">Identificador</small>
                  <span class="fw-bold text-dark fs-5">Código #{{ habitacionSeleccionada.id || 'N/A' }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-light rounded-3 border-start border-success border-3">
                  <small class="text-uppercase text-secondary fw-bold d-block">Estado Actual</small>
                  <span class="fw-bold text-success fs-5">
                    <i class="bi bi-patch-check-fill me-1"></i> Disponible
                  </span>
                </div>
              </div>
            </div>

            <h6 class="fw-bold text-dark text-uppercase mb-3">
              <i class="bi bi-stars text-warning me-2"></i>Servicios y Comodidades Incluidas
            </h6>
            
            <div class="row row-cols-2 g-2">
              <div v-for="(servicio, index) in obtenerServicios(habitacionSeleccionada.name)" :key="index" class="col">
                <div class="d-flex align-items-center text-secondary small py-1">
                  <i class="bi bi-check2 text-success me-2 fw-bold"></i>
                  <span>{{ servicio }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-top">
              <button type="button" class="btn btn-warning text-white fw-bold rounded-pill w-100 py-2 shadow-sm" @click="cerrarModal">
                Volver al Panel de Control
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>