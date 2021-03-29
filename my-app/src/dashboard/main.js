import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import router from './router'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const options = {
    extraHeaders: {"my-custom-header": 'abas'}
}

Vue.use(new VueSocketIO({
      debug: false,
      connection: SocketIO('http://localhost:3000', options), //options object is Optional
    })
);

Vue.config.productionTip = false

new Vue({
  router,
  //store,
  render: h => h(App),
}).$mount('#app')

Vue.use(BootstrapVue);
