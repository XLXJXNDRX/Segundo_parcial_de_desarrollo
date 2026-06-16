<template>
  <div class="d-flex bg-light min-vh-100">
    <SidebarComponent />

    <div class="flex-grow-1 d-flex flex-column">
      <NavbarComponent seccion="Módulo de Inventario de Habitaciones" />

      <div class="container my-5 px-4">
        <div class="row g-4">

          <div class="col-lg-4">
            <div class="card shadow-sm border-0 p-4 rounded-3 bg-white">
              <h5 class="fw-bold text-dark text-uppercase mb-3">
                {{ editandoIndex !== null ? 'Editar Registro' : 'Nueva Habitación' }}
              </h5>
              <hr>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Identificador / Número</label>
                <input v-model="form.titulo" type="text" class="form-control" placeholder="Ej: Habitación 101" required>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Precio por Noche ($)</label>
                <input v-model="form.precio" type="number" class="form-control" placeholder="Ej: 80000" min="1"
                  required>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold text-secondary">Acomodación</label>
                <select v-model="form.sala" class="form-select">
                  <option>Suite Presidencial</option>
                  <option>Habitación Doble Premium</option>
                  <option>Habitación Sencilla Estándar</option>
                </select>
              </div>

              <button @click="guardarProducto" class="btn btn-warning fw-bold w-100 text-white shadow-sm">
                {{ editandoIndex !== null ? 'Actualizar' : 'Registrar Habitación' }}
              </button>
              <button v-if="editandoIndex !== null" @click="cancelarEdicion" class="btn btn-secondary w-100 mt-2">
                Cancelar
              </button>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="card shadow-sm border-0 rounded-3 overflow-hidden bg-white">
              <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold">Inventario Real en LocalStorage</h6>
                <span class="badge bg-warning text-dark fw-bold rounded-pill">{{ productos.length }} Habitaciones</span>
              </div>

              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light text-uppercase small">
                    <tr>
                      <th class="ps-3">ID</th>
                      <th>Nombre</th>
                      <th>Precio Base</th>
                      <th>Tipo</th>
                      <th class="text-end pe-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, i) in productos" :key="i">
                      <td class="ps-3 text-muted">#0{{ i + 1 }}</td>
                      <td><span class="fw-bold text-dark">{{ p.titulo }}</span></td>
                      <td><span class="text-success fw-bold">${{ Number(p.precio).toLocaleString() }}</span></td>
                      <td><span class="badge bg-light text-dark border">{{ p.sala }}</span></td>
                      <td class="text-end pe-3">
                        <button @click="seleccionarParaEditar(p, i)"
                          class="btn btn-outline-warning btn-sm me-1">Editar</button>
                        <button @click="eliminarHabitacion(p.id)" class="btn btn-danger">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'https://6a11afb93e35d0f37ee38a9f.mockapi.io/products'

const productos = ref([])
const editandoIndex = ref(null) // Rescata la línea 14 de tu HTML

// Estructura idéntica a tus v-model de las líneas 20, 25 y 30
const form = ref({
  titulo: '',
  precio: '',
  sala: 'Suite Presidencial'
})

// Traer datos de internet
const obtenerHabitaciones = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    productos.value = data
  } catch (error) {
    console.error("Error al obtener datos:", error)
  }
}

// Guardar desde el botón de la línea 36
const guardarProducto = async () => {
  if (!form.value.titulo || !form.value.precio) {
    alert('Campos obligatorios vacíos')
    return
  }

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    
    obtenerHabitaciones() // Refresca
    form.value = { titulo: '', precio: '', sala: 'Suite Presidencial' } // Limpia
  } catch (error) {
    console.error("Error al guardar:", error)
  }
}

// Eliminar
const eliminarHabitacion = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    obtenerHabitaciones()
  } catch (error) {
    console.error("Error al eliminar:", error)
  }
}

onMounted(() => {
  obtenerHabitaciones()
})
</script>