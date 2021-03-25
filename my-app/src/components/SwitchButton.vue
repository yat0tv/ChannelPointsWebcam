<template>
  <div class="switch-button-control">
    <div class="switch-button" :class="{ enabled: isEnabled }" @click="toggle">
      <div class="button"></div>
    </div>
    <div class="switch-button-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SwitchButton',
  model: {
    prop: "isEnabled",
    event: "toggle"
  },
  /*props: {
    isEnabled: Boolean,
    color: {
      type: String,
      required: false,
      default: "#4D4D4D"
    }
  },*/
  props: ['rewardName', 'isEnabled', 'index'],

  methods: {
    toggle: function() {
      //this.isEnabled = !this.isEnabled;
      //console.log('toggle', this.rewardName , this.isEnabled, !this.isEnabled, this.index[0] );
      this.$emit("toggle", this.rewardName, this.index[0], !this.isEnabled);
    }
  }
}
</script>