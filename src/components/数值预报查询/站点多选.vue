<template>
  <v-container fluid >
    <v-row justify="center" align="center" >
      <v-col cols="1"></v-col>
      <dataTimeZJ @datetime-change='dateTimeChange'></dataTimeZJ>
      <div class="text-center align-content-center">

        <p>预报要素</p>
        <dropdownlist style="width: 150px" v-model="ybysValue"
                      :data-items="dataProducts"
                      :text-field="'ybName'"
                      :value-field="'ybId'"
                      @close="selectClose"
        />
      </div>
      <div class="col-1">
      </div>
      <div class="text-center align-content-center" style="max-height: 50px">
        <p>站点选择</p>
        <kendo-hierarchicaldatasource ref="remoteDataSourceComponent"
                                      transport-read-url="http://localhost:3691/api/GetStations?id=15"
                                      transport-read-data-type="json"
                                      schema-model-id="id"
                                      schema-model-has-children="hasChildren">
        </kendo-hierarchicaldatasource>
        <kendo-dropdowntree style="min-width: 150px;" data-source-ref="remoteDataSourceComponent" data-text-field="name"
                            :placeholder="'请选择...'"
                            checkboxes="true"
                            :filter="'contains'"
                            :autoClose="false"
                            v-model="stationValue"
                            tagMode="single"
                            :messages="stationSelectTag"

        >
        </kendo-dropdowntree>
      </div>
      <v-col cols="3"></v-col>
    </v-row>
    <v-row justify="center" align="center">
      <div v-if="loading" class="k-loading-mask">
        <span class="k-loading-text"> 正在加载数据</span>
        <div class="k-loading-image"></div>
        <div class="k-loading-color"></div>
      </div>
      <v-col cols="12" md="12">
        <Eharts ref="chart1" ></Eharts>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
import Vue from 'vue';
import '@progress/kendo-ui/js/kendo.dataviz.chart'
import {DateinputsInstaller} from '@progress/kendo-dateinputs-vue-wrapper';
import {DropDownList} from '@progress/kendo-vue-dropdowns';
import {DropDownTreeInstaller} from '@progress/kendo-dropdowntree-vue-wrapper';

import Eharts from '@/components/数值预报查询/Echarts基组件'
import {DataSourceInstaller} from '@progress/kendo-datasource-vue-wrapper';
import echarts from 'echarts'
import dataTimeZJ from '@/components/基础组件/日期时间组件'
import {getTodayHourAndMinute, getTodayHourAndMinuteTsp} from "@/assets/js/getTodaytimeFormat";
Vue.use(DataSourceInstaller);
Vue.use(DateinputsInstaller);
Vue.component('dropdownlist', DropDownList);
Vue.use(DropDownTreeInstaller);
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
    text: '动态数据 + 时间坐标轴',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let myStr = '<div style="text-align: center;margin-bottom: 0px">' + echarts.format.formatTime('MM月dd日hh时', params[0].value[0]) + '</div>';
      for (let i = 0; i < params.length; i++) {
        if (i > 0) {
          myStr += '<br/>'
        }
        if (params[i].seriesName === '10米风向预报') {
          myStr += '<div style="width:8px;height:8px;border-radius:50%;display: inline-block;margin-right: 5px;background-color:' + params[i].color + ';"></div><span>' + params[i].seriesName + '：' + params[i].value[2] + '</span>'
        } else {
          myStr += '<div style="width:8px;height:8px;border-radius:50%;display: inline-block;margin-right: 5px;background-color:' + params[i].color + ';"></div><span>' + params[i].seriesName + '：' + params[i].value[1] + '</span>'
        }
      }
      return myStr;
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  legend: {
    left: 10
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
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
      saveAsImage: {},
      magicType: {type: ['line', 'bar']},
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      dataView: {readOnly: false}
    }
  },

  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [{
    name: '预报',
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
    },
  }, {
    name: '实况',
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
      type: 'custom',
      renderItem: renderArrow,
      encode: {
        x: 0,
        y: 1
      },
      z: 10
    },
  ]
};
export default {

  data: function () {
    return {
      myTimeSpan:getTodayHourAndMinuteTsp(),
      stationValue: "",
      ybysValue: "",
      loading: true,
      stationSelectTag:{
        singleTag: "个站点选择",
      },
      dataProducts: [
        {ybName: "温度", ybId: 0},
        {ybName: "最高气温", ybId: 7},
        {ybName: "最低气温", ybId: 8},
        {ybName: "相对湿度", ybId: 1},
        {ybName: "10米风", ybId: 4}

      ]
    }
  },
  methods: {
    dateTimeChange:function (dateTime){
      this.myTimeSpan=dateTime;
    },
    selectClose: function () {
      if (this.ybysValue.ybName != undefined) {
        this.loading = true;
        if (this.stationValue.name != undefined) {
          this.dqszyb(this.stationValue.id);
        } else {
          this.dqszyb('53463');
        }

      }
    },
    dqszyb: function (myID) {
      this.$axios
          .get('/getqtzdybAndSk?id=' + myID + '&datatype=' + this.ybysValue.ybId + '&times=' + this.myTimeSpan)
          // .get('/GETCS')
          .then(res => {
            option1.title.text = res.data.title;
            option1.series[0].name = "";
            option1.series[1].name = "";
            const arr = res.data.ybValue1;
            if (arr === null || arr.length == 0) {
              option1.title.text = "暂无数据";
            } else {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                  arr[i] = undefined;
                }
              }
            }
            option1.series[0].data = arr;
            option1.series[0].name = res.data.yb1Name;
            option1.series[1].data = [];
            option1.series[2].data = [];
            if (res.data.skValue1 != undefined && res.data.skValue1 != null) {
              let arr1 = res.data.skValue1;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i] = null;
                }
              }
              option1.series[1].data = arr1;
              option1.series[1].name = res.data.sk1Name;
            }
            if (this.ybysValue.ybId == 4) {
              option1.series[2].data = res.data.ybValue2;
              option1.series[2].name = res.data.yb2Name;
            } else {
              option1.series[2].data = null;
              option1.series[2].name = null;
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
    this.ybysValue = this.dataProducts[0];
    this.dqszyb('53463');
    this.loading = false;

  },
  components: {
    Eharts,
    dataTimeZJ
  },
  watch:{
    myTimeSpan(){
      this.selectClose();
    }
  }


}

</script>
