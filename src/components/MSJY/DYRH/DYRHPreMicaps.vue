<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="11">
        <v-card>
          <v-row justify="center" align="center">
            <v-spacer></v-spacer>
            <v-col cols="2" style="min-width: 200px" class="text-center align-content-center">
              <DYRHSKJYDatePicker @datetime-change='startDateTimeChange' :time="startDateTimeStr.substring(11, 16)" :mydate="startDateTimeStr.substring(0, 10)" datePickerName="开始日期" timePickerName="开始时间"></DYRHSKJYDatePicker>
            </v-col>
            <v-col cols="2" style="min-width: 200px" class="text-center align-content-center">
              <DYRHSKJYDatePicker @datetime-change='endDateTimeChange' :time="endDateTimeStr.substring(11, 16)" :mydate="endDateTimeStr.substring(0, 10)" datePickerName="结束日期" timePickerName="结束时间"></DYRHSKJYDatePicker>
            </v-col>
            <v-col cols="1"class="text-center align-content-center">
              <v-btn large @click="cxClick" :loading="loadingTable" :disabled="loadingTable">查  询</v-btn>
            </v-col >
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="6">
              <v-progress-linear
                  :active="loadingTable"
                  indeterminate
                  rounded
                  height="25"
              >
                <template v-slot:default="{ value }">
                  <strong>数据加载中</strong>
                </template>
              </v-progress-linear>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row justify="center" align="center">
            <v-spacer></v-spacer>
            <v-col cols="3">
              <v-alert type="success" dense v-model="successAlert" transition="scale-transition" dismissible>
                成功下载数据
              </v-alert>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row justify="center" align="center">
            <v-alert type="warning" dense v-model="warningAlert" transition="scale-transition" dismissible>
              {{warningText}}
            </v-alert>
          </v-row>

        </v-card>
      </v-col>


    </v-row>

  </v-container>
</template>

<script>
import DYRHSKJYDatePicker from  '@/components/基础组件/DYRHSKJYDatePicker'
import moment from 'moment';
export default {
  name: "DYRHPreMicaps",
  data: function () {
    return {
      startDateTimeStr:new Date(new Date().getTime()- 24 * 60 * 60 * 1000).toISOString().substring(0, 10)+" 08:00:00",
      endDateTimeStr:new Date().toISOString().substring(0, 10)+" 08:00:00",
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
    closeAlert(){
      this.successAlert=false;
    },
    closeWarringAlert(){
      this.warningAlert=false;
      this.warningText="";
    },

    startDateTimeChange: function (dateTime) {
      this.startDateTimeStr = dateTime;
    },
    endDateTimeChange: function (dateTime) {
      this.endDateTimeStr = dateTime;
    },
    cxClick: function () {

      const scHour=moment(this.endDateTimeStr).diff(moment(this.startDateTimeStr),'hours');
      if(scHour<=240){
        this.loadingTable=true;
        const config = {
          method: 'get',
          url: 'getDYRHPreBySdateAndEdate?sDateStr='+this.startDateTimeStr+'&eDateStr='+this.endDateTimeStr,
          headers: {
            //和后端设置的一样

          },
          responseType: 'blob'
        };
        this.$axios(config)
            .then(res => {
              let cdStr = typeof res.headers['content-disposition'] === 'undefined'
                  ? res.headers['Content-Disposition'].split(';')[1]
                  : res.headers['content-disposition'].split(';')[1]
              let filename = typeof cdStr.split('fileName=')[1] === 'undefined'
                  ? cdStr.split('filename=')[1]
                  : cdStr.split('fileName=')[1]
              filename=decodeURIComponent(filename);
              filename=filename.slice(1,filename.length-1);
              let url = window.URL.createObjectURL(new Blob([res.data]))
              let a = document.createElement('a')
              a.style.display = 'none'
              a.href = url
              //此处的download是a标签的内容，固定写法，不是后台api接口
              a.setAttribute('download',decodeURIComponent(filename))
              document.body.appendChild(a)
              //点击下载
              a.click()
              // 下载完成移除元素
              document.body.removeChild(a);
              // 释放掉blob对象
              window.URL.revokeObjectURL(url);
              this.loadingTable=false;
              this.successAlert=true;
            })
            .catch(err => {
              console.log(err);
              this.loadingTable=false;
              this.warningText="下载失败";
              this.warningAlert=true;
            });
      }
      else{
        this.warningText="起止时间范围需要小于等于10天，请重新选择起止时间";
        this.warningAlert=true;
      }
    },
  },
  watch:{
    successAlert(){
      if(this.successAlert){
        setTimeout(() => {
          this.closeAlert()//关闭提示
        }, 5000);
      }
    },
    warningAlert(){
      if(this.warningAlert){
        setTimeout(() => {
          this.closeWarringAlert()//关闭提示
        }, 5000);
      }
    }
  },
  components: {
    DYRHSKJYDatePicker,
  }

}
</script>

<style scoped>

</style>