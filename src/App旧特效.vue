<template>

    <v-app>
        <v-main >
          <canvas></canvas>
            <!--<Header :project-name="'数值预报查询'" />-->
          <router-view></router-view>
        </v-main>
        <v-footer absolute>
          <v-row align="center" justify="center"> Copyright © 2020 杨泽华.All Rights Reserved.</v-row>
        </v-footer>
    </v-app>
</template>

<script>
    import $ from 'jquery'
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
                var canvas = document.querySelector('canvas'),
                    ctx = canvas.getContext('2d')
                canvas.width = window.outerWidth;
                canvas.height = window.outerHeight;
                ctx.lineWidth = .3;
                ctx.strokeStyle = (new Color(150)).style;

                var mousePosition = {
                    x: 30 * canvas.width / 100,
                    y: 30 * canvas.height / 100
                };

                var dots = {
                    nb: 750,
                    distance: 50,
                    d_radius: 100,
                    array: []
                };

                function colorValue(min) {
                    return Math.floor(Math.random() * 255 + min);
                }

                function createColorStyle(r,g,b) {
                    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
                }

                function mixComponents(comp1, weight1, comp2, weight2) {
                    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
                }
                function averageColorStyles(dot1, dot2) {
                    var color1 = dot1.color,
                        color2 = dot2.color;

                    var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
                        g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
                        b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
                    return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
                }

                function Color(min) {
                    min = min || 0;
                    this.r = colorValue(min);
                    this.g = colorValue(min);
                    this.b = colorValue(min);
                    this.style = createColorStyle(this.r, this.g, this.b);
                }

                function Dot(){
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;

                    this.vx = -.5 + Math.random();
                    this.vy = -.5 + Math.random();

                    this.radius = Math.random() * 2;

                    this.color = new Color();
                    console.log(this);
                }

                Dot.prototype = {
                    draw: function(){
                        ctx.beginPath();
                        ctx.fillStyle = this.color.style;
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                        ctx.fill();
                    }
                };

                function createDots(){
                    for(var i = 0; i < dots.nb; i++){
                        dots.array.push(new Dot());
                    }
                }

                function moveDots() {
                    for( var i = 0; i < dots.nb; i++){

                        var dot = dots.array[i];

                        if(dot.y < 0 || dot.y > canvas.height){
                            dot.vx = dot.vx;
                            dot.vy = - dot.vy;
                        }
                        else if(dot.x < 0 || dot.x > canvas.width){
                            dot.vx = - dot.vx;
                            dot.vy = dot.vy;
                        }
                        dot.x += dot.vx;
                        dot.y += dot.vy;
                    }
                }

                function connectDots() {
                    for(var i = 0; i < dots.nb; i++){
                        for(var j = 0; j < dots.nb; j++){
                           var i_dot = dots.array[i];
                             var j_dot = dots.array[j];

                            if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
                                if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
                                    ctx.beginPath();
                                    ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                                    ctx.moveTo(i_dot.x, i_dot.y);
                                    ctx.lineTo(j_dot.x, j_dot.y);
                                    ctx.stroke();
                                    ctx.closePath();
                                }
                            }
                        }
                    }
                }

                function drawDots() {
                    for(var i = 0; i < dots.nb; i++){
                        var dot = dots.array[i];
                        dot.draw();
                    }
                }

                function animateDots() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    moveDots();
                    connectDots();
                    drawDots();

                    requestAnimationFrame(animateDots);
                }
                $('canvas').on('mousemove', function(e){
                    mousePosition.x = e.pageX;
                    mousePosition.y = e.pageY;
                });

                $('canvas').on('mouseleave', function(e){
                    mousePosition.x = canvas.width / 2;
                    mousePosition.y = canvas.height / 2;
                });

                createDots();
                requestAnimationFrame(animateDots);
            }

        }
    }
</script>

<style lang="scss">
    @import './assets/styles/variables.scss';
</style>
<style>
       canvas { width: 100%; height: 100%; position: absolute; }

</style>