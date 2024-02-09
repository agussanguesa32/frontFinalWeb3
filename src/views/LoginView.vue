<template>
  <div class="login-container">
    <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-md-6 text-center">
        <div class="rounded-circle logo-container mt-4">
          <img src="https://w7.pngwing.com/pngs/597/944/png-transparent-car-volvo-trucks-semi-trailer-truck-truck-white-truck-logo.png" class="rounded-circle logo" alt="Camión">
        </div>
        <div class="card mt-4" style="box-shadow: none; border-radius: 25px;">
          <div class="card-body" style="background-color: #303030; margin: -1px; border-radius: 20px;" >
            <form @submit.prevent="submitLogin()">
              <div class="form-group text-left" style="color: white; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">
                <label for="username" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="username" v-model="username">
              </div>
              <div class="form-group text-left" style="color: white; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" v-model="password">
              </div>
              <div class="d-flex justify-content-center mt-3">
                <button type="submit" class="btn btn-primary loginButton" id="loginButton">Login</button>
              </div>
            </form>
          </div>
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
.login-container {
  /* Reemplaza 'url' con la URL de tu imagen */
  background-image: url('https://i.imgur.com/qEytMDJ.jpg');

  /* Centra y escala la imagen de fondo */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  /* Asegúrate de que el contenedor ocupe toda la pantalla */
  width: 100vw;
  height: 100vh;
}
#loginButton.loginButton {
  background-color: white; /* Tu color deseado */
  color: black; /* Tu color deseado */
  border-color: black;
}

</style>