<template>
  <div id="app">
  </div>
</template>

<script>


export default {
  name: 'app',
  data: {
  },
  created() {
    socket.on('webcam', (data) => {
      console.log(data);
    });
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>