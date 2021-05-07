<template>

  <v-hover id="maptool" open-delay="200" close-delay="1000" v-slot:default="{ hover }">
    <div>
      <v-btn fab color="primary" small elevation=20 v-if="!hover">
        <v-icon class>mdi-toolbox</v-icon>
      </v-btn>
      <v-fab-transition>
        <div style="min-width: 200px;" v-if="hover">
          <v-toolbar
              color='#212121e0'
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>my_location</v-icon>
                </v-btn>
              </template>
              <span>待定1</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>待定2</span>
            </v-tooltip>
            <template v-slot:extension>
              <v-tabs
                  v-model="tcmodel"
                  center-active
                  fixed-tabs
                  slider-color="primary"
              >
                <v-tab
                    v-for="item in titleItem"
                    :key="item.tab"
                >
                  {{ item.tab }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-tabs-items style="max-height: 400px" class="overflow-y-auto" v-model="tcmodel">
            <v-tab-item
            >
              <v-card >
              <v-sheet>
                  <v-list>
                    <v-list-group
                        v-for="item in gDitems"
                        :key="item.title"
                        v-model="item.active"
                        :prepend-icon="item.action"
                        @click="myclisck"
                    >
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <v-list-item-group v-model="gdSelectItem" color="primary">
                        <v-list-item
                            v-for="subItem in item.items"
                            :key="subItem.title"
                        >
                          <v-list-item-content>
                            <v-list-item-title v-text="subItem.title"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list-group>
                  </v-list>

              </v-sheet>
              </v-card>
            </v-tab-item>
            <v-tab-item
            >
              <v-sheet flat>
                <v-card>
                  <v-list>
                    <v-list-group
                        v-for="item in zDitems"
                        :key="item.title"
                        v-model="item.active"
                        :prepend-icon="item.action"
                        @click="myzdclisck"
                    >
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <v-list-item-group v-model="zdSelectItem" color="primary">
                        <v-list-item
                            v-for="subItem in item.items"
                            :key="subItem.title"
                        >
                          <v-list-item-content>
                            <v-list-item-title v-text="subItem.title"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list-group>
                  </v-list>
                </v-card>
              </v-sheet>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-fab-transition>

    </div>
  </v-hover>

</template>

<script>
export default {
  name: "地图工具组件",
  data() {
    return {
      hover:true,
      gdSelectItem: null,
      gDitems: [
        {
          action: 'mdi-new-box',
          active: true,
          title: '区台新方法',
          items: [
            {title: '气温'}, {title: '10米风'}, {title: '相对湿度'},
          ],
        },
        {
          action: 'mdi-alpha-r-box',
          title: 'RMAPS',
          active: false,
          items: [
            {title: '气温'}, {title: '降水量'}, {title: '10米风'}, {title: '相对湿度'},
          ],
        },

      ],
      zdSelectItem: 0,
      zDitems: [
        {
          action: 'mdi-new-box',
          active: false,
          title: '区台新方法',
          items: [
            {title: '气温'}, {title: '10米风'}, {title: '相对湿度'},
          ],
        },
        {
          action: 'mdi-alpha-r-box',
          title: 'RMAPS',
          active: true,
          items: [
            {title: '气温'}, {title: '降水量'}, {title: '10米风'}, {title: '相对湿度'},{title: '能见度'},
          ],
        },
        {
          action: 'mdi-alpha-r-box',
          title: 'EC',
          active: false,
          items: [
            {title: '2米气温'}, {title: '总降水量'}, {title: '10米风'}, {title: '能见度'},{title: '露点温度'},{title: '地表温度'},{title: '海平面气压'},{title: '100米风'},{title: '过去3小时10米阵风'},{title: '过去6小时10米阵风'},{title: '过去3小时2米最低温度'},{title: '过去6小时2米最低温度'},{title: '过去6小时2米最高温度'},{title: '海表温度'},{title: '大尺度降水'},{title: '对流性降水'},{title: '降水类型'},{title: '降雪量'},{title: '雪深'},{title: '雪密度'},{title: '总云量'},{title: '低云量'},
          ],
        },
      ],
      tcmodel: 1,
      titleItem: [
        {tab: '格点预报'},
        {tab: '站点预报'},
        {tab: '实况'},
        {tab: '雷达'},
        {tab: '云图'},
        {tab: '待定'},
        {tab: '待定2'},
        {tab: '待定3'},
      ],
    }
  },
  watch: {
    gdSelectItem() {
      if (this.gdSelectItem !== null) {
        var s1 = this.gDitems;
        for (let i = 0; i < s1.length; i++) {
          if (s1[i].active) {
            //alert(s1[i].title+'\n'+this.gdSelectItem+'\n'+this.tcmodel);
          }
        }
      }
    },
    zdSelectItem() {
      if (this.zdSelectItem !== null) {
        var s1 = this.zDitems;
        for (let i = 0; i < s1.length; i++) {
          if (s1[i].active) {
            if (s1[i].items[this.zdSelectItem] === undefined) {
              this.$emit('tctoolbox-change', this.tcmodel, s1[i].title, "取消");
            } else {
              this.$emit('tctoolbox-change', this.tcmodel, s1[i].title, s1[i].items[this.zdSelectItem].title);
            }

          }
        }
      }
    },
  },
  methods: {
    myclisck() {
      this.gdSelectItem = null;
    },
    myzdclisck() {
      this.zdSelectItem = null;
    },
  },

}
</script>

<style scoped>
#maptool {
  position: absolute;
  max-width: 25%;
  top: 1em;
  left: 5em;
  z-index: 6;
}
</style>