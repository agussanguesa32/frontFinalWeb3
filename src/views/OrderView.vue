<template>
  <div>
    <CarouselComponent />
    <div class="m-3">
      <div class="d-flex justify-content-between align-items-start mt-4">
        <div class="flex-grow-1 mr-3">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th @click="toggleSort('orden')">
                  Orden
                  <span v-if="sortKey === 'orden' && sortAsc">↑</span>
                  <span v-else-if="sortKey === 'orden' && !sortAsc">↓</span>
                </th>
                <th @click="toggleSort('estado')">
                  Estado
                  <span v-if="sortKey === 'estado' && sortAsc">↑</span>
                  <span v-else-if="sortKey === 'estado' && !sortAsc">↓</span>
                </th>
                <th>Camión</th>
                <th>Preset</th>
                <th>Chofer</th>
                <th>Producto</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in sortedOrders"
                :key="index"
                :class="{ 'selected-row': order.selected }"
              >
                <td><input type="checkbox" v-model="order.selected" /></td>
                <td>{{ order.id }}</td>
                <td>{{ order.estado }}</td>
                <td>{{ order.camion.patente }}</td>
                <td>{{ order.preset }}</td>
                <td>{{ order.chofer.apellido }}</td>
                <td>{{ order.producto.nombre }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Botones -->
        <div
          class="d-flex flex-column flex-shrink-0 ml-3 mt-5 button-container"
        >
          <button
            class="btn custom-button mb-2"
            @click="openModal('pesarCamionModal')"
          >
            Pesar Camion
          </button>
          <button
            class="btn custom-button mb-2"
            @click="openModal('finalizarCargaModal')"
          >
            Finalizar Carga
          </button>
          <button
            class="btn custom-button mb-2"
            @click="openModal('pesajeFinalModal')"
          >
            Pesaje Final
          </button>
          <button
            class="btn custom-button"
            @click="openModal('verConciliacionModal')"
          >
            Ver Conciliación
          </button>
        </div>
      </div>
    </div>
    <button
      class="btn custom-button fixed-bottom-center"
      @click="openModal('nuevaOrdenModal', false)"
    >
      Nueva Orden
    </button>

    <!-- Modal para pesar el camión -->
    <div
      v-if="selectedOrder"
      class="modal"
      id="pesarCamionModal"
      tabindex="-1"
      aria-labelledby="pesarCamionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Pesar Camión</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal('pesarCamionModal')"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Orden: {{ selectedOrder.orden }}</h6>
            <h6>Camión: {{ selectedOrder.camion }}</h6>
            <div class="form-group">
              <label for="pesoInput">Peso:</label>
              <input
                type="text"
                class="form-control"
                id="pesoInput"
                v-model="pesoTexto"
                placeholder="Ingrese el peso..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="listoClick">
              Listo
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('pesarCamionModal')"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para finalizar carga -->
    <div
      v-if="selectedOrder"
      class="modal"
      id="finalizarCargaModal"
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
              @click="closeModal('pesarCamionModal')"
            ></button>
          </div>

          <!-- Cuerpo del modal -->
          <div class="modal-body text-center">
            <p>Se cargaron {{ X }} kg de {{ Y }} kg.</p>
          </div>

          <!-- Pie del modal -->
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-primary" @click="listoClick">
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('finalizarCargaModal')"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para pesaje final -->
    <div
      v-if="selectedOrder"
      class="modal"
      id="pesajeFinalModal"
      tabindex="-1"
      aria-labelledby="pesajeFinalModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Pesaje Final</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal('pesajeFinalModal')"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Orden: {{ selectedOrder.orden }}</h6>
            <h6>Camión: {{ selectedOrder.camion }}</h6>
            <div class="form-group">
              <label for="pesoInput">Peso:</label>
              <input
                type="text"
                class="form-control"
                id="pesoInput"
                v-model="pesoTexto"
                placeholder="Ingrese el peso..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="listoClick">
              Listo
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('pesajeFinalModal')"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ver conciliación -->
    <div
      v-if="selectedOrder"
      class="modal"
      id="verConciliacionModal"
      tabindex="-1"
      aria-labelledby="verConciliacionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Contenido del modal para ver conciliación, falta hacer -->
        </div>
      </div>
    </div>

    <!-- Modal para nueva orden -->
    <div
      class="modal"
      id="nuevaOrdenModal"
      tabindex="-1"
      aria-labelledby="nuevaOrdenModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="nuevaOrdenModalLabel">Nueva Orden</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal('nuevaOrdenModal')"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="choferInput" class="form-label">Chofer</label>
              <select class="form-select" id="choferInput">
                <option selected>Seleccionar Chofer...</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="clienteInput" class="form-label">Cliente</label>
              <select class="form-select" id="clienteInput">
                <option selected>Seleccionar Cliente...</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="camionInput" class="form-label">Camión</label>
              <select class="form-select" id="camionInput">
                <option selected>Seleccionar Camión...</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="productoInput" class="form-label">Producto</label>
              <select class="form-select" id="productoInput">
                <option selected>Seleccionar Producto...</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="fechaInput" class="form-label">Fecha</label>
              <datepicker
                v-model="fechaSeleccionada"
                :language="es"
              ></datepicker>
            </div>
          </div>

          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-primary" @click="listoClick">
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('nuevaOrdenModal')"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalBackdropVisible" class="modal-backdrop"></div>
  </div>
</template>

<script>
import CarouselComponent from "@/components/CarouselComponent.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Datepicker from "vue3-datepicker";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  components: {
    CarouselComponent,
    Datepicker,
  },
  data() {
    return {
      orders: [],
      sortKey: "estado",
      sortAsc: true,
      selectedOrder: null,
      pesoTexto: "",
      modalBackdropVisible: false,
      fechaSeleccionada: new Date(),
    };
  },
  mounted() {
    this.obtainOrders().then((data) => {
      this.orders = data;
    });
  },
  computed: {
    sortedOrders() {
      return [...this.orders].sort((a, b) =>
        this.sortAsc
          ? a[this.sortKey] - b[this.sortKey]
          : b[this.sortKey] - a[this.sortKey]
      );
    },
  },
  methods: {
    openModal(modalId, validateSelection = true) {
      if (validateSelection) {
        const selectedOrders = this.sortedOrders.filter(
          (order) => order.selected
        );

        if (selectedOrders.length !== 1) {
          toast.error("Se debe seleccionar 1 orden obligatoriamente", {
            timeout: 5000,
          });
          return;
        }

        this.selectedOrder = selectedOrders[0];
      }
      this.modalBackdropVisible = true;

      this.$nextTick(() => {
        const modal = document.getElementById(modalId);
        modal.classList.add("show");
      });
    },

    closeModal(modalId) {
      this.selectedOrder = null;
      this.pesoTexto = "";
      const modal = document.getElementById(modalId);
      modal.classList.remove("show");
      this.modalBackdropVisible = false;
    },
    listoClick() {
      console.log("Peso ingresado:", this.pesoTexto);
      this.closeModal("pesarCamionModal");
    },
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async obtainOrders() {
      try {
        const response = await axios.get(
          "http://localhost:9080/api/v1/orders/list",
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"),
            },
          }
        );
        console.log("Órdenes obtenidas:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        return [];
      }
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

.selected-row > td {
  background-color: #9575cd;
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
</style>
