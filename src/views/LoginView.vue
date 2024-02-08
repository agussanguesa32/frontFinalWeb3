<template>
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-md-6 text-center">
        <div class="rounded-circle logo-container mt-4" style="background-color: #6F42C1;">
          <img src="https://static.vecteezy.com/system/resources/previews/014/455/904/non_2x/delivery-truck-icon-icon-on-transparent-background-free-png.png" class="rounded-circle logo" alt="Camión">
        </div>
        <div class="card mt-4">
          <div class="card-body">
            <form @submit.prevent="submitLogin()">
              <div class="form-group text-left">
                <label for="username" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="username" v-model="username">
              </div>
              <div class="form-group text-left">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" v-model="password">
              </div>
              <div class="d-flex justify-content-center mt-3">
                <button type="submit" class="btn btn-primary" style="background-color: #6F42C1;">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'vue3-toastify';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    ...mapMutations([
      'login'
    ]),
    async submitLogin() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/login?username=${this.username}&password=${this.password}`);

        if (response.data && typeof response.data !== 'undefined') {
          Cookies.set('token', response.data);
          this.login(response.data);
          toast.success('Ha iniciado sesion correctamente');
          setTimeout(() => {
            this.$router.push('/ordenes');
          }, 1000);
          console.log('Token guardado:', Cookies.get('token'));
        } else {
          console.log('No se recibió ningún token');
          toast.error('Hubo un error interno. Por favor, inténtalo de nuevo más tarde.');
        }
      } catch (error) {
        console.error('Error al hacer login:', error);
        toast.error('Los datos de inicio de sesión no son válidos');
      }
    }
  }
};
</script>

<style scoped>
.logo-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px; 
}

.logo {
  width: 100px;
  height: 100px;
  margin: 10px;
}

.card {
  margin-top: 20px;
}

.text-left {
  text-align: left;
}

.mt-3 {
  margin-top: 15px; 
}
</style>