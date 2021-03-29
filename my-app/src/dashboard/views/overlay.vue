<template>
  <div id="webcam_app">
    <div ref="container" id='webRTDiv' v-bind:class='{none : !webcam_on }'
         v-bind:style="{ top: c_webcam.pos.x + 'px', left: c_webcam.pos.y + 'px', width : c_webcam.size.width + 'px', height : c_webcam.size.height + 'px', transform: 'rotate('+running.spin+'deg)' }">
      <video ref="video" id='camBox' v-bind:class='{none : !webcam_on }' autoplay playsinline v-bind:style="{ top: video_css.top + 'px', left: video_css.left + 'px', width : video_css.width + '%', filter : ufilters }"></video>
    </div>
  </div>
</template>
<script>
let moving = false;

import { checkLogin } from '../../services/UserService'
import { getAllRedemptions } from '../../services/RedemptionService'
import { getAllWebcam } from '../../services/WebcamService'
import jQuery from 'jquery'
window.jQuery = jQuery

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      d_webcam: { pos : {x : 0, y : 0}, size : { width : 0, height : 0}},
      c_webcam: { pos : {x : 0, y : 0}, size : { width : 0, height : 0}},
      redemptions: {},
      localVideo : null,
      localStream : null,
      webcam_on: false,
      ufilters: null,
      defaults : {
        cam_bounce: "77",
        cam_bounce_min: "30",
        cam_on: "1",
        cam_on_min: "5",
        cam_rave: "110",
        cam_rave_min: "30",
        filter_blur: 0,
        filter_brightness: 100,
        filter_contrast: 203,
        filter_grayscale: 0,
        filter_hue_rotate: 0,
        filter_invert: 0,
        filter_opacity: 100,
        filter_saturate: 19,
        filter_sepia: 18,
      },
      running : {
        rave : false,
        bounce : false,
        timedCam : false,
        enhanced : 0,
        growth : 0,
        rotations: 0,
        spin : 0, spin_speed : 0
      },
      timers : {
        rave : 0,
        bounce : 0,
        on : 0,
        spin : 0,
        zoom : 0
      },
      hdConstraints: {
        video: {
          width: {
            min: 1280
          },
          height: {
            min: 720
          }
        }
      },
      divVideo : null,
      video_css : {
        width: 100,
        top: 0,
        left: 0
      },
      last_redemption :null
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    webcam: function (data) {
      if(data.last_action == "purchase") {
        this.last_redemption = data.redemption;
        this.timers.on += this.last_redemption.time * 1;
        if(this.webcam_on == false){
          this.turn_on();
        }
        switch (data.redemption.trigger) {
          case 'turn_on':
            //this.turn_on();
            break;
          case 'extend':
            this.extend();
            break;
          case 'zoom_in':
            this.zoom_in();
            break;
          case 'zoom_out':
            this.zoom_out();
            break;
          case 'rave':
            this.rave();
            break;
          case 'bounce':
            this.bounce();
            break;
          case 'spin':
            this.spin();
            break;
          case 'rotate':
            this.rotate();
            break;
          case 'grow':
            this.grow();
            break;
          case 'shrink':
            this.shrink();
            break;
        }
      } else if(data.last_action == "updated"){
        this.d_webcam = data;
        this.c_webcam = this.d_webcam;
      }
    },
    hello: function (data) {
      console.log(data)
    }
  },
  methods: {
    constraints(){
      this.hdConstraints.video.width.min = this.d_webcam.src.width;
      this.hdConstraints.video.height.min = this.d_webcam.src.height;
    },
    countdown(){
      if(this.timers.on > 0){ this.timers.on--; }
      if(this.timers.rave > 0){ this.timers.rave--; }
      if(this.timers.bounce > 0){ this.timers.bounce--; }
      if(this.timers.spin > 0){ this.timers.spin--; }
      if(this.timers.zoom > 0){ this.timers.zoom--; }
      if(this.timers.on > 0){
        let temp = this;
        setTimeout(function(){temp.countdown()}, 1000);
      } else {
        this.webcam_on = false;
        this.turn_off();
        this.reset('size');
        //console.log(this.timers);
      }
      if(this.timers.spin == 0){
        this.reset('angle');
      }
      if(this.timers.rave == 0){
        this.reset('color');
      }
      if(this.timers.zoom == 0){
        this.reset('size');
      }
      if(this.timers.bounce == 0 && moving){
        moving = false;
        //this.reset('position');
      }
    },
    reset(type){
      //todo
      switch(type){
        case 'color':
          this.ufilters = null;
          break;
        case 'position':
            this.c_webcam.pos.x = this.d_webcam.pos.x;
            this.c_webcam.pos.y = this.d_webcam.pos.y;
            this.divVideo.style.left = this.c_webcam.pos.x+"px";
            this.divVideo.style.top = this.c_webcam.pos.y+"px";
          break;
        case 'size':
          this.running.enhanced = 0;
          this.c_webcam.size.width = this.d_webcam.size.width;
          this.c_webcam.size.height = this.d_webcam.size.height;
          this.video_css.width = 100;
          this.video_css.left = 0;
          this.video_css.top =  0;
          break;
        case 'angle':
          this.running.spin = 0;
          this.running.spin_speed = 0;
          break;
      }
    },
    turn_on(){
      if(this.webcam_on == false){
        this.webcam_on = true;
        let temp = this;
        setTimeout(function(){temp.countdown()}, 1000);
        navigator.mediaDevices.getUserMedia(this.hdConstraints)
            .then(this.gotLocalMediaStream).catch(this.handleLocalMediaStreamError);
      }
    },
    turn_off(){
      this.localStream.getVideoTracks()[0].stop();
    },
    extend(){
    },
    //zoom related functionality
    zoom_in(){
      this.timers.zoom += this.last_redemption.time * 1;
      this.running.enhanced++;
      this.zoom_adjust();
    },
    zoom_out(){
      this.timers.zoom += this.last_redemption.time * 1;
      this.running.enhanced--;
      this.zoom_adjust();
    },
    zoom_adjust(){
      this.video_css.width = (100 + this.running.enhanced * 10);
      let width_dif = this.$refs.video.clientWidth - this.$refs.container.clientWidth;
      let height_dif = this.$refs.video.clientHeight - this.$refs.container.clientHeight;
      this.video_css.left = -(width_dif/2);
      this.video_css.top =  -(height_dif/2);
    },

    rave(){
      //this.timers.rave += this.last_redemption.time * 1;
      if(this.timers.rave == 0) {
        this.timers.rave += this.last_redemption.time * 1;
        //this.running.rave = true;
        let filters = '' +
            'blur(' + this.defaults.filter_blur + 'px)' +
            'brightness(' + this.defaults.filter_brightness + '%)' +
            'contrast(' + this.defaults.filter_contrast + '%)' +
            'grayscale(' + this.defaults.filter_grayscale + '%)' +
            'hue-rotate(%hueValue%deg)' +
            'invert(' + this.defaults.filter_invert + '%)' +
            'opacity(' + this.defaults.filter_opacity + '%)' +
            'saturate(' + this.defaults.filter_saturate + '0%)' +
            'sepia(' + this.defaults.filter_sepia + '%)';
        this.rave_loop(filters, 0, 361);
      } else {

        this.timers.rave += this.last_redemption.time * 1;
      }
    },
    rave_loop(filters, i, max){
      let temp = this;
      setTimeout(function() {
        if(temp.timers.rave > 0) {
          temp.ufilters = filters.replace('%hueValue%', i);
          if (i < max) {
            i++;
            temp.rave_loop(filters, i, max);
          } else {
            temp.rave_loop(filters, 0, max);
          }
        } else {
          //reset
        }
      }, 10);
    },

    bounce(){
      //TODO
      if(this.timers.bounce == 0 && !moving) {
        this.timers.bounce += this.last_redemption.time * 1;

        moving = true;

        jQuery("#webRTDiv").marqueeify({
          speed: 300
        });

      } else {
        this.timers.bounce += this.last_redemption.time * 1;
      }
    },
    spin(){
      this.running.spin_speed++;
      if(this.timers.spin == 0){
        this.timers.spin += this.last_redemption.time * 1;
        this.spinning();
      } else {
        this.timers.spin += this.last_redemption.time * 1;
      }
    },
    spinning(){
      if(this.timers.spin > 0){
        let self = this;
        this.running.spin++;
        setTimeout(function(){ self.spinning(); }, ((21-this.running.spin_speed) * 1000 / 360));
      }
    },
    rotate(){
      this.running.rotations++;
      this.running.spin += 90*1;
      this.timers.spin += this.last_redemption.time * 1;
    },
    grow(){
      this.timers.zoom += this.last_redemption.time * 1;
      this.c_webcam.size.width *= 1.1;
      this.c_webcam.size.height *= 1.1;
    },
    shrink(){
      this.timers.zoom += this.last_redemption.time * 1;
      this.c_webcam.size.width *= .9;
      this.c_webcam.size.height *= .9;
    },
    gotLocalMediaStream(mediaStream) {
      this.localStream = mediaStream;
      this.localVideo.srcObject = mediaStream;
    },
    handleLocalMediaStreamError(error) {
      console.log('navigator.getUserMedia error: ', error);
    },
    getAllRedemptions() {
      getAllRedemptions().then(response => {
        this.redemptions = response;
      })
    },
    getAllWebcam() {
      getAllWebcam().then(response => {
        this.d_webcam = response;
        this.c_webcam = response;
        this.constraints();
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
    this.divVideo = document.getElementById('webRTDiv');
    this.localVideo = document.getElementById('camBox');
    let self = this;
    (function ($, window, u) {
      console.log("define marquee", u);
      $.fn.marqueeify = function (options) {
        var settings = $.extend({
          horizontal: true,
          vertical: true,
          speed: 100, // In pixels per second
          container: $("#webcam_app"),
        }, options);

        return this.each(function () {
          var containerWidth, containerHeight, elWidth, elHeight, move, getSizes,
              $el = $(this);

          getSizes = function () {
            containerWidth = settings.container.outerWidth();
            containerHeight = settings.container.outerHeight();
            elWidth = $el.outerWidth();
            elHeight = $el.outerHeight();
          };

          move = {
            right: function () {
              if(moving) {
                $el.animate({left: (containerWidth - elWidth)}, {
                  duration: ((containerWidth / settings.speed) * 1000),
                  queue: false,
                  easing: "linear",
                  complete: function () {
                    move.left();
                  }
                });
              } else {
                self.reset('position');
              }
            },
            left: function () {
              if(moving) {
                $el.animate({left: 0}, {
                  duration: ((containerWidth / settings.speed) * 1000),
                  queue: false,
                  easing: "linear",
                  complete: function () {
                    move.right();
                  }
                });
              } else {
                self.reset('position');
              }
            },
            down: function () {
              if(moving) {
                $el.animate({top: (containerHeight - elHeight)}, {
                  duration: ((containerHeight / settings.speed) * 1000),
                  queue: false,
                  easing: "linear",
                  complete: function () {
                    move.up();
                  }
                });
              } else {
                self.reset('position');
              }
            },
            up: function () {
              if(moving) {
                $el.animate({top: 0}, {
                  duration: ((containerHeight / settings.speed) * 1000),
                  queue: false,
                  easing: "linear",
                  complete: function () {
                    move.down();
                  }
                });
              } else {
                self.reset('position');
              }
            }
          };

          getSizes();

          if (settings.horizontal) {
            move.right();
          } else if(settings.horizontal) {
            move.left();
          }
          if (settings.vertical) {
            move.down();
          } else if(settings.vertical) {
            move.up();
          }

          // Make that shit responsive!
          $(window).resize( function() {
            getSizes();
          });
        });
      };
    })(jQuery, window);

  }
};


</script>

<style>
#webcam_app {
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;
}

#webRTDiv {
  background-color: rgba(0, 0, 0, 0);
  display: block;
  position: absolute;
  overflow: hidden; }
#webRTDiv video {
  width: 100%;
  /*height: 100%;*/
  position: relative;
}
.none {
  display: none;
}
</style>