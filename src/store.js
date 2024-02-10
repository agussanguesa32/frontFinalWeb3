import { createStore } from 'vuex';
import Cookies from 'js-cookie';
import router from './router'
import axios from 'axios';

export default createStore({
  state: {
    isLoggedIn: !!Cookies.get('token'),
    username: '',
    userRole: '' 
  },
  mutations: {
    login(state, { token, username }) {
      Cookies.set('token', btoa(token)); 
      Cookies.set('username', btoa(username)); 
      state.isLoggedIn = true;
      state.username = username;
    },
    logout(state) {
      Cookies.remove('token');
      state.isLoggedIn = false;
      state.username = '';
      state.userRole = ''; 
      router.push('/login');
    },
    setUserRole(state, role) { 
      state.userRole = role;
    }
  },
  actions: {
    async fetchUserRole({ commit }) { 
      try {
        const token = atob(Cookies.get('token')); 
        let username = '';

        const usernameResponse = await axios.get(`${process.env.VUE_APP_API_URL}/authtest/username`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });    
        if (usernameResponse.data && typeof usernameResponse.data !== 'undefined') {
          username = usernameResponse.data;
          commit('login', { token: token, username });}
    
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/authtest/my-rols?username=${username}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        const role = response.data.replace(/\[ROLE_(.*?)\]/, '$1');
        commit('setUserRole', role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
  }
});