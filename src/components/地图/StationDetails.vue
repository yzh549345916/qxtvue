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
        class="tag-read"
        :headers="headers"
        :items="desserts"
        :search="search"
        :footer-props="{
      itemsPerPageAllText:'所有',
    }"
    ></v-data-table>

  </v-card>
</template>

<script>

export default {
  name: "StationDetails",
  data () {
    return {
      search: '',
      headers: [],
      desserts: [],
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
    csh() {
      if(this.StationID!=null){

        /*this.headers=[
          {
            align: 'start',
            filterable: false,
            value: 'name',
            "text":"温度预报"
          },
          { text: 'Calories',align: 'center', value: 'calories' },
          { text: 'Fat (g)',align: 'center', value: 'fat' },
          { text: 'Carbs (g)',align: 'center', value: 'carbs' },
          { text: 'Protein (g)',align: 'center', value: 'protein' },
          { text: 'Iron (%)',align: 'center', value: 'iron' },
        ];
        alert(this.dataType+"\r\n"+this.StationID+"\r\n"+this.ybType+"\r\n"+this.lxType+"\r\n"+this.lxType);*/
      }

    },
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on('success', function () {
        _this.$toast("复制成功")
      });
      clipboard.on('error', function () {
        _this.$toast("复制失败")
      });
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
    }

  },
  mounted() {
    this.csh();
  },
  watch: {
    StationID() {
      if (this.StationID !== null) {
        var myurl="";
        myurl='/getzdybByTypeStationsQBTime?YBType=' + this.ybType + '&DataTypeID=' + this.dataType + '&StationID=' + this.StationID + '&times=' + this.stationYbQbTimespan+ '&stationlevelType=' + this.stationlevelType+ '&stationlevel=' + this.stationlevel;
        this.$axios
            .get(myurl)
            .then(res => {
              this.headers=res.data.headers;
              this.desserts=res.data.datas;
            })
            .catch(err => {
              console.log(err);
            });
      }
    },

  },
  components: {

  }

}
</script>

<style scoped>

</style>