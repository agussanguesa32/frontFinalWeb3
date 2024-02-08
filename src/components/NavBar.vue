<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid justify-content-between">
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/ordenes">Ordenes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/cargas-actuales">Cargas Actuales</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/conciliaciones">Conciliaciones</a>
          </li>
        </ul>
      </div>
      <a v-if="!isLoggedIn" class="nav-link" href="/login">
        <i class="bi bi-person-fill fs-3"></i>
      </a>
      <button v-if="isLoggedIn" class="btn btn-danger" @click="logout">Cerrar Sesion</button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState([
      'isLoggedIn'
    ])
  },
  methods: {
    ...mapMutations([
      'logout'
    ]),
    async handleLogout() {
      this.logout();      
    }
  },
  watch: {
    isLoggedIn: function() {
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: #6f42c1;
  color: white;
}
.nav-link {
  color: white;
}
.nav-link:hover {
  color: white;
}
</style>