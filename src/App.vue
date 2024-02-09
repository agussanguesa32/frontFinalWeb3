<template>
  <div id="app">
    <NavBar />
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
#app {
  font-family: 'Anton', sans-serif;
  font-size: 18px;
}

#app .blackButtons button {
  background-color: black;
}
</style>