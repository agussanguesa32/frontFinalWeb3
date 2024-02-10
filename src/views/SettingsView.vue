<template>
    <div>
      <h1 class="text-center title">Bienvenido {{ username }}</h1>
  
      <div class="card-container blackButtons">
        <div class="card">
          <div class="card-body d-flex flex-column">
            <p class="card-text">Aquí puedes modificar los emails destino.</p>
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
            <p>Aquí puedes modificar los emails destino.</p>
          </div>

          <!-- Pie del modal -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Aceptar</button>
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
        <div class="modal-footer">
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
      newTemperature: null
    };
  },
  async created() {
    const token = atob(Cookies.get('token'));
    const url = `${process.env.VUE_APP_API_URL}/configuration/getTemperaturaUmbral`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.temperature = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
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
  </style>