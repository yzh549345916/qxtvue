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
        <v-row dense align="center" justify="center">
          <v-col align="center" justify="center" cols="11">
            {{ titleText }}
          </v-col>

          <v-col cols="1"  >
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
        <v-row dense align="center" v-if="highBs" justify="center">
          <v-col cols="1">
          </v-col>
          <v-col cols="2">
            预报层次
          </v-col>
          <v-col cols="1">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="lastHeight"
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-chevron-up-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>上一层次</span>
            </v-tooltip>
          </v-col>
          <v-col cols="2">
            <v-select
                :items="heights"
                label="高度层次"
                v-model="heightSelectValue"
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="nextHeight"
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-chevron-down-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>下一层次</span>
            </v-tooltip>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-fab-transition>

  </div>


</template>

<script>
export default {
  name: "地图起报时间组件",
  data: function () {
    return {
      menu1: false,
      menu2: false,
      SCitems: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72],
      heights:[],
      ScSelectValue: -1,
      heightSelectValue: -1,
      dateTime: {
        date1: new Date(new Date().getTime()- 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-'),
        time1: "20:00",
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
      if (this.dataType === "亚洲沙尘模式") {
        this.SCitems.splice(0,this.SCitems.length);
        for(let i=3;i<=168;i+=3){
          this.SCitems.push(i)
        }
        if(this.highBs){
          this.heights.splice(0,this.heights.length);
          for(let i=100;i<=1000;i+=50){
            this.heights.push(i);
          }
          if(this.heights.length>9){
            this.heightSelectValue=this.heights[8];
          }
          else if(this.heights.length>3){
            this.heightSelectValue=this.heights[2];
          }
        }
      }else if(this.dataType === "区台沙尘模式") {
        this.SCitems.splice(0,this.SCitems.length);
        for(let i=1;i<=48;i+=1){
          this.SCitems.push(i)
        }
      }
      else if(this.dataType === "京津冀") {
        this.SCitems.splice(0,this.SCitems.length);
        if(this.dataTypeStr==="aqi"){
          for(let i=24;i<=96;i+=24){
            this.SCitems.push(i)
          }
        }else{
          for(let i=0;i<=96;i+=1){
            this.SCitems.push(i)
          }
        }
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
      if (this.dataType === "亚洲沙尘模式") {
        this.qbTimeSpan = this.qbTimeSpan - 12 * 60 * 60 * 1000;
        var date = new Date(this.qbTimeSpan);
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }else if (this.dataType === "区台沙尘模式"||this.dataType === "京津冀") {
        this.qbTimeSpan = this.qbTimeSpan - 24 * 60 * 60 * 1000;
        date = new Date(this.qbTimeSpan);
        if(date.getHours()!==20){
          date.setHours(20);
          this.qbTimeSpan=date.getTime();
        }
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }
    },
    lastYbTime: function () {
      if (this.dataType === "亚洲沙尘模式") {
        var timespnMin = this.ybTimeSpan - 3 * 60 * 60 * 1000;
        if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMin;
      }else if (this.dataType === "区台沙尘模式") {
        timespnMin = this.ybTimeSpan - 1 * 60 * 60 * 1000;
        if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMin;
      }
      else if (this.dataType== "京津冀") {
        if(this.dataTypeStr==="aqi"){
          timespnMin = this.ybTimeSpan - 24 * 60 * 60 * 1000;
          if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
            return;
          }
        }else{
          timespnMin = this.ybTimeSpan - 1 * 60 * 60 * 1000;
          if (timespnMin < this.qbTimeSpan + this.SCitems[0] * 60 * 60 * 1000) {
            return;
          }
        }
        this.ybTimeSpan = timespnMin;
      }
    },
    nextYbTime: function () {
      if (this.dataType === "亚洲沙尘模式") {
        var timespnMax = this.ybTimeSpan + 3 * 60 * 60 * 1000;
        if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMax;
      }else if (this.dataType === "区台沙尘模式") {
        timespnMax = this.ybTimeSpan + 1 * 60 * 60 * 1000;
        if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
          return;
        }
        this.ybTimeSpan = timespnMax;
      }else if (this.dataType === "京津冀") {
        if(this.dataTypeStr==="aqi"){
          timespnMax = this.ybTimeSpan + 24 * 60 * 60 * 1000;
          if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
            return;
          }
          this.ybTimeSpan = timespnMax;
        }else{
          timespnMax = this.ybTimeSpan + 1 * 60 * 60 * 1000;
          if (timespnMax > this.qbTimeSpan + this.SCitems[this.SCitems.length - 1] * 60 * 60 * 1000) {
            return;
          }
          this.ybTimeSpan = timespnMax;
        }

      }
    },
    nextTime: function () {
      if (this.dataType === "亚洲沙尘模式") {
        var datemax = new Date();
        datemax.setHours(8, 0, 0, 0)
        var timespnMax = datemax.getTime();
        this.qbTimeSpan = this.qbTimeSpan + 12 * 60 * 60 * 1000;
        if (this.qbTimeSpan > timespnMax) {
          this.qbTimeSpan = timespnMax
        }
        var date = new Date(this.qbTimeSpan);
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }else if (this.dataType === "区台沙尘模式"||this.dataType === "京津冀") {
        datemax = new Date(new Date().getTime() - 24*60*60*1000);
        datemax.setHours(20, 0, 0, 0)
         timespnMax = datemax.getTime();
        this.qbTimeSpan = this.qbTimeSpan + 24 * 60 * 60 * 1000;
        if (this.qbTimeSpan > timespnMax) {
          this.qbTimeSpan = timespnMax
        }
        date = new Date(this.qbTimeSpan);
        if(date.getHours()!==20){
          date.setHours(20);
          this.qbTimeSpan=date.getTime();
        }
        this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
        this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      }
    },
    nextHeight(){
      for(let i=0;i<this.heights.length-1;i++){
        if(this.heights[i]===this.heightSelectValue){
          this.heightSelectValue=this.heights[i+1];
          break;
        }
      }
      if(this.heightSelectValue===-1){
        this.heightSelectValue=this.heights[0]
      }
    },
    lastHeight(){
      for(let i=1;i<this.heights.length;i++){
        if(this.heights[i]===this.heightSelectValue){
          this.heightSelectValue=this.heights[i-1];
          break;
        }
      }
    },
    YbDateTimeChange: function () {
      var date = new Date(this.ybTimeSpan);
      this.yBdateTimeStr = date.toLocaleDateString().replace(/\//g, '-') + ` ` + date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
      var sVal = Math.round((this.ybTimeSpan - this.qbTimeSpan) / 1000 / 60 / 60);
      if (sVal !== this.ScSelectValue) {
        this.ScSelectValue = sVal;
      }
      this.$emit('datetime-change', this.qbTimeSpan, this.ScSelectValue,this.highBs,this.heightSelectValue);
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
      if(this.lxType==="沙尘模式"){
        this.titleText=this.dataType+'-'+this.dataTypeStr;
        if(this.highBs){
          this.titleText+="-"+this.heightSelectValue+"hPa"
        }
      }
    },
    updateType(){
      if (this.dataType === "亚洲沙尘模式") {
        this.SCitems.splice(0,this.SCitems.length);
        for(let i=3;i<=168;i+=3){
          this.SCitems.push(i)
        }
      }else if(this.dataType === "区台沙尘模式") {
        this.SCitems.splice(0,this.SCitems.length);
        for(let i=1;i<=48;i+=1){
          this.SCitems.push(i)
        }
       var date = new Date(this.qbTimeSpan);
        if(date.getHours()!==20){
          date.setHours(20);
          this.qbTimeSpan=date.getTime();
          this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
          this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
        }
      }else if(this.dataType === "京津冀") {
        this.SCitems.splice(0,this.SCitems.length);
        if(this.dataTypeStr==="aqi"){
          for(let i=24;i<=96;i+=24){
            this.SCitems.push(i)
          }
        }else{
          for(let i=0;i<=96;i+=1){
            this.SCitems.push(i)
          }
        }
        var date = new Date(this.qbTimeSpan);
        if(date.getHours()!==20){
          date.setHours(20);
          this.qbTimeSpan=date.getTime();
          this.dateTime.date1 = date.toLocaleDateString().replace(/\//g, '-');
          this.dateTime.time1 = date.toLocaleTimeString('chinese', {hour12: false}).slice(0, -3);
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

    },
    updatedataTypeStr(){
      if (this.dataType === "亚洲沙尘模式"&&this.dataTypeStr==="CONC_DUST"){
        this.highBs=true;
        this.heights.splice(0,this.heights.length);
        for(let i=100;i<=1000;i+=50){
          this.heights.push(i);
        }
        if(this.heights.length>9){
          this.heightSelectValue=this.heights[8];
        }
        else if(this.heights.length>3){
          this.heightSelectValue=this.heights[2];
        }
      }else if(this.dataType === "京津冀") {
        this.SCitems.splice(0,this.SCitems.length);
        if(this.dataTypeStr==="aqi"){
          for(let i=24;i<=96;i+=24){
            this.SCitems.push(i)
          }
        }else{
          for(let i=0;i<=96;i+=1){
            this.SCitems.push(i)
          }
        }
      }else{
        this.highBs=false;
      }
    },
    heightChange(){
     if(this.highBs&&this.heightSelectValue>0){
       this.$emit('datetime-change', this.qbTimeSpan, this.ScSelectValue,this.highBs,this.heightSelectValue);
     }
    },
  },
  watch: {
    dateTime: {
      handler() {
        this.dateTimeChange();
      },
      deep: true
    },
    heightSelectValue(){
      this.updateTitle()
      this.heightChange();
    },
    ybTimeSpan() {
      this.YbDateTimeChange();
    },
    ScSelectValue() {
      this.ScSChange();
    },
    dataTypeStr(){
      this.updatedataTypeStr()
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
    dataTypeStr: {
      type: String,
      required: true
    },
    lxType: {
      type: String,
      required: true
    },
    highBs: {
      type: Boolean,
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