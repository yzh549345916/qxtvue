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

import Eharts from '@/components/数值预报查询/Echarts基组件'

let option1 = {
  title: {
    text: '新方法多站单要素预报查询',
    subtext: '呼和浩特市气象台',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor:'rgba(16,13,13,0.6)',
    borderWidth:0,
    textStyle:{
      color:'rgba(255,255,255)',
    },
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
export default {
  name: "区局方法多站单要素图表",
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
    ybysValue: {
      type: String,
      required: true
    },
  },
  methods: {
    selectClose: function () {
      if (this.myStationID != undefined&&this.ybysValue!=="") {
        this.loading = true;
        this.dqszyb(this.myStationID);
      }
    },
    dqszyb: function (myID) {
      this.$axios
          .get('/getqtzdybByStations?ids=' + myID + '&datatype=' + this.ybysValue+ '&times=' + this.myTimeSpan)
          .then(res => {
           // option1.title.text = res.data.title;
            option1.series=[];
            if(res.data.length>0){
              option1.title.text = res.data[0].title;
              for(let count=0;count<res.data.length;count++){
                let seriels={};
                seriels.name=res.data[count].yb1Name;
                seriels.type='line';
                seriels.showSymbol=true;
                seriels.hoverAnimation=true;
                let arr = res.data[count].ybValue1;
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


            }else{
              option1.title.text = "暂无数据";
            }

           /* option1.series[0].data = arr;
            option1.series[0].name = res.data.temYbName; data[0].
            if (res.data.temSkValue !== undefined && res.data.temSkValue != null) {
              let arr1 = res.data.temSkValue;
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i][1] >= 99991 || arr1[i][1] <= -99991) {
                  arr1[i][1] = undefined;
                }
              }
              option1.series[1].data = arr1;
              option1.series[1].name = res.data.temSkName;
            }*/


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
    this.dqszyb('53463,53466');
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
    },ybysValue() {
      this.selectClose();
    }
  }


}

</script>
