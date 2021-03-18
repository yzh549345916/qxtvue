<template>
  <div id="mapqbTime">
    <v-tooltip bottom v-if="hidebs">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            elevation=20
            fab
            small
            @click="hidebs=false"
            v-bind="attrs"
            v-on="on"
        >
          <v-icon class>mdi-calendar-clock</v-icon>
        </v-btn>
      </template>
      <span>单击显示预报时间工具栏</span>
    </v-tooltip>
    <v-fab-transition>
      <v-card style="background-color: #0f0f0f40;min-width: 32em;" v-if="!hidebs">
        <v-row dense justify="end">
          <v-spacer></v-spacer>
          <v-col cols="7">
            {{ titleText }}预报时间
          </v-col>
          <v-col cols="1" offset="2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="hidebs=true"
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-minus-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>隐藏</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row dense align="center" justify="center">
          <v-spacer></v-spacer>
          <v-col cols="2">
            起报时间
          </v-col>
          <v-col cols="2">
            <v-row>
              <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"

                  transition="scale-transition"
                  offset-y
              >
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                          icon
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                      >
                        <v-icon>mdi-calendar</v-icon>
                      </v-btn>
                    </template>
                    <span>选择起报日期</span>
                  </v-tooltip>
                </template>
                <v-date-picker v-model="dateTime.date1" locale="zh-cn" :first-day-of-week="0" color="primary"
                               @input="menu1 = false"></v-date-picker>
              </v-menu>
              <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
              >
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                          icon
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                      >
                        <v-icon>mdi-clock-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>选择起报时次</span>
                  </v-tooltip>
                </template>
                <v-time-picker
                    v-if="menu2"
                    v-model="dateTime.time1"
                    format="24hr"
                    scrollable
                    color="primary"
                    :allowed-hours="allowedHours"
                    :allowed-minutes="allowedMinutes"
                    @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row align="center" justify="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="lastTime"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-chevron-left-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>上一时次</span>
              </v-tooltip>
              <v-text-field
                  :value="dateTime.date1+`  `+dateTime.time1"
                  readonly
                  type="text"
                  dense
              >
              </v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="nextTime"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-chevron-right-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>下一时次</span>
              </v-tooltip>
            </v-row>

          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row dense align="center" justify="center">
          <v-spacer></v-spacer>
          <v-col cols="2">
            预报时间
          </v-col>
          <v-col cols="2">
            <v-row>
              <v-col cols="10">
                <v-select
                    :items="SCitems"
                    label="时次"
                    v-model="ScSelectValue"
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row align="center" justify="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="lastYbTime"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-chevron-left-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>上一时次</span>
              </v-tooltip>
              <v-text-field
                  :value="yBdateTimeStr"
                  readonly
                  type="text"

              >
              </v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="nextYbTime"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-chevron-right-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>下一时次</span>
              </v-tooltip>
            </v-row>

          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-fab-transition>

  </div>


</template>

<script>
import {getTodayHourAndMinute} from "@/assets/js/getTodaytimeFormat";
import {ecIntToStr} from "@/assets/js/yaoSuDuiZhao";
export default {
  name: "地图起报时间组件",
  data: function () {
    return {
      menu1: false,
      menu2: false,
      SCitems: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72],
      ScSelectValue: -1,
      dateTime: {
        date1: new Date().toISOString().substr(0, 10),
        time1: getTodayHourAndMinute(),
      },
      yBdateTimeStr: "",
      qbTimeSpan: 0,
      ybTimeSpan: 0,
      hidebs: false,
      titleText:""
    }
  },
  mounted() {
    this.timCSH();
    this.updateTitle()
  },
  methods: {
    timCSH: function () {
      this.qbTimeSpan = (new Date((this.dateTime.date1 + " " + this.dateTime.time1 + ":00").substring(0, 19).replace(/-/g, '/'))).getTime();
      if (this.dataType === "区台新方法") {
        this.SCitems = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72];
      }else if(this.dataType === "RMAPS") {
        var myTime=this.dateTime.time1.substring(0, 2);
        if(myTime==="08"){
          this.SCitems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72];
        }else{
          this.SCitems = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96];
        }
      }
      else if (this.dataType === "EC") {
        var scArr=[];
        for(var i=0;i<=240;){
          scArr.push(i);
          if(i<72){
            i+=3;
          }else{
            i+=6;
          }
        }
        this.SCitems = scArr;
      }
      this.ScSelectValue = this.SCitems[0];
      this.ybTimeSpan = this.qbTimeSpan + this.ScSelectValue * 60 * 60 * 1000;
      var date = new Date(this.ybTimeSpan);
      this.yBdateTimeStr = date.toLocaleDateString().replace(/\//g, '-') + ` ` + date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
    },
    dateTimeChange: function () {
      var qbTimeSpan1 = (new Date((this.dateTime.date1 + " " + this.dateTime.time1 + ":00").substring(0, 19).replace(/-/g, '/'))).getTime();
      if (this.qbTimeSpan !== qbTimeSpan1) {
        this.qbTimeSpan = qbTimeSpan1
      }
      var timespnMax = this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000;
      var timespnMin = this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000;
      if (this.ybTimeSpan > timespnMax) {
        this.ybTimeSpan = timespnMax;
        return;
      } else if (this.ybTimeSpan < timespnMin) {
        this.ybTimeSpan = timespnMin;
        return;
      }
      this.YbDateTimeChange();
    },
    lastTime: function () {
      if (this.dataType === "区台新方法"||this.dataType === "RMAPS"||this.dataType === "EC") {
        this.qbTimeSpan = this.qbTimeSpan - 12 * 60 * 60 * 1000;
        var date = new Date(this.qbTimeSpan);
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }
    },
    lastYbTime: function () {
      if (this.dataType === "区台新方法") {
        var timespnMin = this.ybTimeSpan - 3 * 60 * 60 * 1000;
        if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMin;
      }else if (this.dataType === "RMAPS") {
        timespnMin = this.ybTimeSpan - 1 * 60 * 60 * 1000;
        if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
          return;
        }

        this.ybTimeSpan = timespnMin;
      }
      else if(this.dataType === "EC"){
        var mysx=(this.ybTimeSpan-this.qbTimeSpan)/1000/60/60;
        if(mysx<=72){
          timespnMin = this.ybTimeSpan - 3 * 60 * 60 * 1000;
        }else{
          timespnMin = this.ybTimeSpan - 6 * 60 * 60 * 1000;
        }
        if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMin;
      }
    },
    nextYbTime: function () {
      if (this.dataType === "区台新方法") {
        var timespnMax = this.ybTimeSpan + 3 * 60 * 60 * 1000;
        if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMax;
      }else if (this.dataType === "RMAPS") {
        timespnMax = this.ybTimeSpan + 1 * 60 * 60 * 1000;
        if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMax;
      }
      else if(this.dataType === "EC"){
        var mysx=(this.ybTimeSpan-this.qbTimeSpan)/1000/60/60;
        if(mysx<72){
          timespnMax = this.ybTimeSpan + 3 * 60 * 60 * 1000;
        }else{
          timespnMax = this.ybTimeSpan + 6 * 60 * 60 * 1000;
        }
        if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMax;
      }
    },
    nextTime: function () {
      if (this.dataType === "区台新方法") {
        var datemax = new Date();
        if (datemax.getHours() <= 13) {
          datemax.setHours(8, 0, 0, 0)
        } else {
          datemax.setHours(20, 0, 0, 0)
        }
        var timespnMax = datemax.getTime();
        this.qbTimeSpan = this.qbTimeSpan + 12 * 60 * 60 * 1000;
        if (this.qbTimeSpan > timespnMax) {
          this.qbTimeSpan = timespnMax
        }
        var date = new Date(this.qbTimeSpan);
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }else if (this.dataType === "RMAPS"||this.dataType === "EC") {
        datemax = new Date();
        if (datemax.getHours() <= 13) {
          datemax = new Date(datemax.getTime()-24*60*60*1000);
          datemax.setHours(20, 0, 0, 0)
          datemax.setd
        } else {
          datemax.setHours(8, 0, 0, 0)
        }
         timespnMax = datemax.getTime();
        this.qbTimeSpan = this.qbTimeSpan + 12 * 60 * 60 * 1000;
        if (this.qbTimeSpan > timespnMax) {
          this.qbTimeSpan = timespnMax
        }
        date = new Date(this.qbTimeSpan);
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }
    },
    YbDateTimeChange: function () {
      var date = new Date(this.ybTimeSpan);
      this.yBdateTimeStr = date.toLocaleDateString().replace(/\//g, '-') + ` ` + date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      var sVal = Math.round((this.ybTimeSpan - this.qbTimeSpan) / 1000 / 60 / 60);
      if (sVal !== this.ScSelectValue) {
        this.ScSelectValue = sVal;
      }
      this.$emit('datetime-change', this.qbTimeSpan, this.ScSelectValue);
    },
    ScSChange: function () {
      var mySpn = this.qbTimeSpan + this.ScSelectValue * 60 * 60 * 1000;
      if (mySpn !== this.ybTimeSpan) {
        this.ybTimeSpan = mySpn;
      }
    },
    allowedHours: v => v >= 0 || v <= 24,
    allowedMinutes: v => v === 0,
    updateTitle(){
      if(this.lxType==="站点预报"){
        let ybStr="";
        if (this.dataType === "EC"){
          ybStr=ecIntToStr(this.ybType)
        }
        else{
          if(this.ybType===0){
            ybStr="气温"
          }else if(this.ybType===1){
            ybStr="相对湿度"
          }else if(this.ybType===2){
            ybStr="降水量"
          }else if(this.ybType===4){
            ybStr="10米风"
          }
        }
        this.titleText=this.lxType+'-'+this.dataType+'-'+ybStr+'-';
      }
    },
    updateType(){
      if (this.dataType === "区台新方法") {
        this.SCitems = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72];
      }else if(this.dataType === "RMAPS") {
        var myTime=this.dateTime.time1.substring(0, 2);
        if(myTime==="08"){
          this.SCitems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72];
        }else{
          this.SCitems = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96];
        }
      }
      else if (this.dataType === "EC") {
        var scArr=[];
        for(var i=0;i<=240;){
          scArr.push(i);
          if(i<72){
            i+=3;
          }else{
            i+=6;
          }
        }
        this.SCitems = scArr;
      }
    },
    updateQbtime(){
      if(this.dataType === "RMAPS") {
        var myTime=this.dateTime.time1.substring(0, 2);
        if(myTime==="08"){
          this.SCitems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72];
        }else{
          this.SCitems = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96];
        }
      }
    },
    updateSCSelect(){
      if(this.SCitems.indexOf(this.ScSelectValue)===-1){
        let mycount=0;
        let sp=999;
        for(let i=0;i<this.SCitems.length;i++){
          if(Math.abs(this.SCitems[i]-this.ScSelectValue)<sp){
            sp=Math.abs(this.SCitems[i]-this.ScSelectValue);
            mycount=i;
          }
        }
        this.ScSelectValue=this.SCitems[mycount];

      }

    }
  },
  watch: {
    dateTime: {
      handler() {
        this.dateTimeChange();
        this.updateQbtime();
      },
      deep: true
    },
    ybTimeSpan() {
      this.YbDateTimeChange();
    },
    ScSelectValue() {
      this.ScSChange();
    },
    ybType(){
      this.updateTitle()
    },
    lxType(){
      this.updateTitle()
    },
    dataType(){
      this.updateType()
      this.updateTitle()
    },
    SCitems(){
      this.updateSCSelect()
    }
  },
  props: {
    dataType: {
      type: String,
      required: true
    },
    ybType: {
      type: Number,
      required: true
    },
    lxType: {
      type: String,
      required: true
    },
  }
}
</script>

<style scoped>
#mapqbTime {
  position: absolute;
  max-width: 50%;
  max-height: 20%;
  bottom: 10em;
  left: 4em;
  z-index: 6;
}
</style>