import { createStore } from 'vuex';
import Cookies from 'js-cookie';
import router from './router'

export default createStore({
  state: {
    isLoggedIn: !!Cookies.get('token')
  },
  mutations: {
    login(state, token) {
      Cookies.set('token', token);
      state.isLoggedIn = true;
    },
    logout(state) {
      Cookies.remove('token');
      state.isLoggedIn = false;
      router.push('/login');
    }
  }
});