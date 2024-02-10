<template>
  <div class="m-3"> 
    <div class="d-flex justify-content-between align-items-start mt-4"> 
      <div class="flex-grow-1 mr-3">
        <h1 class="text-center mb-4">Conciliaciones</h1>
        <table class="table">
          <thead>
            <tr>
              <th @click="toggleSort('id')">Id
                <span v-if="sortKey === 'id' && sortAsc">↑</span>
                <span v-else-if="sortKey === 'id' && !sortAsc">↓</span>
              </th>
              <th>Fecha</th>
              <th>Pesaje Inicial</th>
              <th>Pesaje Final</th>
              <th>Producto Cargado</th>
              <th>Caudal Promedio</th>
              <th>Densidad Promedio</th>
              <th>Temperatura Promedio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(conciliation, index) in sortedConciliations" :key="index">
              <td>{{ conciliation.id }}</td>
              <td>{{ formatDate(conciliation.fecha) }}</td>
              <td>{{ conciliation.pesajeInicial }}</td>
              <td>{{ conciliation.pesajeFinal }}</td>
              <td>{{ conciliation.productoCargado }}</td>
              <td>{{ conciliation.promedioCaudal }}</td>
              <td>{{ conciliation.promedioDensidad }}</td>
              <td>{{ conciliation.promedioTemperatura }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      conciliations: [],
      sortKey: 'id',
      sortAsc: true,
    };
  },
  computed: {
    sortedConciliations() {
      return [...this.conciliations].sort((a, b) => (this.sortAsc ? a[this.sortKey] - b[this.sortKey] : b[this.sortKey] - a[this.sortKey]));
    },
  },
  methods: {
    formatDate(date) {
      return format(parseISO(date), "d 'de' MMMM yyyy, HH:mm'HS'", { locale: es });
    },
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async fetchConciliations() {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/conciliations/list`,
      {
        headers: {
          Authorization: `Bearer ${atob(Cookies.get("token"))}`,
        },
      }
    );
    this.conciliations = response.data;
  } catch (error) {
    console.error("Error al obtener las conciliaciones:", error);
  }
},
  },
  created() {
    this.fetchConciliations();
  },
};
</script>

<style scoped>

</style>