<template>
  <v-container>
    <v-row justify="center" align="center">
      <div v-if="loading" class="k-loading-mask">
        <span class="k-loading-text"> 正在加载数据</span>
        <div class="k-loading-image"></div>
        <div class="k-loading-color"></div>
      </div>
      <v-col cols="12" md="12">
        <Eharts ref="chart1"></Eharts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Eharts from '@/components/数值预报查询/Echarts多要素组件'
import echarts from 'echarts'

var directionMap = {};

echarts.util.each(
    ['西风', '西南风', '南风', '东南风', '东风', '东北风', '北风', '西北风', '静风'],
    function (name, index) {
      directionMap[name] = Math.PI / 4 * index;
    }
);

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

let option1 = {
  title: {
    text: '新方法单站多要素预报查询',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {

      let myStr = '<div style="text-align: center;margin-bottom: 0px">' + echarts.format.formatTime('MM月dd日hh时', params[0].value[0]) + '</div>';
      let btStr='<table border="1" style="min-width: 300px" width="100%"><tr><th width="30%" style="text-align:center;">要素名称</th><th width="20%" style="text-align:center;">预报</th><th width="20%" style="text-align:center;">实况</th><th width="30%" style="text-align:center;">预报-实况</th></tr>';
      let myStr3='';
      myStr3+=btStr;
      let strls1='';
      let pName=params[0].seriesName.slice(0,-2);
      let val=0;
      let lastyb='';
      let lastsk='';
      for (let i = 0; i < params.length; i++){
        if(params[i].value[1]===null){
          pName =params[i].seriesName.slice(0,-2);
          val=params[i].value[1];
          continue;
        }
        let zlName=params[i].seriesName.slice(-2);
        if(params[i].value[0]===params[0].value[0]){
          if(zlName==='预报'){
            if(lastsk!==lastyb){
              strls1+='<td style="text-align:center;">-</td><td style="text-align:center;">-</td></tr>'
              lastsk=lastyb;
            }
            lastyb=params[i].seriesName.slice(0,-2);
            if (lastyb.indexOf('风向') === -1){

              strls1+='<tr>'+'<td style="text-align:center;">'+params[i].seriesName.slice(0,-2)+'</td><td style="text-align:center;"><div style="width:8px;height:8px;border-radius:50%;display: inline-block;margin-right: 5px;background-color:' + params[i].color + ';"></div><span>'+params[i].value[1]+'</span></td>'
            }else{
              strls1+='<tr>'+'<td style="text-align:center;">'+params[i].seriesName.slice(0,-2)+'</td><td style="text-align:center;"><div style="width:8px;height:8px;border-radius:50%;display: inline-block;margin-right: 5px;background-color:' + params[i].color + ';"></div><span>'+params[i].value[2]+'</span></td>'
            }

          }else if(zlName==='实况'){
            lastsk=params[i].seriesName.slice(0,-2);
            if (lastsk.indexOf('风向') === -1){

              let czls=(val-params[i].value[1]).toFixed(1);
              let czStyle='';
              if(czls>0){
                czStyle='color:#f12441;'
              }else if (czls<0){
                czStyle='color:#00ff5c;'
              }else{
                czStyle='color:#02eaf1;'
              }
              strls1+='<td style="text-align:center;"><div style="width:8px;height:8px;border-radius:50%;display: inline-block;margin-right: 5px;background-color:' + params[i].color + ';"></div><span>'+params[i].value[1]+'</span></td><td style="text-align:center;'+czStyle+'">'+(val-params[i].value[1]).toFixed(1)+'</td></tr>'
            }else{
              strls1+='<td style="text-align:center;">'+params[i].value[1]+'</td><td style="text-align:center;">-</td></tr>'
            }

          }

        }
        //此处可新增时间不一致时的显示
        /*else{
          if(strls2.length===0){
            if(lastsk!==lastyb){
              strls1+='<td style="text-align:center;">-</td><td style="text-align:center;">-</td></tr>'
              lastsk=lastyb;
            }
          }

        }*/
        pName =params[i].seriesName.slice(0,-2);
        val=params[i].value[1];
      }
      if(lastsk!==lastyb){
        strls1+='<td style="text-align:center;">-</td><td style="text-align:center;">-</td></tr>'
        lastsk=lastyb;
      }
      myStr3+=strls1

      myStr3+='</table>';
      return myStr+myStr3;
    }
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
  grid: [{
    left: 50,
    right: 50,
    height: '18%'
  }, {
    left: 50,
    right: 50,
    top: '28%',
    height: '18%'
  }, {
    left: 50,
    right: 50,
    top: '52%',
    height: '18%'
  }, {
    left: 50,
    right: 50,
    top: '76%',
    height: '18%'
  }],
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1,2,3],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    },
    {
      type: 'slider',
      xAxisIndex: [0, 1,2,3],
      start: 0,
      end: 100,
      minValueSpan: 3600 * 1 * 1000
    }
  ],
  toolbox: {
    feature: {
      saveAsImage: {},
      magicType: {type: ['line', 'bar']},//, 'stack', 'tiled'
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      dataView: {readOnly: false}
    }
  },
  xAxis:
      [
        {
          type: 'time',
          boundaryGap: false,
          splitNumber: 12
        },
        {
          gridIndex: 1,
          type: 'time',
          boundaryGap: false,
          splitNumber: 12
        },
        {
          gridIndex: 2,
          type: 'time',
          boundaryGap: false,
          splitNumber: 12
        },
        {
          gridIndex: 3,
          type: 'time',
          boundaryGap: false,
          splitNumber: 12
        }
      ],
  yAxis:
      [
        {
          type: 'value',
          name: '气温(℃）',
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        {
          gridIndex: 1,
          type: 'value',
          name: '高低温(℃）',
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        {
          gridIndex: 2,
          type: 'value',
          name: '相对湿度(%)',
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 'bold'
          }
        },
        {
          gridIndex: 3,
          type: 'value',
          name: '风',
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 'bold'
          }
        }
      ],
  series: [
    {
      name: '气温预报',
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#00F260"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#00F260"
        }, {
          offset: 1,
          color: "#0575E6"
        }])
      }
    },
    {
      name: '气温实况',
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#6dd5fa"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#ffffff"
        }, {
          offset: 0.6,
          color: "#6dd5fa"
        }, {
          offset: 1,
          color: "#2980b9"
        }])
      },
    },
    {
      name: '最高气温预报',
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'line',
      showSymbol: true,
      smooth: true,
      hoverAnimation: true,
      lineStyle: {
        width: 3,
      },
      itemStyle: {
        color: "#ea633a"
      },

    },
    {
      name: '最高气温实况',
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'line',

      lineStyle: {
        width: 2,
        type: 'dotted'
      },
      smooth: true,
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#f59b18"
      }
    },
    {
      name: '最低气温预报',
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#3F77FE"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#3F77FE"
        }, {
          offset: 1,
          color: "#02CBF9"
        }])
      }
    },
    {
      name: '最低气温实况',
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#3CD500"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#3CD500"
        }, {
          offset: 1,
          color: "#FFF720"
        }])
      }
    },
    {
      name: '相对湿度预报',
      xAxisIndex: 2,
      yAxisIndex: 2,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#FC466B"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0.1,
          color: "#FC466B"
        }, {
          offset: 1,
          color: "#3F5EFB"
        }])
      }
    },
    {
      name: '相对湿度实况',
      xAxisIndex: 2,
      yAxisIndex: 2,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#feac5e"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#feac5e"
        }, {
          offset: 0.5,
          color: "#c779d0"
        },{
          offset: 1,
          color: "#02CBF9"
        }])
      }
    },
    {
      name: '10米风向预报',
      xAxisIndex: 3,
      yAxisIndex: 3,
      type: 'custom',
      renderItem: renderArrow,
      encode: {
        x: 0,
        y: 1
      },
      z: 10
    },
    {
      name: '10米风速预报',
      xAxisIndex: 3,
      yAxisIndex: 3,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#00c3ff"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#00c3ff"
        }, {
          offset: 1,
          color: "#ffff1c"
        }])
      }
    },
    {
      name: '10米风速实况',
      xAxisIndex: 3,
      yAxisIndex: 3,
      type: 'line',
      showSymbol: true,
      hoverAnimation: true,
      itemStyle: {
        color: "#FCFF00"
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: "#FCFF00"
        }, {
          offset: 1,
          color: "#FFA8A8"
        }])
      },
    }

  ]
};
export default {
  name: "区局方法多要素图表",
  data: function () {
    return {
      loading: true,
    }
  },
  props: {
    myTimeSpan: {
      type: Number,
      required: true
    },
    myStationID: {
      type: String,
      required: true
    },
  },
  methods: {
    selectClose: function () {
      if (this.myStationID != undefined && this.myStationID.length === 5) {
        this.loading = true;
        this.dqszyb(this.myStationID);
      }
    },
    dqszyb: function (myID) {
      this.$axios
          .get('/getqtzdybAndSkWithoutDataType?id=' + myID + '&times=' + this.myTimeSpan)
          .then(res => {
            option1.title.text = res.data.title;
            for (let i = 0; i < option1.series.length; i++) {
              option1.series[i].name = "";
              option1.series[i].data = [];
            }
            let arr = res.data.temYbValue;
            if (arr === null || arr.length == 0) {
              option1.title.text = "暂无数据";
            } else {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                  arr[i][1] = undefined;
                }
              }
            }
            option1.series[0].data = arr;
            option1.series[0].name = res.data.temYbName;
            if (res.data.temSkValue !== undefined && res.data.temSkValue != null) {
              let arr1 = res.data.temSkValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = undefined;
                }
              }
              option1.series[1].data = arr1;
              option1.series[1].name = res.data.temSkName;
            }

            arr = res.data.tmaxYbValue;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                arr[i][1] = null;
              }
            }
            option1.series[2].data = arr;
            option1.series[2].name = res.data.tmaxYbName;
            if (res.data.tmaxSkValue !== undefined && res.data.tmaxSkValue != null) {
              let arr1 = res.data.tmaxSkValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = null;
                }
              }
              option1.series[3].data = arr1;
              option1.series[3].name = res.data.tmaxSkName;
            }

            arr = res.data.tminYbValue;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                arr[i][1] = null;
              }
            }
            option1.series[4].data = arr;
            option1.series[4].name = res.data.tminYbName;
            if (res.data.tminSkValue !== undefined && res.data.tminSkValue != null) {
              let arr1 = res.data.tminSkValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = null;
                }
              }
              option1.series[5].data = arr1;
              option1.series[5].name = res.data.tminSkName;
            }

            arr = res.data.rhuybValue;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                arr[i][1] = null;
              }
            }
            option1.series[6].data = arr;
            option1.series[6].name = res.data.rhuybName;
            if (res.data.rhuskValue !== undefined && res.data.rhuskValue != null) {
              let arr1 = res.data.rhuskValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = null;
                }
              }
              option1.series[7].data = arr1;
              option1.series[7].name = res.data.rhuskName;
            }

            arr = res.data.wind2YbValue;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                arr[i][1] = null;
                arr[i][2] = null;
              }
            }
            option1.series[8].data = arr;
            option1.series[8].name = res.data.wind2YbName;
            option1.series[9].data = arr;
            option1.series[9].name = "10米风速预报";
            if (res.data.wind1SkValue !== undefined && res.data.wind1SkValue != null) {
              let arr1 = res.data.wind1SkValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = null;
                }
              }
              option1.series[10].data = arr1;
              option1.series[10].name = res.data.wind1SkName;
            }

            this.$refs.chart1.setOption(option1);
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
    }


  },
  mounted() {
    this.$refs.chart1.setOption(option1);
    this.dqszyb('53463');
    this.loading = false;

  },
  components: {
    Eharts
  },
  watch: {
    myTimeSpan() {
      this.selectClose();
    },
    myStationID() {
      this.selectClose();
    }
  }


}

</script>
