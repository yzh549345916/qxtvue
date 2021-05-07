<template>
  <v-card style="min-width: 500px">
    <v-card-title>
      <v-row dense justify="center">
        <v-col cols="1" align-self="center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
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
            <span>复制</span>
          </v-tooltip>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="6"  align-self="center">
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="搜索"
              single-line
              hide-details
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-card-title>
    <v-data-table
        dense

        class="tag-read"
        :headers="headers"
        :items="datas"
        :search="search"
        :loading="loadingTable"
        loading-text="正在加载数据，请稍候"
    ></v-data-table>
    <v-alert type="success" dense v-model="successAlert" transition="scale-transition" dismissible>
      成功复制数据
    </v-alert>
    <v-alert type="warning" dense v-model="warningAlert" transition="scale-transition" dismissible>
      {{warningText}}
    </v-alert>
  </v-card>
</template>

<script>

export default {
  name: "StationDetails",
  data () {
    return {
      search: '',
      headers: [],
      datas: [],
      successAlert:false,
      warningText:"",
      warningAlert:false,
      loadingTable:false,

    }
  },
  props: {
    dataType: {
      type: Number,
      required: true
    },
    StationID: {
      type: String,
      required: true
    },
    ybType: {
      type: String,
      required: true
    },
    stationYbQbTimespan:{
      type: Number,
      required: true
    },
    stationlevelType:{
      type: Number,
      required: true
    },
    stationlevel:{
      type: Number,
      required: true
    }
  },
  methods: {
    copyData() {
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
                dataStr+=Math.round(myval)+'\t';
              }else{
                dataStr+=myval+'\t';
              }

            })
            dataStr=dataStr.substring(0,dataStr.length-1);
            dataStr=dataStr+'\r\n';
          })

          headerStr=headerStr.substring(0,headerStr.length-1);
          this.copyText(headerStr+'\r\n'+dataStr);
          this.successAlert=true;
        }

      }


    },
    copyText(str) {
      // 判断是否为ie浏览器，此方法只对IE浏览器有用
      if (window.clipboardData) {
        // 清除原有剪切板的数据
        window.clipboardData.clearData();
        // 将内容复制到剪切板
        window.clipboardData.setData("Text", str);
        // 其它浏览器,用别的方法
      } else {
        const el = document.createElement("textarea");
        el.addEventListener("focusin", (e) => e.stopPropagation());
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    },
    closeAlert(){
      this.successAlert=false;
    },
    closeWarringAlert(){
      this.warningAlert=false;
      this.warningText="";
    },

  },
  mounted() {
  },
  watch: {
    StationID() {
      if (this.StationID !== null) {
        this.loadingTable=true;
        var myurl="";
        myurl='/getzdybByTypeStationsQBTime?YBType=' + this.ybType + '&DataTypeID=' + this.dataType + '&StationID=' + this.StationID + '&times=' + this.stationYbQbTimespan+ '&stationlevelType=' + this.stationlevelType+ '&stationlevel=' + this.stationlevel;
        this.$axios
            .get(myurl)
            .then(res => {
              this.headers=res.data.headers;
              this.datas=res.data.datas;
              this.loadingTable=false;
            })
            .catch(err => {
              console.log(err);
              this.loadingTable=false;
            });
      }
    },
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

  }

}
</script>

<style scoped>

</style>