import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Limpieza global: asegurar que no queden backdrops o clases 'modal-open' tras cerrar modales
document.addEventListener('hidden.bs.modal', () => {
	const backdrops = document.querySelectorAll('.modal-backdrop')
	backdrops.forEach(b => b.remove())
	document.body.classList.remove('modal-open')
	document.body.style.overflow = 'auto'
	document.body.style.paddingRight = '0'
})

// Limpiar cualquier backdrop residual al iniciar la aplicación
window.addEventListener('load', () => {
	const backdrops = document.querySelectorAll('.modal-backdrop')
	backdrops.forEach(b => b.remove())
	document.body.classList.remove('modal-open')
	document.body.style.overflow = 'auto'
	document.body.style.paddingRight = '0'
})