<template>
  <div>
    <CarouselComponent />
    <!-- Botón de filtro -->
    <div class="blackButtons d-flex justify-content-center">
      <button class="btn custom-button m-2" @click="openFilterModal">
        Filtrar
      </button>
      <button class="btn custom-button m-2" @click="removeFilters">
        Remover Filtros
      </button>

      <!-- Ventana modal de filtro -->
      <div
        ref="filterModal"
        class="modal blackButtons"
        tabindex="-1"
        aria-labelledby="filterModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <!-- Cabecera de la ventana modal -->
            <div class="modal-header">
              <h5 class="modal-title">Filtrar órdenes</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeFilterModal"
                style="background-color: red"
              ></button>
            </div>

            <!-- Cuerpo de la ventana modal -->
            <div class="modal-body">
              <!-- Filtros por fecha -->
              <div class="form-group">
                <label for="fechaInicioInput">Fecha de recepción desde:</label>
                <input
                  type="date"
                  class="form-control"
                  id="fechaInicioInput"
                  v-model="fechaInicioFiltro"
                />
              </div>
              <div class="form-group">
                <label for="fechaFinInput">Fecha de recepción hasta:</label>
                <input
                  type="date"
                  class="form-control"
                  id="fechaFinInput"
                  v-model="fechaFinFiltro"
                />
              </div>

              <!-- Filtros por estado -->
              <div class="form-group">
                <label>Estados de las órdenes:</label>
                <div class="checkboxes-inline">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="estado1Checkbox"
                      v-model="estado1Filtro"
                    />
                    <label class="form-check-label" for="estado1Checkbox"
                      >1</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="estado2Checkbox"
                      v-model="estado2Filtro"
                    />
                    <label class="form-check-label" for="estado2Checkbox"
                      >2</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="estado3Checkbox"
                      v-model="estado3Filtro"
                    />
                    <label class="form-check-label" for="estado3Checkbox"
                      >3</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="estado4Checkbox"
                      v-model="estado4Filtro"
                    />
                    <label class="form-check-label" for="estado4Checkbox"
                      >4</label
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Pie de la ventana modal -->
            <div class="modal-footer">
              <!-- Botón para aplicar los filtros -->
              <button
                type="button"
                class="btn btn-primary"
                @click="applyFilters"
              >
                Aplicar filtros
              </button>
              <!-- Botón para cerrar la ventana modal -->
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeFilterModal"
                style="background-color: red"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal alerta -->
      <div class="modal blackButtons" tabindex="-1" role="dialog" id="alertModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="background-color: red; color: white;">
              <h4 class="modal-title">¡ATENCION, la orden tiene una alarma activa!</h4>
              <button
              type="button"
              class="btn-close bnt-close-white"
              @click="closeModal('alertModal')"
              style="background-color: white"
            ></button>
            </div>
            <div class="modal-body">
              <p> De la aprobacion y deje una descripcion: </p>
              <input
                type="text"
                v-model="alertDescription"
                placeholder="Ingrese la descripción aquí"
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                @click="handleAlertAccept"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-3">
      <div class="d-flex justify-content-between align-items-start mt-4">
        <div class="flex-grow-1 mr-3">
          <table class="table">
            <thead>
              <tr>
                <th @click="toggleSort('id')">
                  Orden
                  <span v-if="sortKey === 'id' && sortAsc">↑</span>
                  <span v-else-if="sortKey === 'id' && !sortAsc">↓</span>
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
                <th>Fecha y hora de carga prevista</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in sortedOrders"
                :key="index"
                :class="{ 'selected-row': selectedOrder === order }"
                @click="selectedOrder = order"
              >
                <td>{{ order.id }}</td>
                <td>
                  {{ order.estado }}
                  <i
                    class="fas fa-exclamation-triangle"
                    style="color: green"
                    v-if="
                      acceptedAlarms.some(
                        (alarm) => alarm.orden.id === order.id
                      )"
                  ></i>
                  <i
                    class="fas fa-exclamation-triangle"
                    style="color: red"
                    v-if="
                      unacceptedAlarms.some(
                        (alarm) => alarm.orden.id === order.id
                      )
                    "
                    @click="handleAlertClick"
                  ></i>
                </td>
                <td>{{ order.patenteCamion }}</td>
                <td>{{ order.preset }}</td>
                <td>{{ order.apellidoChofer }}</td>
                <td>{{ order.nombreProducto }}</td>
                <td>{{ formatDate(order.fechaCargaPrevista) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Botones -->
        <div
          class="fixed-right d-none d-md-flex flex-column mt-5 button-container blackButtons"
        >
          <button
            class="btn custom-button mb-2"
            @click="openModal('pesarCamionModal')"
          >
            Pesar Camion
          </button>
          <button
            type="button"
            class="btn custom-button mb-2"
            @click="openModal('agregarDetalleModal')"
          >
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
            @click="getConciliacion"
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
              style="background-color: red"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Orden: {{ selectedOrder.id }}</h6>
            <h6>Camión: {{ selectedOrder.patenteCamion }}</h6>
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
            <button
              type="button"
              class="btn btn-primary"
              @click="setPesajeInicial"
            >
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('pesarCamionModal')"
              style="background-color: red"
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
              style="background-color: red"
            ></button>
          </div>

          <!-- Cuerpo del modal -->
          <div class="modal-body text-center">
            <p>Se cargaron {{ selectedOrder.pesajeInicial }} Kg</p>
          </div>

          <!-- Pie del modal -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="finalizarCarga"
            >
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('finalizarCargaModal')"
              style="background-color: red"
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
              style="background-color: red"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="masaAcumuladaInput">Masa acumulada:</label>
              <input
                type="number"
                class="form-control"
                id="masaAcumuladaInput"
                v-model="detalle.masaAcumulada"
                placeholder="Ingrese la masa acumulada..."
              />
            </div>
            <div class="form-group">
              <label for="densidadProductoInput">Densidad del producto:</label>
              <input
                type="number"
                class="form-control"
                id="densidadProductoInput"
                v-model="detalle.densidadProducto"
                placeholder="Ingrese la densidad del producto..."
              />
            </div>
            <div class="form-group">
              <label for="temperaturaProductoInput"
                >Temperatura del producto:</label
              >
              <input
                type="number"
                class="form-control"
                id="temperaturaProductoInput"
                v-model="detalle.temperaturaProducto"
                placeholder="Ingrese la temperatura del producto..."
              />
            </div>
            <div class="form-group">
              <label for="caudalInput">Caudal:</label>
              <input
                type="number"
                class="form-control"
                id="caudalInput"
                v-model="detalle.caudal"
                placeholder="Ingrese el caudal..."
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="agregarDetalle"
            >
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('agregarDetalleModal')"
              style="background-color: red"
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
              style="background-color: red"
            ></button>
          </div>
          <div class="modal-body">
            <h6>Orden: {{ selectedOrder.id }}</h6>
            <!-- Access the id property directly -->
            <h6>Camión: {{ selectedOrder.patenteCamion }}</h6>
            <!-- Access the patente property of the camion -->
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
            <button
              type="button"
              class="btn btn-primary"
              @click="setPesajeFinal"
            >
              Aceptar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal('pesajeFinalModal')"
              style="background-color: red"
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
      <div class="modal-header">
        <h4 class="modal-title">Conciliacion</h4>
        <button
          type="button"
          class="btn-close"
          @click="closeModal('verConciliacionModal')"
          style="background-color: red"
        ></button>
      </div>
      <div class="modal-body">
  <h6>Orden: {{ selectedOrder.id }}</h6>
  <h6>Camión: {{ selectedOrder.patenteCamion }}</h6>
  <h6 v-if="conciliacion">Pesaje Inicial: {{ conciliacion.pesajeInicial }}</h6>
  <h6 v-if="conciliacion">Pesaje Final: {{ conciliacion.pesajeFinal }}</h6>
  <h6 v-if="conciliacion">Producto Cargado: {{ conciliacion.productoCargado }}</h6>
  <h6 v-if="conciliacion">Neto Por Balanza: {{ conciliacion.netoPorBalanza }}</h6>
  <h6 v-if="conciliacion">Diferencia Entre Balanza y Caudalímetro: {{ conciliacion.diferenciaEntreBalanzaCaudalimetro }}</h6>
  <h6 v-if="conciliacion">Promedio Temperatura: {{ conciliacion.promedioTemperatura }}</h6>
  <h6 v-if="conciliacion">Promedio Densidad: {{ conciliacion.promedioDensidad }}</h6>
  <h6 v-if="conciliacion">Promedio Caudal: {{ conciliacion.promedioCaudal }}</h6>
  <h6 v-if="conciliacion">Fecha: {{ formatDate(conciliacion.fecha) }}</h6>
</div>
      <!-- Pie del modal -->
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeModal('verConciliacionModal')"
          style="background-color: red"
        >
          Cerrar
        </button>
      </div>
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
              style="background-color: red"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label for="choferInput" class="form-label">Chofer</label>
              <select
                v-model="selectedDriver"
                class="form-select"
                id="choferInput"
              >
                <option
                  v-for="driver in drivers"
                  :key="driver.id"
                  :value="driver.id"
                >
                  {{ driver.nombre }} {{ driver.apellido }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="clienteInput" class="form-label">Cliente</label>
              <select
                v-model="selectedClient"
                class="form-select"
                id="clienteInput"
              >
                <option
                  v-for="client in clients"
                  :key="client.id"
                  :value="client.id"
                >
                  {{ client.razonSocial }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="camionInput" class="form-label">Camión</label>
              <select
                v-model="selectedTruck"
                class="form-select"
                id="camionInput"
              >
                <option
                  v-for="truck in trucks"
                  :key="truck.id"
                  :value="truck.id"
                >
                  {{ truck.patente }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="productoInput" class="form-label">Producto</label>
              <select
                v-model="selectedProduct"
                class="form-select"
                id="productoInput"
              >
                <option
                  v-for="product in products"
                  :key="product.id"
                  :value="product.id"
                >
                  {{ product.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="fechaInput" class="form-label">Fecha</label>
              <div class="d-flex align-items-center">
                <datepicker
                  id="calendario"
                  v-model="fechaSeleccionada"
                ></datepicker>
              </div>
              <label for="horaInput" class="form-label mt-3">Horario</label>
              <div class="d-flex align-items-center">
                <select
                  id="horaInput"
                  v-model="selectedHour"
                  class="form-select ml-2"
                  style="width: 80px"
                >
                  <option v-for="hour in hours" :key="hour" :value="hour">
                    {{ hour < 10 ? "0" + hour : hour }}
                  </option>
                </select>
                <select
                  v-model="selectedMinute"
                  class="form-select ml-2"
                  style="width: 80px"
                >
                  <option
                    v-for="minute in minutes"
                    :key="minute"
                    :value="minute"
                  >
                    {{ minute < 10 ? "0" + minute : minute }}
                  </option>
                </select>
              </div>
              <label for="presetInput" class="form-label mt-3">Preset</label>
              <input
                id="presetInput"
                v-model.number="preset"
                type="number"
                class="form-control"
              />
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
              id="closeButton"
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
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

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
      alertDescription: "",
      modalBackdropVisible: false,
      fechaSeleccionada: new Date(),
      drivers: [],
      clients: [],
      trucks: [],
      products: [],
      conciliacion: null,
      acceptedAlarms: [],
      unacceptedAlarms: [],
      selectedTruck: null,
      selectedDriver: null,
      selectedClient: null,
      selectedProduct: null,
      selectedHour: 0,
      selectedMinute: 0,
      hours: Array.from({ length: 24 }, (v, i) => i),
      minutes: Array.from({ length: 60 }, (v, i) => i),
      preset: null,
      detalle: {
        masaAcumulada: null,
        densidadProducto: null,
        temperaturaProducto: null,
        caudal: null,
      },
      fechaInicioFiltro: null,
      fechaFinFiltro: null,
      estado1Filtro: true,
      estado2Filtro: true,
      estado3Filtro: true,
      estado4Filtro: true,
    };
  },
  async created() {
    try {
      this.drivers = await this.obtainDrivers();
      this.clients = await this.obtainClients();
      this.trucks = await this.obtainTrucks();
      this.products = await this.obtainProducts();
    } catch (error) {
      console.error("Error obtaining data:", error);
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
    async getConciliacion() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/orders/getConciliacion`, {
        params: {
          orderId: this.selectedOrder.id,
        },
        headers: {
          Authorization: `Bearer ${atob(Cookies.get("token"))}`,
        },
      });

      this.conciliacion = response.data;
    } catch (error) {
      console.error("Error al obtener la conciliación:", error);
    }
    this.openModal('verConciliacionModal');
  },
    isAlarmAccepted(orderId) {
      const alarm = this.alarms.find((alarm) => alarm.ordenId === orderId);

      // Si no se encuentra ninguna alarma para la orden, devolvemos false
      if (!alarm) {
        return false;
      }

      // Si la alarma existe y su fechaAccepted es null, la alarma no ha sido aceptada
      const isAccepted = alarm.fechaAccepted !== null;

      // Imprime el resultado
      console.log(`Alarma para la orden ${orderId} aceptada: ${isAccepted}`);

      return isAccepted;
    },
    async handleAlertAccept() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/alarm/accept`,
          {},
          {
            params: {
              ordenId: this.selectedOrder.id,
              descripcion: this.alertDescription,
            },
            headers: {
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
            },
          }
        );

        console.log("Alerta aceptada:", response.data);
        toast.success("Alerta aceptada correctamente");
        this.obtainOrders().then((data) => {
          this.orders = data;
        });
        this.closeModal("alertModal");
      } catch (error) {
        toast.error("Hubo un error al aceptar la alarma");
        console.error("Error al aceptar la alerta:", error);
      }
    },
    handleAlertClick() {
      this.openModal("alertModal", false);
    },
    async obtainAlarms() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/alarm/list`,
          {
            headers: {
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
            },
          }
        );

        this.alarms = response.data;

        // Separamos las alarmas en aceptadas y no aceptadas
        this.acceptedAlarms = this.alarms.filter(
          (alarm) => alarm.fechaAccepted !== null
        );
        this.unacceptedAlarms = this.alarms.filter(
          (alarm) => alarm.fechaAccepted === null
        );

        // Imprime las alarmas obtenidas
        console.log("Alarmas obtenidas:", this.alarms);

        return this.alarms;
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
            },
          }
        );
        toast.success("Detalle agregado correctamente");
        console.log("Detalle agregado:", response.data);
        await this.obtainAlarms();
        await this.obtainOrders().then((data) => {
          this.orders = data;
        });
        this.closeModal("agregarDetalleModal");
      } catch (error) {
        console.error("Error al agregar el detalle:", error);
        toast.error("Hubo un error al agregar el detalle");
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
        toast.error("Hubo un error al establecer el pesaje final");
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
    formatDate(date) {
      return format(parseISO(date), "d 'de' MMMM yyyy, HH:mm'HS'", {
        locale: es,
      });
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
      let formattedDate = "";
      if (this.fechaSeleccionada instanceof Date) {
        formattedDate = `${
          this.fechaSeleccionada.toISOString().split("T")[0]
        }T${String(this.selectedHour).padStart(2, "0")}:${String(
          this.selectedMinute
        ).padStart(2, "0")}:00`;
      }

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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
    if (!this.selectedOrder) {
      toast.error("Se debe seleccionar 1 orden obligatoriamente", {
        timeout: 5000,
      });
      return;
    }

    // Validaciones del estado de la orden
    if (modalId === "pesarCamionModal" && this.selectedOrder.estado !== 1) {
      toast.error(
        "No puede pesar el camión porque la orden está en estado " +
          this.selectedOrder.estado
      );
      return;
    }

    if (
      (modalId === "agregarDetalleModal" ||
        modalId === "finalizarCargaModal") &&
      this.selectedOrder.estado !== 2
    ) {
      toast.error(
        "No puede realizar esta acción porque la orden está en estado " +
          this.selectedOrder.estado
      );
      return;
    }

    if (modalId === "pesajeFinalModal" && this.selectedOrder.estado !== 3) {
      toast.error(
        "No puede realizar el pesaje final porque la orden está en estado " +
          this.selectedOrder.estado
      );
      return;
    }

    if (modalId === "verConciliacionModal" && this.selectedOrder.estado !== 4) {
      toast.error(
        "No puede ver la conciliación porque la orden está en estado " +
          this.selectedOrder.estado
      );
      return;
    }
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

      // Limpiar los campos dependiendo del modal
      switch (modalId) {
        case "pesarCamionModal":
          this.pesoTexto = "";
          break;
        case "agregarDetalleModal":
          this.detalle = {
            masaAcumulada: "",
            densidadProducto: "",
            temperaturaProducto: "",
            caudal: "",
          };
          break;
        case "pesajeFinalModal":
          this.pesoTexto = "";
          break;
        case "nuevaOrdenModal":
          this.selectedDriver = "";
          this.selectedClient = "";
          this.selectedTruck = "";
          this.selectedProduct = "";
          this.fechaSeleccionada = "";
          this.selectedHour = "";
          this.selectedMinute = "";
          this.preset = "";
          break;
        default:
          break;
      }

      const modal = document.getElementById(modalId);
      modal.classList.remove("show");
      this.modalBackdropVisible = false;
      this.obtainOrders().then((data) => {
        this.orders = data;
      });
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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
              Authorization: `Bearer ${atob(Cookies.get("token"))}`,
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

    openFilterModal() {
      // Abre la ventana modal de filtro
      this.$refs.filterModal.classList.add("show");
      // Muestra el fondo oscuro del modal
      this.modalBackdropVisible = true;
    },
    removeFilters() {
      this.fechaInicioFiltro = null;
      this.fechaFinFiltro = null;
      this.estado1Filtro = true;
      this.estado2Filtro = true;
      this.estado3Filtro = true;
      this.estado4Filtro = true;
      this.obtainOrders().then((data) => {
        this.orders = data;
      });
    },
    applyFilters() {
  // Verifica si fechaInicioFiltro o fechaFinFiltro son null
  if (!this.fechaInicioFiltro || !this.fechaFinFiltro) {
    toast.error('Se deben seleccionar obligatoriamente fechas de inicio y fin para filtrar las órdenes');
    return;
  }

  // Pasar las fechas a Date pattern = "yyyy-MM-dd HH:mm:ss"
  if (this.fechaInicioFiltro) {
    this.fechaInicioFiltro = `${this.fechaInicioFiltro} 00:00:00`;
  }
  if (this.fechaFinFiltro) {
    this.fechaFinFiltro = `${this.fechaFinFiltro} 23:59:59`;
  }

  // Aplica los filtros y obtiene las órdenes filtradas
  axios
    .get(`${process.env.VUE_APP_API_URL}/orders/findByStateAndDate`, {
      headers: {
        Authorization: `Bearer ${atob(Cookies.get("token"))}`,
      },
      params: {
        fechaIni: this.fechaInicioFiltro,
        fechaFin: this.fechaFinFiltro,
        state1: this.estado1Filtro,
        state2: this.estado2Filtro,
        state3: this.estado3Filtro,
        state4: this.estado4Filtro,
      },
    })
    .then((response) => {
      this.orders = response.data;
      console.log("Órdenes filtradas:", response.data);
      this.closeFilterModal();
    })
    .catch((error) => {
      console.error("Error al obtener las órdenes filtradas:", error);
    });
  this.closeFilterModal();
},
    closeFilterModal() {
      // Cierra la ventana modal de filtro
      this.$refs.filterModal.classList.remove("show");
      // Oculta el fondo oscuro del modal
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

.selected-row > td {
  background-color: black;
  color: white;
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

.table tbody tr:hover td {
  background-color: gray !important; /* Cambia esto al color gris que prefieras */
}
.checkboxes-inline .form-check {
  display: inline-block;
  margin-right: 50px; /* Espacio entre los checkboxes */
}

/* Estilo para hacer fijo el contenedor de los botones en la posición derecha */
.fixed-right {
  position: fixed;
  top: max-width/2; /* Ajusta este valor según tus necesidades */
  right: 20px; /* Ajusta este valor según tus necesidades */
}

/* Estilo para ocultar el contenedor de los botones en dispositivos pequeños */
@media (max-width: 768px) {
  .fixed-right {
    display: none;
  }
}
</style>
