<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-spacer></v-spacer>
      <v-col cols="3" style="min-width: 200px" class="text-center align-content-center">
        <dataTimeZJ @datetime-change='dateTimeChange'></dataTimeZJ>
      </v-col>

      <v-col cols="1" class="text-center align-content-center">
        <div style="margin-top: 15px">预报要素</div>
        <v-autocomplete
            v-model="DataTypeSelect"
            :items="DataTypes"
            item-text="ybName"
            item-value="ybId"
            label="预报要素"
            return-object
            single-line
            no-data-text="无数据"
        ></v-autocomplete>
      </v-col >
      <v-spacer></v-spacer>
      <v-col cols="1" class="text-center align-content-center">
        <div style="margin-top: 15px;">地区</div>
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                dark
                readonly
                v-bind="attrs"
                v-model="Admin_CodeName"
                style="margin-top: 12px"
                v-on="on">
              <v-icon slot="append" small v-on="on">mdi-chevron-down</v-icon>
            </v-text-field>
          </template>
          <v-card>
            <v-treeview
                v-model="Admin_Code2"
                :items="AdminCodeSelect"
                selection-type='independent'
                selectable
                open-on-click
                selected-color="primary"
                return-object
            ></v-treeview>
          </v-card>
        </v-menu>
      </v-col >

      <v-col cols="2" class="text-center align-content-center" >
        <div style="margin-top: 15px">站点类型</div>
        <v-select
            :items="StationTypeitems"
            v-model="StationTypeValue"
            multiple
            return-object
            clearable
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
              <span>{{ item }}</span>
            </v-chip>
            <span
                v-if="index === 2"
                class="grey--text caption"
            >(其他{{ StationTypeValue.length - 2 }}个)</span>
          </template>
        </v-select>
      </v-col>

      <v-col cols="3" class="text-center align-content-center">
        <div style="margin-top: 15px">站点选择</div>
        <v-autocomplete
            v-model="StationSelect"
            :items="myStations"
            item-text="name"
            item-value="id"
            multiple
            chips
            no-data-text="无数据"
            clearable
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index <= 1" >
              <span>{{ item.name }}</span>
            </v-chip>
            <span
                v-if="index === 2"
                class="grey--text caption"
            >(其他{{ StationSelect.length - 2 }}个站)</span>
          </template>
        </v-autocomplete>
      </v-col>

      <v-spacer></v-spacer>
    </v-row>

    <v-sheet
        id="scrolling-techniques"
        class="overflow-y-auto"
        max-height="720"
        color="transparent"
    >
      <v-container>
      <v-row justify="center" align="center">
        <QtDys :myStationID="stationiD" :myTimeSpan="myTimeSpan" :ybysValue="ybysValue"></QtDys>
      </v-row>
    </v-container>
    </v-sheet>

  </v-container>
</template>

<script>
import QtDys from '@/components/数值预报查询/区局方法多站单要素图表'
import dataTimeZJ from '@/components/基础组件/日期时间组件'
import {getTodayHourAndMinuteTsp} from "@/assets/js/getTodaytimeFormat";
export default {
  data: function () {
    return {
      AdminCodeSelect: [{"name":"呼和浩特市","id":"1501","children":[{"name":"新城区","id":"150102","children":[],"hasChildren":true},{"name":"回民区","id":"150103","children":[],"hasChildren":true},{"name":"玉泉区","id":"150104","children":[],"hasChildren":true},{"name":"赛罕区","id":"150105","children":[],"hasChildren":true},{"name":"土默特左旗","id":"150121","children":[],"hasChildren":true},{"name":"托克托县","id":"150122","children":[],"hasChildren":true},{"name":"和林格尔县","id":"150123","children":[],"hasChildren":true},{"name":"清水河县","id":"150124","children":[],"hasChildren":true},{"name":"武川县","id":"150125","children":[],"hasChildren":true}],"hasChildren":false}],
      StationSelect: ["53463","53466"],
      StationTypeitems:['国家站','区域站','其他站'],
      StationTypeValue:['国家站','区域站'],
      StationType:"国家站",
      Admin_Code:"1501",
      Admin_CodeName:"呼和浩特市",
      Admin_Code2: [{"name": "呼和浩特市","id": "1501",}],
      myStations:[],
      myTimeSpan: getTodayHourAndMinuteTsp(),
      stationValue: "",
      stationiD: "53463,53466,",
      ybysValue: "0",
      DataTypes: [
        {ybName: "温度", ybId: 0},
        {ybName: "最高气温", ybId: 7},
        {ybName: "最低气温", ybId: 8},
        {ybName: "相对湿度", ybId: 1},
        {ybName: "10米风", ybId: 4}
      ],
      DataTypeSelect:{ybName: "温度", ybId: 0}
    }
  },
  methods: {
    dateTimeChange: function (dateTime) {
      this.myTimeSpan = dateTime;
    },
    selectClose: function () {
      let ids="";
      for(let i=0;i<this.StationSelect.length;i++){
        ids+=this.StationSelect[i]+',';
      }
      this.stationiD=ids.slice(0,-1);
    },
    getStationsByID: function () {
      this.$axios
          .get('/GetStationsByID?id=' + this.Admin_Code + '&StationType=' + this.StationTypeValue)
          .then(res => {
           this.myStations= res.data;
          })
          .catch(() => {
          });
    },
    getAdmin_Code: function () {
      this.$axios
          .get('/GetAdminCode?id=15')
          .then(res => {
            this.AdminCodeSelect= res.data;
          })
          .catch(() => {
          });
    },
    toggle () {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.StationTypeValue = []
        } else {
          this.StationTypeValue = this.StationTypeitems.slice()
        }
      })
    },
    AdminCodeChanege:function (){
      let name="";
      let id="";
      for(let i=0;i<this.Admin_Code2.length;i++){
        name+=this.Admin_Code2[i].name+',';
        id+=this.Admin_Code2[i].id+',';
      }

      this.Admin_CodeName=name.slice(0,-1);
      this.Admin_Code=id.slice(0,-1);
    },
    DataTypeSelectChange:function (){
      this.ybysValue=this.DataTypeSelect.ybId
    }
  },
  mounted() {
    this.getStationsByID();
    this.getAdmin_Code();
  },
  watch:{
    StationSelect() {
      this.selectClose();
    },
    StationTypeValue(){
      this.getStationsByID()},
    Admin_Code2(){
      this.AdminCodeChanege();
    },
    Admin_Code(){
      this.getStationsByID()},
    DataTypeSelect(){
      this.DataTypeSelectChange();
    }

  },
  computed: {
    likesAllFruit () {
      return this.StationTypeValue.length === this.StationTypeitems.length
    },
    likesSomeFruit () {
      return this.StationTypeValue.length > 0 && !this.likesAllFruit
    },
    icon () {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  components: {
    QtDys,
    dataTimeZJ
  }
}
</script>
