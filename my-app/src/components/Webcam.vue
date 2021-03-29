<template>
  <div class="container">
    <h2>Webcam Options</h2>
    <table class="table table-bordered" id="v-for-object">
      <thead>
      <tr>
        <th>Title</th>
        <th></th>
        <th></th>
        <!--<th></th>-->
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{webcam_data.src.title}}</td>
        <td><!--{{webcam_data.src.height}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.src.height" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.src.height" v-on:change="onInputChange('src', 'height', $event.target.value)"/>
        </td>
        <td><!--{{webcam_data.src.width}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.src.width" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.src.width" v-on:change="onInputChange('src', 'width', $event.target.value)"/>
        </td>
        <!--<td>3:4 ratio <input type="checkbox" v-model="webcam_data.src.ratio"/></td>-->
      </tr>
      <tr>
        <td>{{webcam_data.pos.title}}</td>
        <td><!--{{webcam_data.pos.x}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.pos.x" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.pos.x" v-on:change="onInputChange('pos', 'x', $event.target.value)"/></td>
        <td><!--{{webcam_data.pos.y}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.pos.y" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.pos.y" v-on:change="onInputChange('pos', 'y', $event.target.value)"/></td>
        <!--<td></td>-->
      </tr>
      <tr>
        <td>{{webcam_data.size.title}}</td>
        <td><!--{{webcam_data.size.height}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.size.height" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.size.height" v-on:change="onInputChange('size', 'height', $event.target.value)"/>
        </td>
        <td><!--{{webcam_data.size.width}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam_data.size.width" v-on:change="updateWebcam">
          <input type="number" v-model="webcam_data.size.width" v-on:change="onInputChange('size', 'width', $event.target.value)"/>
        </td>
        <!--<td>3:4 ratio <input type="checkbox" v-model="webcam_data.size.ratio"/></td>-->
      </tr>
      <!--<tr>
        <td>{{webcam_data.status.title}}</td>
        <td>{{webcam_data.status.on}}</td>
        <td>{{webcam_data.status.time}}</td>
        <td></td>
      </tr>-->
      </tbody>
    </table>
  </div>
</template>


<script>

import {updateWebcam} from "../services/WebcamService";

export default {
  name: 'Webcam',
  components: {
  },
  props: ['webcam_data'],
  methods: {
    onInputChange (name, index, value) {
      console.log(name, index, value)
      this.webcam_data[name][index] = value;
      this.updateWebcam();
    },
    updateWebcam() {
      console.log("Change to webcam detected");
      updateWebcam(this.webcam_data).then(response => {
        console.log(response);
      });
    }
  },
  mounted() {
    console.log("mounted status of webcam", this.webcam_data);
  }
}
</script>