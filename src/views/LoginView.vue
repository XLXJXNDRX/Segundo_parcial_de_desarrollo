<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref('')
const pass = ref('')
const error = ref('')

const API_USUARIOS = 'https://6a11afb93e35d0f37ee38a9f.mockapi.io/user'

const handleLogin = async () => {
  error.value = ''

  if (!user.value || !pass.value) {
    error.value = 'Por favor complete todos los campos, mi perro'
    return
  }

  try {
    const response = await fetch(API_USUARIOS)
    const listaUsuarios = await response.json()

    const usuarioEncontrado = listaUsuarios.find(
      (u) => u.username === user.value && u.password === pass.value
    )

    if (usuarioEncontrado) {
      localStorage.setItem('user_authenticated', 'true')
      router.push('/dashboard')
    } else {
      error.value = 'Usuario o contraseña incorrectos'
      alert(error.value)
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error de conexión con MockAPI'
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-lg border-0 rounded-4 w-100" style="max-width: 400px;">
      
      <div class="text-center mb-4">
        <h2 class="fw-bold text-dark mb-1">Hotel Boutique</h2>
        <p class="text-muted small">Panel de Administración</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label small fw-bold text-secondary text-uppercase">Usuario</label>
          <input v-model="user" type="text" class="form-control form-control-lg border-secondary" placeholder="Ingrese su usuario" required>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-secondary text-uppercase">Contraseña</label>
          <input v-model="pass" type="password" class="form-control form-control-lg border-secondary" placeholder="Ingrese su contraseña" required>
        </div>

        <button type="submit" class="btn btn-warning btn-lg fw-bold w-100 shadow-sm mt-2 text-white text-uppercase">
          Ingresar
        </button>
      </form>

    </div>
  </div>
</template>