<template>
  <div id="mapStationSelect">
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
          <v-icon class>mdi-cloud</v-icon>
        </v-btn>
      </template>
      <span>单击显示站点筛选工具栏</span>
    </v-tooltip>
    <v-fab-transition>
      <v-card style="background-color: #0f0f0f40;min-width: 32em;" v-if="!hidebs">
        <v-row dense justify="end">
          <v-spacer></v-spacer>
          <v-col cols="4">
            站点选择
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
          <v-col cols="4" style="min-width: 150px" class="text-center align-content-center">
            <div>地区</div>
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
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
          <v-spacer></v-spacer>
          <v-col cols="6" style="min-width: 200px" class="text-center align-content-center">
            <div >站点类型</div>
            <v-select
                :items="StationTypeitems"
                v-model="StationTypeValue"
                multiple
                return-object
            >
              <template v-slot:prepend-item>
                <v-list-item
                    ripple
                    @click="toggle"
                >
                  <v-list-item-action>
                    <v-icon :color="StationTypeValue.length > 0 ? 'primary' : ''"></v-icon>
<!--                    {{ icon }}-->
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>全选</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-chip color="#0f0f0f40" v-if="index <= 1">
                  <span>{{ item }}</span>
                </v-chip>
                <span
                    v-if="index === 2"
                    class="grey--text caption"
                >(其他{{ StationTypeValue.length - 2 }}个)</span>
              </template>
            </v-select>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card>
    </v-fab-transition>
  </div>
</template>
<script>
export default {
  name: "地图站点选择",
  data: function () {
    return {
      menu1: false,
      menu2: false,
      hidebs: true,
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
      StationTypeitems: ['国家站', '区域站', '其他站'],
      StationTypeValue: ['国家站', '区域站'],
      Admin_Code2: [{"name": "呼和浩特市","id": "1501",}],
    }
  },
  mounted() {
    this.getAdmin_Code();
  },
  methods: {
    getAdmin_Code: function () {
      this.$axios
          .get('/GetAdminCode?id=15')
          .then(res => {
            this.AdminCodeSelect = res.data;
          })
          .catch(() => {
          });
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.StationTypeValue = []
        } else {
          this.StationTypeValue = this.StationTypeitems.slice()
        }
      })
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
      this.$emit('stationDQ-change', this.Admin_Code);
    },
    StationTypeChange:function (){
      let stationStr= this.StationTypeValue.join(",");
     this.$emit('stationType-change', stationStr);
    },
  },

  watch: {
    Admin_Code2() {
      this.AdminCodeChanege();
    },
    StationTypeValue(){
      this.StationTypeChange();
    }
  },
  props: {

  }
}
</script>

<style scoped>
#mapStationSelect {
  position: absolute;
  max-width: 50%;
  max-height: 20%;
  bottom: 20em;
  left: 4em;
  z-index: 6;
}
</style>