<template>
  <div class="container">
    <h2>Reward Options</h2>
    <table class="table table-bordered" id="v-for-object">
      <thead>
      <tr>
        <th>Name</th>
        <th>Available</th>
        <th>Base Cost</th>
        <th>Additional Time</th>
        <!--th>Scale Cost</th>-->
        <th>ID</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(fields, name) in redemptions" :key="name">
        <td>{{ name }}</td>
        <td>
          <!--{{ fields.available }}-->
          <SwitchButton @toggle="onInputChange" :rewardName="name" :isEnabled="fields.available" :index="['available']"></SwitchButton>
        </td>
        <td><input type="number" :value="fields.cost" name="cost" v-on:change="onInputChange(name, 'cost', $event.target.value)"/></td>
        <td><input type="number" :value="fields.time" name="time" v-on:change="onInputChange(name, 'time', $event.target.value)"/></td>
        <!--<td>
          <SwitchButton @toggle="onInputChange" :rewardName="name" :isEnabled="fields.scaled_cost" :index="['scaled_cost']"></SwitchButton>
        </td>-->
        <td>
          <span class="btn btn-success" v-if="!fields.id" v-on:click="generateReward(name)">Generate</span>
          <span class="btn btn-warning" v-if="fields.id" v-on:click="removeReward(name)">Remove</span>
          <span class="btn btn-primary ml-3" v-on:click="testReward(name)">Test</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script>

import SwitchButton from './SwitchButton.vue'
import {updateRedemption, createReward, removeReward, testReward} from "../services/RedemptionService";

export default {
  name: 'Redemptions',
  components: {
    SwitchButton
  },
  props: ['redemptions'],
  methods: {
    onInputChange (name, index, value) {
      console.log(name, index, value)
      this.redemptions[name][index] = value;
      this.updateRedemption();
    },
    updateRedemption() {
      updateRedemption(this.redemptions).then(response => {
        console.log(response);
      });
    },
    generateReward(title){
      createReward(title).then(response => {
        console.log(response);
        this.$emit("refresh");
      });
    },
    removeReward(title){
      removeReward(title).then(response => {
        console.log(response);
        this.$emit("refresh");
      });
    },
    testReward(title){
      testReward(title).then(response => {
        console.log(response);
      });
    }
    /*onInputChange(name, value){
      console.log(name, value);
    }*/
  },
  mounted() {
    console.log("redemption mounted", this.redemptions);
  }
}
</script>