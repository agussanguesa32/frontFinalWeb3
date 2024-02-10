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
    // Fetch orders in state 2 from the API
    axios
  .get(`${process.env.VUE_APP_API_URL}/orders/findbyState?state=2`, {
    headers: {
      Authorization: `Bearer ${atob(Cookies.get("token"))}`,
    }
  })
  .then((response) => {
    this.orders = response.data;
  })
  .catch((error) => {
    console.error("Error fetching orders:", error);
  });
  },

  beforeUnmount() {
    // Clean up the WebSocket connection when the component is destroyed
    this.socket.close();
  },

  methods: {
    finalizarCarga(order) {
      // Lógica para finalizar la carga cuando tenga la API
      console.log("Carga finalizada para la orden", order.orden);
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
