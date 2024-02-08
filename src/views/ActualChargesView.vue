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
                <h5>Orden {{ order.orden }}</h5>
              </div>
              <div class="card-body">
                <p>Temperatura: {{ order.temperatura }}</p>
                <p>Tiempo transcurrido: {{ order.tiempoTranscurrido }}</p>
                <p>Preset: {{ order.preset }}</p>
                <p>Masa acumulada: {{ order.masaAcumulada }}</p>
                <p>
                  Tiempo estimado restante: {{ order.tiempoEstimadoRestante }}
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
    this.socket = new WebSocket("ws://localhost:9080/chat");
    
    this.socket.onopen = (event) => {
      console.log(event);
      console.log("WebSocket connection established");
    };

    this.socket.onmessage = (event) => {
      console.log(event);
      console.log("WebSocket message received");
    };
    /*
    this.socket.onmessage = (event) => {
      // Parse the message received from the server
      const message = JSON.parse(event.data);
      // Update the orders array with the new data
      this.orders.push(message);
    };
    */
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
