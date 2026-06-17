<script setup>
import { ref, onMounted, nextTick } from 'vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import { Modal } from 'bootstrap'

// Usamos un endpoint que creamos localmente o simulamos con localStorage
// Para este ejercicio, usaremos un array local que simula una BD
const usuarios = ref([
  { id: 1, username: 'admin', email: 'admin@hotel.com' },
  { id: 2, username: 'user1', email: 'user1@hotel.com' },
  { id: 3, username: 'user2', email: 'user2@hotel.com' }
])

const cargando = ref(false)
const form = ref({ id: null, username: '', email: '' })
const editando = ref(false)
const modoEliminar = ref(false)

const alertaMensaje = ref('')
const alertaTipo = ref('success')
const proximoId = ref(4)

const mostrarAlertaTemporizada = (mensaje, tipo = 'success') => {
  alertaMensaje.value = mensaje
  alertaTipo.value = tipo
  setTimeout(() => {
    alertaMensaje.value = ''
  }, 3000)
}

const abrirModalCrear = async () => {
  editando.value = false
  modoEliminar.value = false
  form.value = { id: null, username: '', email: '' }
  await nextTick()
  const modalElement = document.getElementById('usuarioModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const abrirModalEditar = async (item) => {
  editando.value = true
  modoEliminar.value = false
  form.value = { id: item.id, username: item.username, email: item.email }
  await nextTick()
  const modalElement = document.getElementById('usuarioModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const abrirModalEliminar = async (item) => {
  editando.value = false
  modoEliminar.value = true
  form.value = { id: item.id, username: item.username, email: item.email }
  await nextTick()
  const modalElement = document.getElementById('usuarioModal')
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
    modal.show()
  }
}

const guardarUsuario = async () => {
  if (!form.value.username || !form.value.email) return
  
  try {
    if (editando.value) {
      const index = usuarios.value.findIndex(u => u.id === form.value.id)
      if (index !== -1) {
        usuarios.value[index] = { ...form.value }
      }
      mostrarAlertaTemporizada('Usuario modificado exitosamente', 'success')
    } else {
      const nuevoUsuario = {
        id: proximoId.value++,
        username: form.value.username,
        email: form.value.email
      }
      usuarios.value.push(nuevoUsuario)
      mostrarAlertaTemporizada('Usuario creado exitosamente', 'success')
    }
    cerrarModalManualmente()
  } catch (error) {
    console.error(error)
    mostrarAlertaTemporizada('Error al procesar la solicitud', 'danger')
  }
}

const ejecutarEliminacion = async () => {
  try {
    usuarios.value = usuarios.value.filter(u => u.id !== form.value.id)
    mostrarAlertaTemporizada('Usuario eliminado correctamente', 'warning')
    cerrarModalManualmente()
  } catch (error) {
    console.error(error)
    mostrarAlertaTemporizada('Error al intentar eliminar', 'danger')
  }
}

const cerrarModalManualmente = () => {
  const modalElement = document.getElementById('usuarioModal')
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

onMounted(() => {
  // Cargar usuarios desde localStorage si existen
  const usuariosGuardados = localStorage.getItem('usuarios')
  if (usuariosGuardados) {
    usuarios.value = JSON.parse(usuariosGuardados)
    proximoId.value = Math.max(...usuarios.value.map(u => u.id)) + 1
  }
})

</script>

<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarComponent />

    <div class="flex-grow-1 d-flex flex-column">
      <NavbarComponent :seccion="'Administración de Usuarios'" />

      <div class="container my-5 px-4">
        
        <div v-if="alertaMensaje" :class="`alert alert-${alertaTipo} alert-dismissible fade show position-fixed top-0 end-0 m-4 shadow-lg`" role="alert" style="z-index: 2000; min-width: 300px;">
          <i class="bi bi-info-circle-fill me-2"></i>
          <strong>{{ alertaMensaje }}</strong>
          <button type="button" class="btn-close" @click="alertaMensaje = ''" aria-label="Close"></button>
        </div>

        <div class="card p-4 shadow-sm border-0 rounded-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-dark mb-0">
              <i class="bi bi-people-fill me-2 text-primary"></i>Listado de Usuarios
            </h3>
            <button @click="abrirModalCrear" class="btn btn-primary fw-bold text-white shadow-sm px-4 rounded-pill">
              <i class="bi bi-person-plus-fill me-2"></i>Crear Usuario
            </button>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-dark">
                <tr>
                  <th>
                    <i class="bi bi-hash me-2"></i>ID
                  </th>
                  <th>
                    <i class="bi bi-person me-2"></i>Usuario
                  </th>
                  <th>
                    <i class="bi bi-envelope me-2"></i>Email
                  </th>
                  <th class="text-center">
                    <i class="bi bi-tools me-2"></i>Operaciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in usuarios" :key="item.id">
                  <td class="fw-bold text-secondary">#{{ item.id }}</td>
                  <td class="fw-semibold text-dark">{{ item.username }}</td>
                  <td class="text-muted">{{ item.email }}</td>
                  <td class="text-center">
                    <button @click="abrirModalEditar(item)" class="btn btn-outline-primary btn-sm me-2 rounded-pill px-3" title="Editar usuario">
                      <i class="bi bi-pencil-fill me-1"></i>Editar
                    </button>
                    <button @click="abrirModalEliminar(item)" class="btn btn-outline-danger btn-sm rounded-pill px-3" title="Eliminar usuario">
                      <i class="bi bi-trash-fill me-1"></i>Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="usuarios.length === 0" class="text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
            <p class="text-muted fs-5">No hay usuarios registrados.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="usuarioModal" tabindex="-1" aria-labelledby="usuarioModalLabel" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          
          <div class="modal-header bg-primary text-white rounded-top-4">
            <h5 class="modal-title fw-bold" id="usuarioModalLabel">
              <i class="bi me-2" :class="modoEliminar ? 'bi-exclamation-triangle-fill' : (editando ? 'bi-pencil-fill' : 'bi-person-plus-fill')"></i>
              {{ modoEliminar ? 'Confirmar Eliminación' : (editando ? 'Modificar Usuario' : 'Registrar Nuevo Usuario') }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalManualmente" aria-label="Close"></button>
          </div>

          <div class="modal-body p-4">
            
            <div v-if="modoEliminar" class="text-center py-2">
              <div class="text-danger fs-1 mb-3">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h4 class="fw-bold text-dark">¿Está completamente seguro?</h4>
              <p class="text-muted">Se eliminará permanentemente al usuario: <br><strong class="text-dark">{{ form.username }}</strong></p>
              <div class="d-flex justify-content-center gap-2 mt-4">
                <button type="button" class="btn btn-light rounded-pill px-4" @click="cerrarModalManualmente">Cancelar</button>
                <button type="button" class="btn btn-danger fw-bold rounded-pill px-4" @click="ejecutarEliminacion">
                  <i class="bi bi-trash-fill me-1"></i>Confirmar Eliminación
                </button>
              </div>
            </div>

            <form v-else @submit.prevent="guardarUsuario">
              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-person-fill me-1"></i>Usuario
                </label>
                <input v-model="form.username" type="text" class="form-control" placeholder="Nombre de usuario" required>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-uppercase text-secondary">
                  <i class="bi bi-envelope-fill me-1"></i>Email
                </label>
                <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com" required>
              </div>
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-light rounded-pill px-4" @click="cerrarModalManualmente">Cancelar</button>
                <button type="submit" class="btn btn-primary text-white fw-bold rounded-pill px-4">
                  <i class="bi bi-floppy-fill me-1"></i>Guardar Datos
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
