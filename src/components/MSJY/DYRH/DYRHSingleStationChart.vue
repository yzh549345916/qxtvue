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
import moment from 'moment'

let option1 = {
  title: {
    text: '多源融合实况单站检验',
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
        axisLabel:{
          formatter:{
            year: '{yyyy}',
            month: '{MMM}',
            day: '{d}日{H}时',
            hour: '{d}日{H}时',
            minute: '{HH}:{mm}',
            second: '{HH}:{mm}:{ss}',
            millisecond: '{hh}:{mm}:{ss} {SSS}',
            none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}'
          },
        },
        //X轴最小间隔1小时
        minInterval:60*1000*60,
        splitNumber: 15
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
  name: "DYRHSingleStationChart",
  data: function () {
    return {
      loading: true,
    }
  },
  props: {
    sDateStr: {
      type: String,
      required: true
    },
    eDateStr: {
      type: String,
      required: true
    },
    stationIDs: {
      type: String,
      required: true
    },
    eleName: {
      type: String,
      required: true
    },
    eleChineseName: {
      type: String,
      required: true
    },
  },
  methods: {
    selectClose: function () {
      if (this.stationIDs !== undefined&&this.eleName!=="") {
        this.loading = true;
        this.dqszyb(this.stationIDs);
      }
    },
    dqszyb: function () {
      const url='/getDYRHJianYanByStationIDsStrAndsDateStrAndeDateStr?eleName='+this.eleName+'&stationIDs='+this.stationIDs+'&sDateStr='+this.sDateStr+'&eDateStr='+this.eDateStr;
      this.$axios
          .get(url)
          .then(res => {
           // option1.title.text = res.data.title;
            option1.series=[];
            if(res.data.length>0){
              option1.title.text = moment(this.sDateStr).format('YYYY年MM月DD日HH时') +'至'+moment(this.eDateStr).format('YYYY年MM月DD日HH时')+'多源融合实况检验——'+this.eleChineseName+'——'+this.stationIDs;
              option1.yAxis.name=this.eleChineseName;
              try{
                let serielsDY={};
                serielsDY.name="多源融合实况";
                serielsDY.type='line';
                serielsDY.showSymbol=true;
                serielsDY.hoverAnimation=true;
                let serielsSK={};
                serielsSK.name="站点实况";
                serielsSK.type='line';
                serielsSK.showSymbol=true;
                serielsSK.hoverAnimation=true;
                let arr1=res.data;
                let DYData=[[arr1[0].datetime,arr1[0].dyskvalue]];
                let SKData=[[arr1[0].datetime,arr1[0].stationSKValue]];
                for(let j=1;j<arr1.length;j++){
                  // arrData.push(new Date(arr1[j].datetime.replace(/-/g,'/')),arr1[j].czvalue)
                  DYData.push([arr1[j].datetime,arr1[j].dyskvalue])
                  SKData.push([arr1[j].datetime,arr1[j].stationSKValue])
                }
                serielsDY.data = DYData;
                serielsSK.data = SKData;
                option1.series.push(serielsDY);
                option1.series.push(serielsSK);

/*                for(let count=0;count<res.data.length;count++){
                  let arr = res.data[count].ybValue1;
                  if (!(arr === null || arr.length == 0)) {
                    for (let i = 0; i < arr.length; i++) {
                      if (arr[i][1] < -9999 || arr[i][1] > 9999) {
                        arr[i][1] = undefined;
                      }
                    }
                  }*/


              }
              catch{
                option1.title.text = "暂无数据";
              }


            }else{
              option1.title.text = "暂无数据";
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
    this.dqszyb();
    this.loading = false;
  },
  components: {
    Eharts,
  },
  watch: {
    sDateStr() {
      this.selectClose();
    },
    eDateStr() {
      this.selectClose();
    },
    stationIDs() {
      this.selectClose();
    },
    eleName() {
      this.selectClose();
    }
  }


}

</script>
