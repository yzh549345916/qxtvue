<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="12">
      <Eharts ref="chart1" v-if="displayBs"></Eharts>
    </v-col>
  </v-row>
</template>

<script>
import Eharts from '@/components/数值预报查询/Echarts基组件'
import {
  cuaceDataTypeChineseConvert,
  JingjinjiDataTypeChineseConvert,
  qtShaChenDataTypeChineseConvert
} from "@/assets/js/yaoSuDuiZhao";
import * as echarts from 'echarts';
let option1 = {
  title: {
    text: '大气污染条件联合会商—温度',
    left: 'center',
    top:'25px'
  },
  tooltip: {
    trigger: 'axis',
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  toolbox: {
    feature: {
      saveAsImage: {type:'jpeg'},
      magicType: {type: ['line', 'bar']},//, 'stack', 'tiled'
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      dataView: {readOnly: false}
    }
  },
  xAxis:
      {
        type: 'category',
      },
  yAxis:
      {
        type: 'value',
      },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
    }
  ],
  series: [
    {
      name: '沙尘值',
      type: 'bar',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
export default {
  name: "shaChenStaDetCharts",
  methods: {
    dqszyb: function () {
      //option1.series=[];
      if(this.chartData!==undefined&& this.chartData!==null){
        let seriels={};
        let chineseData="";
        option1.series=[];
        if(this.ybType==="区台沙尘模式"){
          chineseData=qtShaChenDataTypeChineseConvert(this.dataType);
        }else if(this.ybType==="亚洲沙尘模式"){
          chineseData=cuaceDataTypeChineseConvert(this.dataType);
        }else if(this.ybType==="京津冀"){
          chineseData=JingjinjiDataTypeChineseConvert(this.dataType);
        }else{
          return;
        }
        seriels.name=this.chartData[0]["stationName"];
        seriels.type='bar';
        seriels.areaStyle={};
        seriels.itemStyle= {
          color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#0276d9'},
                {offset: 0.5, color: '#06a2f6'},
                {offset: 1, color: '#03bda9'}
              ]
          )
        }
        seriels.showSymbol=true;
        seriels.hoverAnimation=true;
        option1.title.text=this.ybType+"-"+chineseData;
        option1.title.subtext=seriels.name;
        option1.yAxis.name=this.dataType+"("+this.units+")";
        let arrData = [],arrXData=[];
        for (let i = 0; i < this.chartData.length; i++) {
          arrXData.push(this.chartData[i]["timeStr"])
          let dataLS=this.chartData[i]["ybValue1"];
          if(dataLS>=0){
            arrData.push(dataLS)
          }else{
            arrData.push(undefined)
          }
        }

        option1.xAxis.data=arrXData;
        seriels.data = arrData;
        option1.series.push(seriels);
        this.$refs.chart1.setOption(option1);
      }

    }
  },
  mounted() {
    this.dqszyb();
  },
  watch:{
    chartData(){
      this.dqszyb();
    },
  },
  props: {
    chartData: {
      type: Array,
      required: true
    },
    dataType: {
      type: String,
      required: true
    },
    ybType: {
      type: String,
      required: true
    },
    units: {
      type: String,
      required: true
    },
    displayBs:{
      type:Boolean,
      required: true
    },
  },
  components: {
    Eharts
  },
}
</script>

<style scoped>

</style>