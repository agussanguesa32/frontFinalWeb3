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
        <th>Fecha y Hora Prevista</th>
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
        <td>
        {{ order.estado }}
        <i class="fas fa-exclamation-triangle" v-if="isOrderInAlerts(order.id)" style="color: red;"></i>
        </td>
        <td>{{ order.camion.patente }}</td>
        <td>{{ order.preset }}</td>
        <td>{{ order.chofer.apellido }}</td>
        <td>{{ order.producto.nombre }}</td>
        <td>{{ formatDate(order.fechaCargaPrevista) }}</td> 
      </tr>
    </tbody>
  </table>

        </div>
        <!-- Botones -->
        <div
          class="d-flex flex-column flex-shrink-0 ml-3 mt-5 button-container blackButtons"
        >
          <button
            class="btn custom-button mb-2"
            @click="openModal('pesarCamionModal')"
          >
            Pesar Camion
          </button>
          <button type="button" class="btn custom-button mb-2" @click="openModal('agregarDetalleModal')">
            Agregar detalle
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
            class="btn custom-button mb-2"
            @click="openModal('verConciliacionModal')"
          >
            Ver Conciliación
          </button>
        </div>
      </div>
    </div>
    <div class="blackButtons">
      <button
      class="btn custom-button mb-2 fixed-bottom-center"
      @click="openModal('nuevaOrdenModal', false)"
    >
      Nueva Orden
    </button>
    </div>
    

   <!-- Modal para pesar el camión -->
<div
  v-if="selectedOrder"
  class="modal blackButtons"
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
          style="background-color: red;"
        ></button>
      </div>
      <div class="modal-body">
        <h6>Orden: {{ selectedOrder.id }}</h6> 
        <h6>Camión: {{ selectedOrder.camion.patente }}</h6>
        <div class="form-group">
          <label for="pesoInput">Peso:</label>
          <input
            type="number"
            class="form-control"
            id="pesoInput"
            v-model="pesoTexto"
            placeholder="Ingrese el peso..."
          />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="setPesajeInicial">
    Aceptar
  </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeModal('pesarCamionModal')"
          style="background-color: red;"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</div>

    <!-- Modal para finalizar carga -->
    <div
    v-if="selectedOrder"
    class="modal blackButtons"
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
              style="background-color: red;"
            ></button>
          </div>

          <!-- Cuerpo del modal -->
          <div class="modal-body text-center">
            <p>Se cargaron {{ selectedOrder.pesajeInicial }} Kg</p>
          </div>

         <!-- Pie del modal -->
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" @click="finalizarCarga">
        Aceptar
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="closeModal('finalizarCargaModal')"
        style="background-color: red;"
      >
        Cancelar
      </button>
    </div>
  </div>
      </div>
    </div>
<!-- Modal para agregar detalle -->
<div
    class="modal blackButtons"
    id="agregarDetalleModal"
    tabindex="-1"
    aria-labelledby="agregarDetalleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="agregarDetalleModalLabel">
            Agregar Detalle
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal('agregarDetalleModal')"
            style="background-color: red;"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="masaAcumuladaInput">Masa acumulada:</label>
            <input type="number" class="form-control" id="masaAcumuladaInput" v-model="detalle.masaAcumulada" placeholder="Ingrese la masa acumulada...">
          </div>
          <div class="form-group">
            <label for="densidadProductoInput">Densidad del producto:</label>
            <input type="number" class="form-control" id="densidadProductoInput" v-model="detalle.densidadProducto" placeholder="Ingrese la densidad del producto...">
          </div>
          <div class="form-group">
            <label for="temperaturaProductoInput">Temperatura del producto:</label>
            <input type="number" class="form-control" id="temperaturaProductoInput" v-model="detalle.temperaturaProducto" placeholder="Ingrese la temperatura del producto...">
          </div>
          <div class="form-group">
            <label for="caudalInput">Caudal:</label>
            <input type="number" class="form-control" id="caudalInput" v-model="detalle.caudal" placeholder="Ingrese el caudal...">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="agregarDetalle">
            Aceptar
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeModal('agregarDetalleModal')"
            style="background-color: red;"
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
  class="modal blackButtons"
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
          style="background-color: red;"
        ></button>
      </div>
      <div class="modal-body">
        <h6>Orden: {{ selectedOrder.id }}</h6> <!-- Access the id property directly -->
        <h6>Camión: {{ selectedOrder.camion.patente }}</h6> <!-- Access the patente property of the camion -->
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
          <!-- Pie del modal -->

      <div class="modal-footer">
      <button type="button" class="btn btn-primary" @click="setPesajeFinal">
        Aceptar
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="closeModal('pesajeFinalModal')"
        style="background-color: red;"
      >
        Cancelar
      </button>
    </div>
  </div>
  </div>
</div>

    <!-- Modal para ver conciliación -->
    <div
      v-if="selectedOrder"
      class="modal blackButtons"
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
              style="background-color: red;"
            >
          </button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="choferInput" class="form-label">Chofer</label>
              <select v-model="selectedDriver" class="form-select" id="choferInput">
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
               {{ driver.nombre }} {{ driver.apellido }}
              </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="clienteInput" class="form-label">Cliente</label>
              <select v-model="selectedClient" class="form-select" id="clienteInput">
                <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.razonSocial }}
              </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="camionInput" class="form-label">Camión</label>
              <select v-model="selectedTruck" class="form-select" id="camionInput">
                <option v-for="truck in trucks" :key="truck.id" :value="truck.id">
                {{ truck.patente }}
              </option>
              </select>
              </div>

            <div class="mb-3">
              <label for="productoInput" class="form-label">Producto</label>
              <select v-model="selectedProduct" class="form-select" id="productoInput">
                <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-3">
            <label for="fechaInput" class="form-label">Fecha</label>
              <div class="d-flex align-items-center">
              <datepicker id="calendario" v-model="fechaSeleccionada"></datepicker>
            </div>
              <label for="horaInput" class="form-label mt-3">Horario</label>
            <div class="d-flex align-items-center">
            <select id="horaInput" v-model="selectedHour" class="form-select ml-2" style="width: 80px;">
            <option v-for="hour in hours" :key="hour" :value="hour">
              {{ hour < 10 ? '0' + hour : hour }}
             </option>
             </select>
          <select v-model="selectedMinute" class="form-select ml-2" style="width: 80px;">
            <option v-for="minute in minutes" :key="minute" :value="minute">
        {{ minute < 10 ? '0' + minute : minute }}
            </option>
             </select>
          </div>
            <label for="presetInput" class="form-label mt-3">Preset</label>
           <input id="presetInput" v-model.number="preset" type="number" class="form-control">
            </div>
       </div>

          <div class="modal-footer justify-content-center">
            <div class="blackButtons">
              <button type="button" class="btn btn-primary" @click="sendOrder">
              Aceptar
              </button>
            </div>
            
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('nuevaOrdenModal')"
            id="closeButton">
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
import { format } from 'date-fns';

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
      drivers: [],
      clients: [],
      trucks: [],
      products: [],
      alarms: [],
      selectedTruck: null,
      selectedDriver: null,
      selectedClient: null,
      selectedProduct: null,
      selectedHour: 0,
      selectedMinute: 0,
      hours: Array.from({length: 24}, (v, i) => i),
      minutes: Array.from({length: 60}, (v, i) => i),
      preset: null,
      detalle: {
        masaAcumulada: null,
      densidadProducto: null,
      temperaturaProducto: null,
      caudal: null,
      },
      
    };
  },
  async created() {
  try {
    this.drivers = await this.obtainDrivers();
    this.clients = await this.obtainClients();
    this.trucks = await this.obtainTrucks();
    this.products = await this.obtainProducts();
  } catch (error) {
    console.error('Error obtaining data:', error);
  }
},
  mounted() {
    this.selectedHour = 0;
    this.selectedMinute = 0;
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
    isOrderInAlerts(orderId) {
      
      return this.alarms.some(alarm => alarm.orden.id === orderId);
    },
    async obtainAlarms() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/alarm/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        this.alarms = response.data;
        console.log("Alarmas obtenidas:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener las alarmas:", error);
        return [];
      }
    },
    async agregarDetalle() {
  try {
    const detalle = {
      masaAcumulada: this.detalle.masaAcumulada,
      densidadProducto: this.detalle.densidadProducto,
      temperaturaProducto: this.detalle.temperaturaProducto,
      caudal: this.detalle.caudal,
    };

    const response = await axios.post(
      `${process.env.VUE_APP_API_URL}/orders/addDetalle`,
      {
        ...detalle,
        orden: {
          id: this.selectedOrder.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    toast.success("Detalle agregado correctamente");
    console.log("Detalle agregado:", response.data);
    this.obtainOrders().then((data) => {
      this.orders = data;
    });
    this.closeModal("agregarDetalleModal");
  } catch (error) {
    console.error("Error al agregar el detalle:", error);
  }
},
async setPesajeFinal() {
  try {
    const pesajeFinal = parseFloat(this.pesoTexto);
    const response = await axios.post(
      `${process.env.VUE_APP_API_URL}/orders/setPesajeFinal`,
      {},
      {
        params: {
          id: this.selectedOrder.id,
          pesajeFinal,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    toast.success("Pesaje final establecido correctamente");
    console.log("Pesaje final establecido:", response.data);
    this.obtainOrders().then((data) => {
      this.orders = data;
    });
    this.closeModal("pesajeFinalModal");
  } catch (error) {
    console.error("Error al establecer el pesaje final:", error);
  }
},
    async finalizarCarga() {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_API_URL}/orders/finalizarCarga`,
          {},
          {
            params: {
              id: this.selectedOrder.id,
            },
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
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
    formatDate(date) {
      return format(new Date(date), 'yyyy-MM-dd HH:mm');
    },
    async setPesajeInicial() {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_URL}/orders/setPesajeInicial`,
      {},
      {
        params: {
          id: this.selectedOrder.id,
          pesajeInicial: this.pesoTexto,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    toast.success("Pesaje inicial establecido correctamente");
    console.log("Pesaje inicial establecido:", response.data);
    this.obtainOrders().then((data) => {
      this.orders = data;
    });
    this.closeModal("pesarCamionModal");
  } catch (error) {
    console.error("Error al establecer el pesaje inicial:", error);
  }
},
    async sendOrder() {
  const formattedDate = `${this.fechaSeleccionada.toISOString().split('T')[0]}T${String(this.selectedHour).padStart(2, '0')}:${String(this.selectedMinute).padStart(2, '0')}:00`;

  const order = {
    camion: {
      id: this.selectedTruck,
    },
    chofer: {
      id: this.selectedDriver,
    },
    cliente: {
      id: this.selectedClient,
    },
    producto: {
      id: this.selectedProduct,
    },
    fechaCargaPrevista: formattedDate,
    preset: this.preset,
  };

  console.log("Enviando orden:", order);

  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_URL}/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    toast.success("Orden creada correctamente");
    console.log("Orden creada:", response.data);
    this.obtainOrders().then((data) => {
      this.orders = data;
    });
  } catch (error) {
    toast.error("Hubo un error al crear la orden");
    console.error("Error al crear la orden:", error);
  }
  this.closeModal("nuevaOrdenModal");
},
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
          `${process.env.VUE_APP_API_URL}/orders/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        await this.obtainAlarms();
        console.log("Órdenes obtenidas:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        return [];
      }
    },
    async obtainDrivers() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/drivers/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("Choferes obtenidos:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener los choferes:", error);
        return [];
      }
    },
    async obtainClients() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/clients/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("Clientes obtenidos:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
        return [];
      }
    },
    async obtainTrucks() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/trucks/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("Camiones obtenidos:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener los camiones:", error);
        return [];
      }
    },
    async obtainProducts() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/products/list`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("Productos obtenidos:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener los productos:", error);
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

#closeButton {
  background-color: red;
}

</style>
