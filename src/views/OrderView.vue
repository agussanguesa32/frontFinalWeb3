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
                  <th @click="toggleSort('orden')">Orden
                    <span v-if="sortKey === 'orden' && sortAsc">↑</span>
                    <span v-else-if="sortKey === 'orden' && !sortAsc">↓</span>
                  </th>
                  <th @click="toggleSort('estado')">Estado
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
                <tr v-for="(order, index) in sortedOrders" :key="index" :class="{ 'selected-row': order.selected }">
                    <td><input type="checkbox" v-model="order.selected"></td>
                    <td>{{ order.orden }}</td>
                    <td>{{ order.estado }}</td>
                    <td>{{ order.camion }}</td>
                    <td>{{ order.preset }}</td>
                    <td>{{ order.chofer }}</td>
                    <td>{{ order.producto }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="d-flex flex-column flex-shrink-0 ml-3 mt-5 button-container">
            <button class="btn custom-button mb-2">Pesar Camión</button>
            <button class="btn custom-button mb-2">Finalizar Carga</button>
            <button class="btn custom-button mb-2">Pesaje Final</button>
            <button class="btn custom-button">Ver Conciliación</button>
          </div>
        </div>
      </div>
      <button class="btn custom-button fixed-bottom-center">Nueva Orden</button>
    </div>
  </template>
  
  <script>
  import CarouselComponent from '@/components/CarouselComponent.vue'
  
  export default {
    components: {
      CarouselComponent
    },
    data() {
      return {
        orders: this.generateRandomOrders(100),
        sortKey: 'estado',
        sortAsc: true
      }
    },
    computed: {
      sortedOrders() {
        return [...this.orders].sort((a, b) => this.sortAsc ? a[this.sortKey] - b[this.sortKey] : b[this.sortKey] - a[this.sortKey])
      }
    },
    methods: {
      generateRandomOrders(count) {
        const orders = []
        for (let i = 0; i < count; i++) {
          orders.push({
            orden: Math.floor(Math.random() * 1000),
            estado: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
            camion: `Camión ${Math.floor(Math.random() * 100)}`,
            preset: `Preset ${Math.floor(Math.random() * 100)}`,
            chofer: `Chofer ${Math.floor(Math.random() * 100)}`,
            producto: `Producto ${Math.floor(Math.random() * 100)}`,
            selected: false
          })
        }
        return orders
      },
      toggleSort(key) {
        if (this.sortKey === key) {
          this.sortAsc = !this.sortAsc
        } else {
          this.sortKey = key
          this.sortAsc = true
        }
      }
    }
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
  </style>