<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12">
        <Eharts ref="chart1"></Eharts>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12">
        <Eharts ref="chart2"></Eharts>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12">
        <Eharts ref="chart3"></Eharts>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12">
        <Eharts ref="chart4"></Eharts>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12">
        <Eharts ref="chart5"></Eharts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Eharts from '@/components/数值预报查询/Echarts基组件'
import echarts from "echarts";
var directionMap = {};
function renderArrow(param, api) {
  var arrowSize = 21;
  var point = api.coord([
    api.value(0),
    api.value(1)
  ]);
  return {
    type: 'path',
    shape: {
      pathData: 'M31 16l-15-15v9h-26v12h26v9z',
      x: -arrowSize / 2,
      y: -arrowSize / 2,
      width: arrowSize,
      height: arrowSize
    },
    rotation: directionMap[api.value(2)],
    position: point,
    style: api.style({
      stroke: '#cef8f8',
      lineWidth: 1
    })
  };
}
echarts.util.each(
    ['西风', '西南风', '南风', '东南风', '东风', '东北风', '北风', '西北风', '静风'],
    function (name, index) {
      directionMap[name] = Math.PI / 4 * index;
    }
);
let option1 = {
  title: {
    text: '大气污染条件联合会商—温度',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '1%',
    right: '65%',
    type: 'scroll',
    pageIconInactiveColor : '#797979',
    pageIconColor : '#ffffff',
    pageTextStyle:{
      color: '#ffffff',
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
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
        type: 'time',
        boundaryGap: false,
        splitNumber: 24
      },
  yAxis:
      {
        type: 'value',
        name: '气温(℃）',
      },
  series: [
    {
      name: '气温预报',
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
let option2 = {
  title: {
    text: '大气污染条件联合会商—相对湿度',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '1%',
    right: '65%',
    type: 'scroll',
    pageIconInactiveColor : '#797979',
    pageIconColor : '#ffffff',
    pageTextStyle:{
      color: '#ffffff',
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
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
        type: 'time',
        boundaryGap: false,
        splitNumber: 24
      },
  yAxis:
      {
        type: 'value',
        name: '相对湿度(%）',
      },
  series: [
    {
      name: '相对湿度',
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
let option3 = {
  title: {
    text: '大气污染条件联合会商—能见度',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '1%',
    right: '65%',
    type: 'scroll',
    pageIconInactiveColor : '#797979',
    pageIconColor : '#ffffff',
    pageTextStyle:{
      color: '#ffffff',
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
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
        type: 'time',
        boundaryGap: false,
        splitNumber: 24
      },
  yAxis:
      {
        type: 'value',
        name: '相对湿度(%）',
      },
  series: [
    {
      name: '相对湿度',
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
let option4 = {
  title: {
    text: '大气污染条件联合会商—降水量',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '1%',
    right: '65%',
    type: 'scroll',
    pageIconInactiveColor : '#797979',
    pageIconColor : '#ffffff',
    pageTextStyle:{
      color: '#ffffff',
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
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
        type: 'time',
        boundaryGap: false,
        splitNumber: 24
      },
  yAxis:
      {
        type: 'value',
        name: '降水量(mm）',
      },
  series: [
    {
      name: '降水量',
      type: 'bar',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
let option5 = {
  title: {
    text: '大气污染条件联合会商—风',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '1%',
    right: '65%',
    type: 'scroll',
    pageIconInactiveColor : '#797979',
    pageIconColor : '#ffffff',
    pageTextStyle:{
      color: '#ffffff',
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
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
        type: 'time',
        boundaryGap: false,
        splitNumber: 24
      },
  yAxis:
      {
        type: 'value',
        name: '风速(m/s）',
      },
  series: [
    {
      name: '风',
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
    }

  ]
};
let fxSerire={
  name: '10米风向预报',
  type: 'custom',
  renderItem: renderArrow,
  encode: {
    x: 0,
    y: 1
  },
  z: 10
};
export default {
  name: "环保局图表",
  data: function () {
    return {

    }
  },
  props: {
    ybTimeSpan: {
      type: Number,
      required: true
    },
    qbTimeSpan: {
      type: Number,
      required: true
    },
  },
  methods: {
    dqszyb: function () {
      this.$axios
          .get('/getZhiNengWangGe?ybDateTimespan=' + this.ybTimeSpan + '&qbDateTimespan=' + this.qbTimeSpan)
          .then(res => {
            // option1.title.text = res.data.title;
            option1.series=[];
            option2.series=[];
            option3.series=[];
            option4.series=[];
            option5.series=[];
            var date = new Date(this.ybTimeSpan);
            var datestr=date.toLocaleDateString().replace(/\//g, '-')+' '+date.getHours()+"时";
            option1.title.text=datestr+"大气污染条件联合会商—温度";
            option2.title.text=datestr+"大气污染条件联合会商—相对湿度";
            option3.title.text=datestr+"大气污染条件联合会商—能见度";
            option4.title.text=datestr+"大气污染条件联合会商—降水量";
            option5.title.text=datestr+"大气污染条件联合会商—风";
            if(res.data.length>0){
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].name;
                seriels.type='line';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].tem;
                if (!(arr === null || arr.length == 0)) {
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                      arr[i][1] = undefined;
                    }
                  }
                }
                seriels.data = arr;
                option1.series.push(seriels);
              }
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].name;
                seriels.type='line';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].rhu;
                if (!(arr === null || arr.length == 0)) {
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                      arr[i][1] = undefined;
                    }
                  }
                }
                seriels.data = arr;
                option2.series.push(seriels);
              }
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].name;
                seriels.type='line';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].vis;
                let arr2=new Array();
                let mycount=0;
                if (!(arr === null || arr.length == 0)) {
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] > -9999 ) {
                      arr2[mycount]=new Array();
                      arr2[mycount][0]=arr[i][0];
                      arr2[mycount][1]=arr[i][1];
                      mycount++;
                    }
                  }
                }
                seriels.data = arr2;
                option3.series.push(seriels);
              }
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].name;
                seriels.type='bar';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].pre;
                if (!(arr === null || arr.length == 0)) {
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                      arr[i][1] = undefined;
                    }
                  }
                }
                seriels.data = arr;
                option4.series.push(seriels);
              }
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].name;
                seriels.type='line';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].wind;
                if (!(arr === null || arr.length == 0)) {
                  for (let i = 0; i < arr.length; i++) {
                    if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                      arr[i][1] = undefined;
                    }
                  }
                }
                seriels.data = arr;
                option5.series.push(seriels);
              }
              let myfx= fxSerire;
              myfx.name="风向";
              myfx.data=res.data[0].wind;
              option5.series.push(myfx);
            }
            this.$refs.chart1.setOption(option1);
            this.$refs.chart2.setOption(option2);
            this.$refs.chart3.setOption(option3);
            this.$refs.chart4.setOption(option4);
            this.$refs.chart5.setOption(option5);
          })
          .catch(err => {
            console.log(err);
          });
    }


  },
  mounted() {
    this.$refs.chart1.setOption(option1);
    this.dqszyb();

  },
  components: {
    Eharts
  },
  watch: {
    ybTimeSpan() {
      this.dqszyb();
    },
    qbTimeSpan() {
      this.dqszyb();
    },
  }


}

</script>
