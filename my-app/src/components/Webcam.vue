<template>
  <div class="container">
    <h2>Webcam Options</h2>
    <table class="table table-bordered" id="v-for-object">
      <thead>
      <tr>
        <th>Title</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{webcam.src.title}}</td>
        <td><!--{{webcam.src.height}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.src.height">
          <input type="number" v-model="webcam.src.height" v-on:change="onInputChange('src', 'height', $event.target.value)"/>
        </td>
        <td><!--{{webcam.src.width}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.src.width">
          <input type="number" v-model="webcam.src.width" v-on:change="onInputChange('src', 'width', $event.target.value)"/>
        </td>
        <td>3:4 ratio <input type="checkbox" v-model="webcam.src.ratio"/></td>
      </tr>
      <tr>
        <td>{{webcam.pos.title}}</td>
        <td><!--{{webcam.pos.x}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.pos.x">
          <input type="number" v-model="webcam.pos.x" v-on:change="onInputChange('pos', 'x', $event.target.value)"/></td>
        <td><!--{{webcam.pos.y}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.pos.y">
          <input type="number" v-model="webcam.pos.y" v-on:change="onInputChange('pos', 'y', $event.target.value)"/></td>
        <td></td>
      </tr>
      <tr>
        <td>{{webcam.size.title}}</td>
        <td><!--{{webcam.size.height}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.size.height">
          <input type="number" v-model="webcam.size.height" v-on:change="onInputChange('size', 'height', $event.target.value)"/>
        </td>
        <td><!--{{webcam.size.width}}-->
          <input type="range" min="0" max="5000" step="1" v-model="webcam.size.width">
          <input type="number" v-model="webcam.size.width" v-on:change="onInputChange('size', 'width', $event.target.value)"/>
        </td>
        <td>3:4 ratio <input type="checkbox" v-model="webcam.size.ratio"/></td>
      </tr>
      <tr>
        <td>{{webcam.status.title}}</td>
        <td>{{webcam.status.on}}</td>
        <td>{{webcam.status.time}}</td>
        <td></td>
      </tr>
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
  props: ['webcam'],
  methods: {
    onInputChange (name, index, value) {
      console.log(name, index, value)
      this.webcam[name][index] = value;
      this.updateWebcam();
    },
    updateWebcam() {
      updateWebcam(this.webcam).then(response => {
        console.log(response);
      });
    }
  }
}
</script>