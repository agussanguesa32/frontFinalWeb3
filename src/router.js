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
    next('/ordenes');
  } else if (!token && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});

export default router;