<template>
  <div class="m-3">
    <div class="d-flex justify-content-between align-items-start mt-4">
      <div class="flex-grow-1 mr-3">
        <div class="row">
          <div
            v-for="order in orders"
            :key="order.orden"
            class="col-sm-4 col-md-3 col-lg-2"
          >
            <div class="card mb-3">
              <div class="card-header d-flex justify-content-center">
                <h5>Orden {{ order.id }}</h5>
              </div>
              <div class="card-body">
                <p>Temperatura: {{ order.temperaturaProducto }}</p>
                <p>Tiempo transcurrido: {{ order.tiempoTranscurrido }}</p>
                <p>Preset: {{ order.preset }}</p>
                <p>Masa acumulada: {{ order.masaAcumulada }}</p>
                <p>
                  Tiempo estimado restante: {{ order.tiempoRestanteEstimado }}
                </p>
                <div class="d-flex justify-content-center">
                  <button
                    @click="finalizarCarga(order)"
                    class="btn btn-primary mt-2"
                  >
                    Finalizar Carga
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "vue3-toastify";

export default {
  name: "ActualChargesView",
  data() {
    return {
      orders: [],
      socket: null,
      token: null,
    };
  },

  mounted() {
    this.connectWS();

    this.obtainOrders().then((data) => {
      this.orders = data;
    });
  },

  beforeUnmount() {
    // Clean up the WebSocket connection when the component is destroyed
    this.socket.close();
  },

  methods: {
    async finalizarCarga(order) {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_API_URL}/orders/finalizarCarga`,
          {},
          {
            params: {
              id: order.id,
            },
            headers: {
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
            },
          }
        );
        toast.success("Carga finalizada correctamente");
        console.log("Carga finalizada:", response.data);
        this.obtainOrders().then((data) => {
          this.orders = data;
        });
        this.closeModal("finalizarCargaModal");
      } catch (error) {
        console.error("Error al finalizar la carga:", error);
      }
    },

    async connectWS() {
      // Create and connect the WebSocket
      this.socket = new WebSocket(`${process.env.VUE_APP_API_WS_URL}/chat`);

      this.socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      this.socket.onmessage = (event) => {
        // Parse the message received from the server
        const message = JSON.parse(event.data);
        // Check if the order already exists in the orders array
        const existingOrderIndex = this.orders.findIndex(
          (order) => order.id === message.orden
        );
        // If the order exists, update it; otherwise, push it to the orders array
        if (existingOrderIndex !== -1) {
          // Update existing order
          this.orders.splice(existingOrderIndex, 1, message);
        } else {
          // Add new order to the orders array
          this.orders.push(message);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },

    async obtainOrders() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/orders/findByState?state=2`,
          {
            headers: {
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    closeModal(modalId) {
  this.selectedOrder = null;
  this.pesoTexto = "";

  // Limpiar los campos dependiendo del modal
  switch(modalId) {
    case 'pesarCamionModal':
      this.pesoTexto = '';
      break;
    case 'agregarDetalleModal':
      this.detalle = {
        masaAcumulada: '',
        densidadProducto: '',
        temperaturaProducto: '',
        caudal: ''
      };
      break;
    case 'pesajeFinalModal':
      this.pesoTexto = '';
      break;
    case 'nuevaOrdenModal':
      this.selectedDriver = '';
      this.selectedClient = '';
      this.selectedTruck = '';
      this.selectedProduct = '';
      this.fechaSeleccionada = '';
      this.selectedHour = '';
      this.selectedMinute = '';
      this.preset = '';
      break;
    default:
      break;
  }

  const modal = document.getElementById(modalId);
  modal.classList.remove("show");
  this.modalBackdropVisible = false;
},
  },
};
</script>

<style scoped>
.card {
  width: 100%;
  min-height: 100px;
}
</style>
