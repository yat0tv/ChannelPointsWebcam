<template>
  <div class="hello">
    <Header />
    <div class="container mrgnbtm">
    </div>
    <div class="row mrgnbtm">
        <!--<Users v-if="users.length > 0" :users="users" />-->
      <Redemptions :redemptions="redemptions" />
      <Webcam :webcam="webcam" />
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
//import CreateUser from './CreateUser.vue'
//import DisplayBoard from './DisplayBoard.vue'
//import Users from './Users.vue'
import { checkLogin } from '../services/UserService'
import Redemptions from './Redemptions.vue'
import { getAllRedemptions } from '../services/RedemptionService'
import Webcam from './Webcam.vue'
import { getAllWebcam } from '../services/WebcamService'

export default {
  name: 'Dashboard',
  components: {
    Header,
    Redemptions,
    Webcam,
  },
  data() {
      return {
          //users: [],
          //numberOfUsers: 0
          webcam: {},
          redemptions: {}
      }
  },
  methods: {
    getAllRedemptions() {
      getAllRedemptions().then(response => {
        console.log(response)
        this.redemptions = response;
        //this.users = response
        //this.numberOfUsers = this.users.length
      })
    },
    getAllWebcam() {
      getAllWebcam().then(response => {
        console.log(response)
        this.webcam = response;
        //this.users = response
        //this.numberOfUsers = this.users.length
      })
    },
    checkLogin() {
      checkLogin().then(response => {
        if(response){
          this.getAllRedemptions();
          this.getAllWebcam();
        } else {
          window.location.href = 'http://localhost:8080/api/login';
        }
      })
    }
  },
  mounted () {
    this.checkLogin();
  }
}
</script>