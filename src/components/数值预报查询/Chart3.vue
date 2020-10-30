
<template>
  <div class="echarts">
    <div style="width:100%;height:300px;" id="chartEl" ref="chartEl"></div>
  </div>
</template>

<script>
import Echarts from 'echarts'
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
    setOption(option){
      this.chart && this.chart.setOption(option)
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