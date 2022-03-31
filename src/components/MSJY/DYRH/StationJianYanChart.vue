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
      <v-spacer></v-spacer>
      <v-col cols="1" class="text-center align-content-center">
        <div style="margin-top: 15px">要素</div>
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
      <v-col cols="1" style="min-width: 150px" class="text-center align-content-center">
        <div style="margin-top: 15px">地区</div>
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
      </v-col>
      <v-col cols="2" style="min-width: 200px" class="text-center align-content-center">
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
      <v-spacer></v-spacer>
    </v-row>
    <v-sheet
        id="scrolling-techniques"
        class="overflow-y-auto"
        max-height="850"
        color="transparent"
    >
      <v-container>
        <v-row justify="center" align="center">
          <DYRHDys :sDateStr="startDateTimeStr" :eDateStr="endDateTimeStr" :stationIDs="StationIds" :eleName="DataTypeSelect.ybId" :eleChineseName="DataTypeSelect.ybName"></DYRHDys>
        </v-row>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script>
import DYRHSKJYDatePicker from  '@/components/基础组件/DYRHSKJYDatePicker'
import DYRHDys from '@/components/MSJY/DYRH/DYRHMultipleStationsChart'
export default {
  name: "StationJianYanChart",
  data: function () {
    return {
      Admin_Code: "1501",
      Admin_CodeName: "呼和浩特市",
      AdminCodeSelect: [{
        "name": "呼和浩特市",
        "id": "1501",
        "children": [{"name": "新城区", "id": "150102", "children": [], "hasChildren": true}, {
          "name": "回民区",
          "id": "150103",
          "children": [],
          "hasChildren": true
        }, {"name": "玉泉区", "id": "150104", "children": [], "hasChildren": true}, {
          "name": "赛罕区",
          "id": "150105",
          "children": [],
          "hasChildren": true
        }, {"name": "土默特左旗", "id": "150121", "children": [], "hasChildren": true}, {
          "name": "托克托县",
          "id": "150122",
          "children": [],
          "hasChildren": true
        }, {"name": "和林格尔县", "id": "150123", "children": [], "hasChildren": true}, {
          "name": "清水河县",
          "id": "150124",
          "children": [],
          "hasChildren": true
        }, {"name": "武川县", "id": "150125", "children": [], "hasChildren": true}],
        "hasChildren": false
      }],
      Admin_Code2: [{"name": "呼和浩特市","id": "1501",}],
      StationTypeitems: [{"name": "国家站","id": "12,13"},{"name": "区域站","id": "14"}],
      StationTypeValue: [{"name": "国家站","id": "12,13"}],
      StationSelect: ["53463","53466"],
      StationIds:"53463,53466",
      myStations:[],
      startDateTimeStr:new Date(new Date().getTime()- 24 * 60 * 60 * 1000).toISOString().substring(0, 10)+" 08:00:00",
      czFilter:'',
      endDateTimeStr:new Date().toISOString().substring(0, 10)+" 08:00:00",
      DataTypes: [
        {ybName: "温度", ybId: "TEM"},
        {ybName: "1小时降水", ybId: "PRE_1h"},
        {ybName: "相对湿度", ybId: "RHU"},
        {ybName: "露点温度", ybId: "DPT"},
      ],
      DataTypeSelect:{ybName: "温度", ybId: "TEM"},
      search: '',
      page: 1,
      pageCount: 0,
      itemsPerPage: 30,
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
    getAdmin_Code: function () {
      this.$axios
          .get('/GetAdminCode?id=1501')
          .then(res => {
            this.AdminCodeSelect = res.data;

          })
          .catch(() => {
          });
    },
    AdminCodeChanege: function () {
      let name = "";
      let id = "";
      for (let i = 0; i < this.Admin_Code2.length; i++) {
        name += this.Admin_Code2[i].name + ',';
        id += this.Admin_Code2[i].id + ',';
      }
      this.Admin_CodeName = name.slice(0, -1);
      this.Admin_Code = id.slice(0, -1);
    },
    startDateTimeChange: function (dateTime) {
      this.startDateTimeStr = dateTime;
    },
    endDateTimeChange: function (dateTime) {
      this.endDateTimeStr = dateTime;
    },
    stationChange: function () {
      let ids="";
      for(let i=0;i<this.StationSelect.length;i++){
        ids+=this.StationSelect[i]+',';
      }
      this.StationIds=ids.slice(0,-1);
    },
    getStationsBystationLevl: function () {
      var stationLevel="";
      for(let i=0;i<this.StationTypeValue.length;i++){
        stationLevel+=this.StationTypeValue[i].id+',';
      }
      stationLevel=stationLevel.slice(0,-1);
      this.$axios
          .get('/getDYRHJianYanStationsByIDAndLevel?'+'adminCode=' +this.Admin_Code+'&stationLevlStr='+stationLevel)
          .then(res => {
            this.myStations= res.data;
            if(this.StationSelect!==null&&this.StationSelect.length>0)
            {
              let stationSz=this.StationSelect;
              for(let i=stationSz.length-1;i>=0;i--){
                const myIndex = this.myStations.findIndex((v) => {
                  return v.id === stationSz[i];
                });
                if(myIndex===-1){
                  stationSz.splice(i,1);
                }
              }
              this.StationSelect= stationSz;
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
  },
  mounted() {
    this.getStationsBystationLevl();
    this.getAdmin_Code();
  },
  watch:{
    StationTypeValue(){
      this.getStationsBystationLevl()
    },
    Admin_Code2() {
      this.AdminCodeChanege();
    },
    Admin_Code() {
      this.getStationsBystationLevl()
    },
    StationSelect(){
      this.stationChange();
    },
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
          "value": "stationIdC",
          "text": "站号",
          "sortable": true,
          "divider": true,
          "width": 100
        },
        {
          "filterable": true,
          "align": "center",
          "value": "datetime",
          "text": "时间",
          "sortable": true,
          "divider": true,
          "width": 150
        }, {
          "filterable": false,
          "align": "center",
          "value": "dyskvalue",
          "text": "多源融合实况",
          "sortable": true,
          "groupable": false,
          "divider": true,
          "width": 130
        }, {
          "filterable": false,
          "align": "center",
          "value": "stationSKValue",
          "text": "站点实况",
          "sortable": true,
          "groupable": false,
          "divider": true,
          "width": 100
        }, {
          "align": "center",
          "value": "czvalue",
          "text": "差值",
          "sortable": true,
          "groupable": false,
          "divider": true,
          "width": 100,
          filter: value => {
            if (!this.czFilter) return true
            return Math.abs(value) > this.czFilter
          },
        },
      ]
    },
  },
  components: {
    DYRHSKJYDatePicker,
    DYRHDys
  }

}
</script>

<style scoped>

</style>