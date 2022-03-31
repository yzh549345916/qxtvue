<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-spacer></v-spacer>
      <v-col cols="2" style="min-width: 200px" class="text-center align-content-center">
        <DYRHSKJYDatePicker @datetime-change='startDateTimeChange' :time="startDateTimeStr.substring(11, 16)" :mydate="startDateTimeStr.substring(0, 10)" datePickerName="开始日期" timePickerName="开始时间"></DYRHSKJYDatePicker>
      </v-col>
      <v-col cols="2" style="min-width: 200px" class="text-center align-content-center">
        <DYRHSKJYDatePicker @datetime-change='endDateTimeChange' :time="endDateTimeStr.substring(11, 16)" :mydate="endDateTimeStr.substring(0, 10)" datePickerName="结束日期" timePickerName="结束时间"></DYRHSKJYDatePicker>
      </v-col>

      <v-col cols="3" style="min-width: 200px" class="text-center align-content-center">
        <div style="margin-top: 15px">站点类型</div>
        <v-select
            :items="StationTypeitems"
            v-model="StationTypeValue"
            item-text="name"
            item-value="id"
            multiple
            return-object
        >
          <template v-slot:prepend-item>
            <v-list-item
                ripple
                @click="toggle"
            >
              <v-list-item-action>
                <v-icon :color="StationTypeValue.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>全选</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index <= 1">
              <span>{{ item.name }}</span>
            </v-chip>
            <span
                v-if="index === 2"
                class="grey--text caption"
            >(其他{{ StationTypeValue.length - 2 }}个)</span>
          </template>
        </v-select>
      </v-col>
      <v-col cols="1"class="text-center align-content-center">
        <v-btn large @click="cxClick">查  询</v-btn>
      </v-col >
      <v-spacer></v-spacer>
    </v-row>
    <v-row justify="center" align="center">
      <v-card min-width="900">
        <v-card-title>
          <v-row dense justify="center">
            <v-col cols="1" align-self="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      class="btn"
                      color="primary"
                      elevation=20
                      fab
                      small
                      v-bind="attrs"
                      v-on="on"
                      @click="copyData"
                  >
                    <v-icon class>mdi-artstation</v-icon>
                  </v-btn>
                </template>
                <span>复制数据</span>
              </v-tooltip>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-title>
        <v-sheet class="overflow-y-auto"
                 max-height="680">
          <v-data-table
              class="tag-read"
              :headers="headers"
              :items="datas"
              :search="search"
              :loading="loadingTable"
              loading-text="正在加载数据，请稍候"
          >
          </v-data-table>
        </v-sheet>
        <v-alert type="success" dense v-model="successAlert" transition="scale-transition" dismissible>
          成功复制数据
        </v-alert>
        <v-alert type="warning" dense v-model="warningAlert" transition="scale-transition" dismissible>
          {{warningText}}
        </v-alert>
        <v-container></v-container>
        <v-row justify="center" align="center">
          <GongShi>平均绝对误差 = \frac{1}{m}\sum_{i=1}^{m}{|x^i-y^i|} </GongShi>
        </v-row>
        <v-row style="margin-top: 30px;margin-bottom: 30px" justify="center" align="center">
          <GongShi>均方根误差 = \sqrt{\frac{1}{m}\sum_{i=1}^{m}{(x^i-y^i)}^2} </GongShi>
        </v-row>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>
import DYRHSKJYDatePicker from  '@/components/基础组件/DYRHSKJYDatePicker'
import Clipboard from "clipboard";
import {saveAs} from 'file-saver';
import moment from "moment";
import GongShi from '@/components/MSJY/DYRH/GongShi'
export default {
  name: "StationJianYan",
  data: function () {
    return {
      StationTypeitems: [{"name": "国家站","id": "12,13"},{"name": "区域站","id": "14"}],
      StationTypeValue: [{"name": "国家站","id": "12,13"}],
      myStations:[],
      startDateTimeStr:new Date(new Date().getTime()- 24 * 60 * 60 * 1000).toISOString().substring(0, 10)+" 08:00:00",
      endDateTimeStr:new Date().toISOString().substring(0, 10)+" 08:00:00",
      czFilter:0,
      DataTypes: [
        {ybName: "温度", ybId: "TEM"},
        {ybName: "1小时降水", ybId: "PRE_1h"},
        {ybName: "相对湿度", ybId: "RHU"},
        {ybName: "露点温度", ybId: "DPT"},
      ],
      DataTypeSelect:{ybName: "温度", ybId: "TEM"},
      search: '',
      datas: [],
      successAlert:false,
      warningText:"",
      warningAlert:false,
      loadingTable:false,
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.StationTypeValue = []
        } else {
          this.StationTypeValue = this.StationTypeitems.slice()
        }
      })
    },
    copyData() {
      var copyStr=this.datasCopy();
      const clipboard = new Clipboard('.btn', {
        // 点击copy按钮，直接通过text直接返回复印的内容
        text: function() {
          return copyStr;
        }
      });
      this.successAlert=true;
    },
    closeAlert(){
      this.successAlert=false;
    },
    closeWarringAlert(){
      this.warningAlert=false;
      this.warningText="";
    },
    datasCopy(){
      if(this.datas===undefined||this.datas===null||this.datas.length===0){
        this.warningText="暂无数据，复制失败";
        this.warningAlert=true;
      }else{
        if(this.headers.length!==0){

          var myDataa=this.datas;
          var myHeader=this.headers;
          let headerStr='';
          let dataStr='';
          myDataa.forEach(function(value, index){
            // arr中有几项，该匿名回调函数就需要执行几次
            // value —— 数组中的当前项
            // index —— 当前项的索引
            // array —— 原始数组
            myHeader.forEach(function(value2){
              if(index===0){
                headerStr+=value2['text']+'\t';
              }
              var myval=value[value2['value']];
              if(!isNaN(myval)){
                dataStr+= Number(myval).toFixed(3)+'\t';
              }else{
                dataStr+=myval+'\t';
              }

            })
            dataStr=dataStr.substring(0,dataStr.length-1);
            dataStr=dataStr+'\r\n';
          })
          headerStr=headerStr.substring(0,headerStr.length-1);
          return headerStr+'\r\n'+dataStr;
         // this.copyText(headerStr+'\r\n'+dataStr);
          //this.successAlert=true;
        }

      }
    },
    copyText(str) {
      // 判断是否为ie浏览器，此方法只对IE浏览器有用
      if (window.clipboardData) {
        // 清除原有剪切板的数据
        alert('ie')
        window.clipboardData.clearData();
        // 将内容复制到剪切板
        window.clipboardData.setData("Text", str);

        // 其它浏览器,用别的方法
      } else {
        /*const el = document.createElement("textarea");
        el.addEventListener("focusin", (e) => e.stopPropagation());
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);*/
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
        element.setAttribute('download', 'filename.txt');

    }
      },
    startDateTimeChange: function (dateTime) {
      this.startDateTimeStr = dateTime;
    },
    endDateTimeChange: function (dateTime) {
      this.endDateTimeStr = dateTime;
    },
    cxClick: function () {
      var stationLevel="";
      for(let i=0;i<this.StationTypeValue.length;i++){
        stationLevel+=this.StationTypeValue[i].id+',';
      }
      stationLevel=stationLevel.slice(0,-1);
      this.loadingTable=true;
      this.$axios
          .get('getDYRHJianYanTJBystationLevlStrAndsDateStrAndeDateStr?stationLevlStr='+stationLevel+'&sDateStr='+this.startDateTimeStr+'&eDateStr='+this.endDateTimeStr)
          .then(res => {
            let dataAr=[];
           if(res.data!== undefined &&res.data!== null&&res.data.length>0){
             for (let i = 0; i < res.data.length; i++) {
               let item={
                 eleChineseName:"",
                 jzinfo:"",
                 count:0,
                 pjjdwc:0,
                 jfgwc:0,
               };
               item.eleChineseName=res.data[i].eleChineseName;
               item.jzinfo=res.data[i].jzinfo;
               item.count=res.data[i].count;
               item.pjjdwc=res.data[i].pjjdwc;
               item.jfgwc=res.data[i].jfgwc;
               dataAr.push(item);
             }
             this.datas=dataAr;
           }
            this.loadingTable=false;
          })
          .catch(err => {
            console.log(err);
            this.loadingTable=false;
          });

    },
  },
  mounted() {
    this.cxClick();
  },
  computed: {
    likesAllFruit() {
      return this.StationTypeValue.length === this.StationTypeitems.length
    },
    likesSomeFruit() {
      return this.StationTypeValue.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    headers () {
      return [
        {
          "filterable": true,
          "align": "center",
          "value": "eleChineseName",
          "text": "要素名称",
          "sortable": false,
          "divider": true,
          "width": 100
        },
        {
          "filterable": true,
          "align": "center",
          "value": "pjjdwc",
          "text": "平均绝对误差",
          "sortable": true,
          "divider": true,
          "width": 100
        },
        {
          "filterable": true,
          "align": "center",
          "value": "jfgwc",
          "text": "均方根误差",
          "sortable": true,
          "divider": true,
          "width": 100
        }, {
          "filterable": false,
          "align": "center",
          "value": "jzinfo",
          "text": "绝对误差极大值信息",
          "sortable": false,
          "groupable": false,
          "divider": true,
          "width": 250
        }, {
          "filterable": false,
          "align": "center",
          "value": "count",
          "text": "样本总数",
          "sortable": false,
          "groupable": false,
          "divider": true,
          "width": 100
        },
      ]
    },
  },
  watch:{
    successAlert(){
      if(this.successAlert){
        setTimeout(() => {
          this.closeAlert()//关闭提示
        }, 2000);
      }
    },
    warningAlert(){
      if(this.warningAlert){
        setTimeout(() => {
          this.closeWarringAlert()//关闭提示
        }, 2000);
      }
    }
  },
  components: {
    DYRHSKJYDatePicker,
    GongShi
  }

}
</script>

<style scoped>

</style>