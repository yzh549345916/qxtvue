<template>

  <v-app style="height: 100%;">
    <v-main style="height: 100%;">
      <canvas id="canvas" class="canvas"></canvas>
      <!--<Header :project-name="'数值预报查询'" />-->
      <router-view></router-view>
    </v-main>
    <v-footer absolute>
      <v-row align="center" justify="center"> Copyright © 2020 杨泽华.All Rights Reserved.</v-row>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  components: {

  },

  mounted: function () {
    //这个是钩子函数
    //如果cartView函数要执行，必须先执行钩子函数
    //这个钩子函数完成了对cratView函数的调用
    //应该注意的是，使用mounted 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入       Vue.nextTick/vm.$nextTick
    this.$nextTick(function () {
      this.texiao()
    })
  },
  methods: {
    texiao: function () {
      var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          w = canvas.width = window.innerWidth,
          h = canvas.height = window.innerHeight,

          hue = 217,
          stars = [],
          count = 0,
          maxStars = 1400;

      // Thanks @jackrugile for the performance tip! http://codepen.io/jackrugile/pen/BjBGoM
      // Cache gradient
      var canvas2 = document.createElement('canvas'),
          ctx2 = canvas2.getContext('2d');
      canvas2.width = 100;
      canvas2.height = 100;
      var half = canvas2.width/2,
          gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
      gradient2.addColorStop(0.025, '#fff');
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
      gradient2.addColorStop(1, 'transparent');

      ctx2.fillStyle = gradient2;
      ctx2.beginPath();
      ctx2.arc(half, half, half, 0, Math.PI * 2);
      ctx2.fill();

      // End cache

      function random(min, max) {
        if (arguments.length < 2) {
          max = min;
          min = 0;
        }

        if (min > max) {
          var hold = max;
          max = min;
          min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      var Star = function() {

        this.orbitRadius = random(w / 2 - 50);
        this.radius = random(100, this.orbitRadius) / 10;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 900000;
        this.alpha = random(2, 10) / 10;

        count++;
        stars[count] = this;
      }

      Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed + 1) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius/2 + this.orbitY,
            twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }

      for (var i = 0; i < maxStars; i++) {
        new Star();
      }

      function animation() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
        ctx.fillRect(0, 0, w, h)

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
          stars[i].draw();
        }

        window.requestAnimationFrame(animation);
      }

      animation();


    }

  }
}
</script>

<style lang="scss">

</style>

<style>

.canvas { width: 100%; height: 100%; position: absolute; }
.codrops-demos {
  font-size: 0.8em;
  text-align:center;
  position:absolute;
  z-index:99;
  width:96%;
}

.codrops-demos a {
  display: inline-block;
  margin: 0.35em 0.1em;
  padding: 0.5em 1.2em;
  outline: none;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  border-radius: 2px;
  font-size: 110%;
  border: 2px solid transparent;
  color:#fff;
}

.codrops-demos a:hover,
.codrops-demos a.current-demo {
  border-color: #383a3c;
}

</style>