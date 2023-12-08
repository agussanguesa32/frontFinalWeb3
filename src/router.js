import { createRouter, createWebHistory } from 'vue-router'
import Ordenes from './views/OrderView.vue'
//import CargasActuales from './views/CargasActuales.vue'
//import Conciliaciones from './views/Conciliaciones.vue'

const routes = [
  { path: '/orders', component: Ordenes },
  //{ path: '/cargas-actuales', component: CargasActuales },
  //{ path: '/conciliaciones', component: Conciliaciones },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router