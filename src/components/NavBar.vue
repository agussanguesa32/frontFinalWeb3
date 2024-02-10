<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a class="nav-link" href="/ordenes">Ordenes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/cargas-actuales">Cargas Actuales</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/conciliaciones">Conciliaciones</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/settings">Configuraciones</a>
          </li>
        </ul>
      </div>
      <a v-if="!isLoggedIn" class="nav-link" href="/login">
        <i class="bi bi-person-fill fs-3"></i>
      </a>
      <span v-if="isLoggedIn && userRole" class="user-role" style="margin-right: 10px;">Tu rol es: {{ userRole }}</span>
      <button v-if="isLoggedIn" class="btn btn-danger" @click="logout" id="logoutButton">Cerrar Sesion</button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState([
      'isLoggedIn',
      'userRole' 
    ])
  },
  methods: {
    ...mapMutations([
      'logout'
    ]),
    ...mapActions([
      'fetchUserRole'
    ]),
    async handleLogout() {
      this.logout();      
    }
  },
  watch: {
    isLoggedIn: function() {
      this.$forceUpdate();
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.fetchUserRole();
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: black;
  color: white;
}
.nav-link {
  color: white;
}
.nav-link:hover {
  color: white;
}

#logoutButton {
  background-color: red;
}
</style>