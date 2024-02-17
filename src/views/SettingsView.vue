<template>
    <div>
      <h1 class="text-center title">Bienvenido {{ username }}</h1>
  
      <div class="card-container blackButtons">
        <div class="card">
          <div class="card-body d-flex flex-column">
            <p class="card-text">Aquí puedes modificar a que personas se enviaran los Emails</p>
            <button @click="showEmailModal = true" class="btn btn-primary mt-auto">Modificar Emails</button>
          </div>
        </div>
  
        <!-- Tarjeta para modificar temperatura umbral -->
  <div class="card">
    <div class="card-body d-flex flex-column">
      <p class="card-text">La temperatura umbral actual es: {{ temperature }}°C</p>
      <button @click="showTemperatureModal = true" class="btn btn-primary mt-auto">Modificar Temperatura</button>
    </div>
  </div>
      </div>
  
      <!-- Modal para modificar emails destino -->
    <div v-if="showEmailModal" class="modal blackButtons" id="emailModal" tabindex="-1" aria-labelledby="emailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Cabecera del modal -->
          <div class="modal-header">
            <h5 class="modal-title" id="emailModalLabel">Modificar Emails destino</h5>
            <button type="button" class="btn-close" @click="showEmailModal = false" style="background-color: red;"></button>
          </div>

         <!-- Cuerpo del modal -->
<div class="modal-body text-center">
  <h5 class="mb-3">Configuración Emails</h5>
  <div class="d-flex flex-wrap justify-content-between">
    <div v-for="(role, index) in roles" :key="role.name" class="role-switch w-50" :class="{ 'mb-3': index < 2 }">
      <p>{{ role.name }}</p>
      <label class="switch">
        <input type="checkbox" v-model="role.selected">
        <span class="slider"></span>
      </label>
    </div>
  </div>
</div>
          <!-- Pie del modal -->

<div class="modal-footer justify-content-center">
  <button type="button" class="btn btn-primary" @click="updateEmailConfiguration">Aceptar</button>
  <button type="button" class="btn btn-secondary" @click="showEmailModal = false" style="background-color: red;">Cancelar</button>
</div>
        </div>
      </div>
    </div>



   <!-- Modal para modificar temperatura umbral -->
  <div v-if="showTemperatureModal" class="modal blackButtons" id="temperatureModal" tabindex="-1" aria-labelledby="temperatureModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Cabecera del modal -->
        <div class="modal-header">
          <h5 class="modal-title" id="temperatureModalLabel">Modificar temperatura umbral</h5>
          <button type="button" class="btn-close" @click="closeTemperatureModal" style="background-color: red;"></button>
        </div>

        <!-- Cuerpo del modal -->
        <div class="modal-body text-center">
          <p>La temperatura umbral actual es: {{ temperature }}°C</p>
          <input type="number" v-model="newTemperature" placeholder="Ingrese la nueva temperatura umbral">
        </div>

        <!-- Pie del modal -->
        <div class="modal-footer text-center">
          <button type="button" class="btn btn-primary" @click="updateTemperature">Aceptar</button>
          <button type="button" class="btn btn-secondary" @click="closeTemperatureModal" style="background-color: red;">Cancelar</button>
        </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      username: atob(Cookies.get('username')),
      showEmailModal: false,
      showTemperatureModal: false,
      temperature: null,
      newTemperature: null,
      roles: [
      { name: 'Admin', selected: false },
      { name: 'Supervisor', selected: false },
      { name: 'Balancista', selected: false },
      { name: 'Secretario', selected: false }
    ]
    };
  },
  async created() {
  const token = atob(Cookies.get('token'));
  const url = `${process.env.VUE_APP_API_URL}/configuration/getTemperaturaUmbral`;
  const urlRoles = `${process.env.VUE_APP_API_URL}/configuration/getAlarmReceptor`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    this.temperature = response.data;

    // Obtener la configuracion actual de los roles
    const responseRoles = await axios.get(urlRoles, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Actualizar el valor de 'selected' para cada rol
    this.roles.forEach(role => {
      const roleFromApi = responseRoles.data.find(r => r.name === `ROLE_${role.name.toUpperCase()}`);
      role.selected = !!roleFromApi;
    });
  } catch (error) {
    console.error(error);
  }
},
  methods: {
    async updateEmailConfiguration() {
  const token = atob(Cookies.get('token'));
  const baseUrl = `${process.env.VUE_APP_API_URL}/configuration/setAlarmReceptor`;

  const params = this.roles.reduce((acc, role) => {
    acc[role.name.toLowerCase()] = role.selected;
    return acc;
  }, {});

  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}?${queryString}`;

  try {
    await axios.put(url, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    toast.success('Configuración de emails actualizada correctamente.');
    this.showEmailModal = false;
  } catch (error) {
    console.error(error);
    toast.error('Ha ocurrido un error al actualizar la configuración de emails.');
  }
},
    async updateTemperature() {
      const token = atob(Cookies.get('token'));
      const url = `${process.env.VUE_APP_API_URL}/configuration/setTemperaturaUmbral?temperaturaUmbral=${this.newTemperature}`;

      try {
        await axios.post(url, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.temperature = this.newTemperature;
        toast.success('Temperatura umbral actualizada correctamente a ' + this.newTemperature + '°C.');
        this.closeTemperatureModal();
      } catch (error) {
        console.error(error);
        toast.error('Ha ocurrido un error al actualizar la temperatura umbral.');
      }
    },
    closeTemperatureModal() {
      this.showTemperatureModal = false;
      this.newTemperature = null;
    }
  }
};
</script>
    
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .card-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .card {
    width: 18rem;
    margin: 1rem;
  }
  
  .card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .btn {
    margin-top: auto;
  }

  .title{
    margin-top: 10px;
  }

  .switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ca2222;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2ab934;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
  </style>