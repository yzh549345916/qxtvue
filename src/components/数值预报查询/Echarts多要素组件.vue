
<template>
  <div class="echarts">
    <div style="width:100%;min-height:1400px;" id="chartEl" ref="chartEl"></div>
  </div>
</template>

<script>
import * as Echarts from 'echarts'
import '../../assets/js/eChartsTheme/yzhBlack'
export default {
  data() {
    return{
      chart: {}
    }
  },
  mounted(){
    this.loadEchart();

    function throttle(func, wait, options) {
      let time, context, args;
      let previous = 0;
      if (!options) options = {};

      let later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        time = null;
        func.apply(context, args);
        if (!time) context = args = null;
      };

      let throttled = function() {
        let now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (time) {
            clearTimeout(time);
            time = null;
          }
          previous = now;
          func.apply(context, args);
          if (!time) context = args = null;
        } else if (!time && options.trailing !== false) {
          time = setTimeout(later, remaining);
        }
      };
      return throttled;
    }
    // 添加窗口改变监听
    var chart = this.chart;
    this.chart.__resize = throttle(function(){
      chart.resize();
    },200);

    setTimeout(() => {
      window.addEventListener('resize',this.chart.__resize);
    }, 200);
  },
  methods: {
    loadEchart() {
      this.chart = Echarts.init(this.$refs.chartEl,'yzhBlack');
    },
    showload() {
      this.chart.showLoading({
        text: '正在加载数据' ,
        textColor: '#000',
        maskColor: 'rgba(227,239,248,0.6)',
        // 字体大小。从 `v4.8.0` 开始支持。
        fontSize: 50,
        // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
        showSpinner: true,
        // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
        spinnerRadius: 50,
        // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
        lineWidth: 5
      });
    },
    hideload() {
      this.chart.hideLoading();
    },
    setOption(option){

      setTimeout(() => {
        try {

          this.chart && this.chart.setOption(option,true);
        } catch (error) { console.log(error);}
      }, 500)
      //可以设置重新加载动画
     /* this.chart.clear();
      this.chart.setOption(option,true);*/
    }
  },
  beforeDestroy() {
    // 移除窗口改变监听
    window.removeEventListener('resize',this.chart.__resize);
  }
}
</script>

<style>
</style>