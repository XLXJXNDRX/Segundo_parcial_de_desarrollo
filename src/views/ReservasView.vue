<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import SidebarComponent from '../components/SidebarComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()

const habitacionId = route.params.id
const habitacionNombre = route.params.nombre || 'Habitación'

const reservas = ref([])
const editando = ref(false)
const modoEliminar = ref(false)
const alertaMensaje = ref('')
const alertaTipo = ref('success')
const cargando = ref(false)

const form = ref({
  id: null,
  huespedNombre: '',
  email: '',
  telefono: '',
  fechaEntrada: '',
  fechaSalida: '',
  numeroPersonas: 1
})

const API_URL_RESERVAS = 'https://6a11afb93e35d0f37ee38a9f.mockapi.io/reservas'

const mostrarAlertaTemporizada = (mensaje, tipo = 'success') => {
  alertaMensaje.value = mensaje
  alertaTipo.value = tipo
  setTimeout(() => {
    alertaMensaje.value = ''
  }, 3000)
}

const obtenerReservas = async () => {
  cargando.value = true
  try {
    // Intentar de la API
    try {
      const response = await fetch(`${API_URL_RESERVAS}?habitacionId=${habitacionId}`)
      if (response.ok) {
        const data = await response.json()
        reservas.value = data
        return
      }
    } catch (error) {
      console.warn('API no disponible, usando localStorage', error)
    }
    
    // Fallback a localStorage
    const reservasGuardadas = localStorage.getItem(`reservas_habitacion_${habitacionId}`)
    reservas.value = reservasGuardadas ? JSON.parse(reservasGuardadas) : []
  } catch (error) {
    console.error('Error al cargar reservas:', error)
    mostrarAlertaTemporizada('Error al cargar las reservas', 'danger')
  } finally {
    cargando.value = false
  }
}

const abrirModalCrear = async () => {
  editando.value = false
  modoEliminar.value = false
  form.value = {
    id: null,
    huespedNombre: '',
    email: '',
    telefono: '',
    fechaEntrada: '',
    fechaSalida: '',
    numeroPersonas: 1
  }
  await nextTick()
  const modalElement = document.getElementById('reservaModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const abrirModalEditar = async (item) => {
  editando.value = true
  modoEliminar.value = false
  form.value = { ...item }
  await nextTick()
  const modalElement = document.getElementById('reservaModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const abrirModalEliminar = async (item) => {
  editando.value = false
  modoEliminar.value = true
  form.value = { ...item }
  await nextTick()
  const modalElement = document.getElementById('reservaModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const guardarReserva = async () => {
  if (!form.value.huespedNombre || !form.value.email || !form.value.fechaEntrada || !form.value.fechaSalida) {
    mostrarAlertaTemporizada('Todos los campos son requeridos', 'warning')
    return
  }

  // Validar que fecha de salida sea posterior a fecha de entrada
  if (new Date(form.value.fechaSalida) <= new Date(form.value.fechaEntrada)) {
    mostrarAlertaTemporizada('La fecha de salida debe ser posterior a la de entrada', 'warning')
    return
  }

  try {
    if (editando.value) {
      // Editar reserva existente
      const index = reservas.value.findIndex(r => r.id === form.value.id)
      if (index !== -1) {
        reservas.value[index] = { ...form.value }
        mostrarAlertaTemporizada('Reserva modificada exitosamente', 'success')
      }
    } else {
      // Crear nueva reserva
      const nuevaReserva = {
        ...form.value,
        id: Date.now().toString(),
        habitacionId: habitacionId,
        habitacionNombre: habitacionNombre,
        fechaCreacion: new Date().toISOString()
      }
      reservas.value.push(nuevaReserva)
      mostrarAlertaTemporizada('Reserva creada exitosamente', 'success')
    }

    // Guardar en localStorage
    localStorage.setItem(`reservas_habitacion_${habitacionId}`, JSON.stringify(reservas.value))
    cerrarModalManualmente()
  } catch (error) {
    console.error(error)
    mostrarAlertaTemporizada('Error al procesar la reserva', 'danger')
  }
}

const ejecutarEliminacion = async () => {
  try {
    reservas.value = reservas.value.filter(r => r.id !== form.value.id)
    localStorage.setItem(`reservas_habitacion_${habitacionId}`, JSON.stringify(reservas.value))
    mostrarAlertaTemporizada('Reserva cancelada correctamente', 'danger')
    cerrarModalManualmente()
  } catch (error) {
    console.error(error)
    mostrarAlertaTemporizada('Error al cancelar la reserva', 'danger')
  }
}

const cerrarModalManualmente = () => {
  const modalElement = document.getElementById('reservaModal')
  if (modalElement) {
    const botonActivo = document.activeElement
    if (botonActivo && modalElement.contains(botonActivo)) {
      botonActivo.blur()
    }
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)
    modalInstance.hide()
  }
  setTimeout(() => {
    modoEliminar.value = false
    editando.value = false
  }, 300)
}

const calcularNoches = (entrada, salida) => {
  if (!entrada || !salida) return 0
  const fechaEntrada = new Date(entrada)
  const fechaSalida = new Date(salida)
  const diferencia = fechaSalida - fechaEntrada
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
}

const volver = () => {
  router.push('/dashboard')
}

onMounted(() => {
  obtenerReservas()
})
</script>

<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarComponent />

    <div class="flex-grow-1 d-flex flex-column">
      <NavbarComponent :seccion="'Gestión de Reservas - ' + habitacionNombre" />

      <div class="container my-5 px-4">
        
        <div v-if="alertaMensaje" :class="`alert alert-${alertaTipo} alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow-lg`" role="alert" style="z-index: 2000; min-width: 300px;">
          <i class="bi bi-info-circle-fill me-2"></i>
          <strong>{{ alertaMensaje }}</strong>
          <button type="button" class="btn-close" @click="alertaMensaje = ''" aria-label="Close"></button>
        </div>

        <div class="card p-4 shadow-sm border-0 rounded-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-dark mb-0">
              <i class="bi bi-calendar-check me-2 text-info"></i>Reservas de {{ habitacionNombre }}
            </h3>
            <div class="d-flex gap-2">
              <button @click="abrirModalCrear" class="btn btn-info fw-bold text-white shadow-sm px-4 rounded-pill">
                <i class="bi bi-plus-circle-fill me-2"></i>Nueva Reserva
              </button>
              <button @click="volver" class="btn btn-secondary fw-bold text-white shadow-sm px-4 rounded-pill">
                <i class="bi bi-arrow-left me-2"></i>Volver
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-info">
                <tr>
                  <th>
                    <i class="bi bi-person-fill me-2"></i>Huésped
                  </th>
                  <th>
                    <i class="bi bi-envelope-fill me-2"></i>Email
                  </th>
                  <th>
                    <i class="bi bi-telephone-fill me-2"></i>Teléfono
                  </th>
                  <th>
                    <i class="bi bi-calendar-range me-2"></i>Entrada
                  </th>
                  <th>
                    <i class="bi bi-calendar-range me-2"></i>Salida
                  </th>
                  <th>
                    <i class="bi bi-moon me-2"></i>Noches
                  </th>
                  <th>
                    <i class="bi bi-people-fill me-2"></i>Personas
                  </th>
                  <th class="text-center">
                    <i class="bi bi-tools me-2"></i>Operaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in reservas" :key="item.id">
                  <td class="fw-semibold text-dark">{{ item.huespedNombre }}</td>
                  <td class="text-muted">{{ item.email }}</td>
                  <td class="text-muted">{{ item.telefono }}</td>
                  <td class="text-muted fw-mono">{{ item.fechaEntrada }}</td>
                  <td class="text-muted fw-mono">{{ item.fechaSalida }}</td>
                  <td class="fw-bold text-info">{{ calcularNoches(item.fechaEntrada, item.fechaSalida) }}</td>
                  <td class="text-center fw-bold">{{ item.numeroPersonas }}</td>
                  <td class="text-center">
                    <button @click="abrirModalEditar(item)" class="btn btn-outline-info btn-sm me-2 rounded-pill px-3" title="Editar reserva">
                      <i class="bi bi-pencil-fill me-1"></i>Editar
                    </button>
                    <button @click="abrirModalEliminar(item)" class="btn btn-outline-danger btn-sm rounded-pill px-3" title="Cancelar reserva">
                      <i class="bi bi-trash-fill me-1"></i>Cancelar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="reservas.length === 0" class="text-center py-5">
            <i class="bi bi-inbox text-muted fs-1 mb-3 d-block"></i>
            <p class="text-muted fs-5">No hay reservas registradas para esta habitación.</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal para crear/editar/eliminar reserva -->
    <div class="modal fade" id="reservaModal" tabindex="-1" aria-labelledby="reservaModalLabel" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          
          <div class="modal-header bg-info text-white rounded-top-4">
            <h5 class="modal-title fw-bold" id="reservaModalLabel">
              <i class="bi me-2" :class="modoEliminar ? 'bi-exclamation-triangle-fill' : (editando ? 'bi-pencil-fill' : 'bi-plus-circle-fill')"></i>
              {{ modoEliminar ? 'Cancelar Reserva' : (editando ? 'Editar Reserva' : 'Nueva Reserva') }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalManualmente" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4">
            
            <div v-if="modoEliminar" class="text-center py-2">
              <div class="text-danger fs-1 mb-3">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h4 class="fw-bold text-dark">¿Está seguro de cancelar esta reserva?</h4>
              <p class="text-muted">Se eliminará la reserva de <strong class="text-dark">{{ form.huespedNombre }}</strong></p>
              <p class="text-muted small">{{ form.fechaEntrada }} a {{ form.fechaSalida }}</p>
              <div class="d-flex justify-content-center gap-2 mt-4">
                <button type="button" class="btn btn-light rounded-pill px-4" @click="cerrarModalManualmente">Cancelar</button>
                <button type="button" class="btn btn-danger fw-bold rounded-pill px-4" @click="ejecutarEliminacion">
                  <i class="bi bi-trash-fill me-1"></i>Confirmar Eliminación
                </button>
              </div>
            </div>

            <form v-else @submit.prevent="guardarReserva">
              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-person-fill me-1"></i>Nombre del Huésped
                </label>
                <input v-model="form.huespedNombre" type="text" class="form-control" placeholder="Ej: Juan Pérez" required>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-envelope-fill me-1"></i>Email
                </label>
                <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com" required>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-telephone-fill me-1"></i>Teléfono
                </label>
                <input v-model="form.telefono" type="tel" class="form-control" placeholder="+34 600 123 456" required>
              </div>

              <div class="row">
                <div class="col-6 mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">
                    <i class="bi bi-calendar-event me-1"></i>Fecha Entrada
                  </label>
                  <input v-model="form.fechaEntrada" type="date" class="form-control" required>
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label small fw-bold text-uppercase text-secondary">
                    <i class="bi bi-calendar-event me-1"></i>Fecha Salida
                  </label>
                  <input v-model="form.fechaSalida" type="date" class="form-control" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-people-fill me-1"></i>Número de Personas
                </label>
                <input v-model.number="form.numeroPersonas" type="number" min="1" class="form-control" required>
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-light rounded-pill px-4" @click="cerrarModalManualmente">Cancelar</button>
                <button type="submit" class="btn btn-info text-white fw-bold rounded-pill px-4">
                  <i class="bi bi-floppy-fill me-1"></i>{{ editando ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
