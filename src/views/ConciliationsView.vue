<template>
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
                <th>Pesaje Inicial</th>
                <th>Pesaje Final</th>
                <th>Producto Cargado</th>
                <th>Temperatura Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in sortedOrders" :key="index" :class="{ 'selected-row': order.selected }">
                <td><input type="checkbox" v-model="order.selected"></td>
                <td>{{ order.orden }}</td>
                <td>{{ order.estado }}</td>
                <td>{{ order.pesajeInicial }}</td>
                <td>{{ order.pesajeFinal }}</td>
                <td>{{ order.productoCargado }}</td>
                <td>{{ order.temperaturaPromedio }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    components: {
  },
  data() {
    return {
      orders: this.generateRandomOrders(100),
      sortKey: 'estado',
      sortAsc: true,
      selectedOrder: null,
    };
  },
  computed: {
    sortedOrders() {
      return [...this.orders].sort((a, b) => (this.sortAsc ? a[this.sortKey] - b[this.sortKey] : b[this.sortKey] - a[this.sortKey]));
    },
  },
  methods: {
    generateRandomOrders(count) {
      const orders = [];
      for (let i = 0; i < count; i++) {
        orders.push({
          orden: Math.floor(Math.random() * 1000),
          estado: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
          pesajeInicial: [40, 50, 60, 70][Math.floor(Math.random() * 4)],
          pesajeFinal: [40, 50, 60, 70][Math.floor(Math.random() * 4)],
          productoCargado: ['Si', 'No'][Math.floor(Math.random() * 2)],
          temperaturaPromedio: [40, 50, 60, 70][Math.floor(Math.random() * 4)] + '°C',
          selected: false,
        });
      }
      return orders;
    },
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
  },
  };

  </script>
  
  <style scoped>
.selected-row > td {
  background-color: #9575cd;
}

</style>
  