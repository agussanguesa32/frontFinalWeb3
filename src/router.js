import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import OrderView from './views/OrderView.vue';
import ActualChargesView from './views/ActualChargesView.vue';
import ConciliationsView from './views/ConciliationsView.vue';
import LoginView from './views/LoginView.vue';

const routes = [
  { path: '/ordenes', component: OrderView },
  { path: '/cargas-actuales', component: ActualChargesView },
  { path: '/conciliaciones', component: ConciliationsView },
  { path: '/login', component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');

  if (to.path === '/login' && token) {
    // Si el usuario está logueado y está intentando navegar a '/login', redirigir a '/ordenes'
    next('/ordenes');
  } else if (!token && to.path !== '/login') {
    // Si el usuario no está logueado y está intentando navegar a cualquier ruta que no sea '/login', redirigir a '/login'
    next('/login');
  } else {
    // En cualquier otro caso, permitir la navegación
    next();
  }
});

export default router;