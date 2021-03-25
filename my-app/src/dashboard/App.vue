<template>
  <div id="app">
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
  @import '../assets/styles/global.css';
</style>