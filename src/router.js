import { createRouter, createWebHistory } from 'vue-router'
import OrderView from './views/OrderView.vue'
import ActualChargesView from './views/ActualChargesView.vue'
import ConciliationsView from './views/ConciliationsView.vue'
import LoginView from './views/LoginView.vue'


const routes = [
  { path: '/ordenes', component: OrderView },
  { path: '/cargas-actuales', component: ActualChargesView },
  { path: '/conciliaciones', component: ConciliationsView },
  { path: '/login', component: LoginView },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router