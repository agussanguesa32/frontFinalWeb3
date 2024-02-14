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
                <div class="d-flex justify-content-center blackButtons">
                  <button
                    class="btn custom-button mb-2"
                    @click="openModal(order)"
                  >
                    Finalizar Carga
                  </button>
                </div>
              </div>
              <!-- Modal para finalizar carga -->
              <div
                class="modal blackButtons"
                v-bind:id="'finalizarCargaModal' + order.id"
                tabindex="-1"
                aria-labelledby="finalizarCargaModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <!-- Cabecera del modal -->
                    <div class="modal-header">
                      <h5 class="modal-title" id="finalizarCargaModalLabel">
                        Finalizar Carga
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        @click="closeModal(order.id)"
                        style="background-color: red"
                      ></button>
                    </div>

                    <!-- Cuerpo del modal -->
                    <div class="modal-body text-center">
                      <p>Se cargaron {{ order.masaAcumulada }} Kg</p>
                    </div>

                    <!-- Pie del modal -->
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="finalizarCarga(order)"
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary"
                        @click="closeModal(order.id)"
                        style="background-color: red"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="modalBackdropVisible" class="modal-backdrop"></div>
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
import "vue3-toastify/dist/index.css";
export default {
  name: "ActualChargesView",
  data() {
    return {
      orders: [],
      socket: null,
      modalBackdropVisible: false,
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
        this.closeModal(order.id);
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

    openModal(order) {
      // Validacion de orden con detalle
      if (order.temperaturaProducto === null) {
        toast.error("La orden aun no ha emitido ningun detalle");
        return;
      }

      this.modalBackdropVisible = true;

      this.$nextTick(() => {
        const modal = document.getElementById("finalizarCargaModal" + order.id);
        modal.classList.add("show");
      });
    },

    closeModal(orderId) {
      const modal = document.getElementById("finalizarCargaModal" + orderId);
      modal.classList.remove("show");
      this.modalBackdropVisible = false;
    },
  },
};
</script>

<style scoped>

.custom-button {
  background-color: #6f42c1;
  color: white;
}

.custom-button:hover,
.custom-button:focus:active {
  background-color: #9575cd;
}

.fixed-bottom-center {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.card {
  width: 100%;
  min-height: 100px;
}
.button-container {
  margin-left: 20px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal.show {
  display: block;
}

.modal-backdrop {
  z-index: 1040;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#nuevaOrdenModal {
  top: -20px;
}

#closeButton {
  background-color: red;
}

</style>
