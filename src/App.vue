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
  font-size: 20px;
}

#app .blackButtons button {
  background-color: black;
  border: 0;
}
body {
  padding-top: 60px;
}
</style>