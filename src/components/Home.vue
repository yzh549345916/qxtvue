<template>
        <v-container fluid style="height: 100%;">
          <v-app-bar
              dark
              short
              shrink-on-scroll
              prominent
              scroll-target="#scrolling-techniques"
          >
            <v-toolbar-title  class="text-h4">
              呼和浩特市智能网格预报业务平台
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-menu auto :offset-y=true open-on-hover  transition="slide-y-transition" >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    router-link :to="encodeURI('/主页')"
                    class="text-h5"
                >
                  首页
                </v-btn>
              </template>
            </v-menu>
            <v-menu auto :offset-y=true open-on-hover  transition="slide-y-transition" >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="text-h5"
                >
                  预报服务
                </v-btn>
              </template>
              <v-list
                  nav
                  dense
              >
                <v-list-item router-link :to="encodeURI('/预报服务/环保局')">
                  <v-list-item-title class="text-body-1">环保局</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu auto :offset-y=true open-on-hover  transition="slide-y-transition" >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="text-h5"
                >
                  数值预报查询
                </v-btn>
              </template>
              <v-list
                  nav
                  dense
              >
               <!-- <v-list-item link to="/数值预报查询/Chart1">
                  <v-list-item-title class="text-body-1">折线图</v-list-item-title>
                </v-list-item>-->
                <v-list-item  router-link :to="encodeURI('/数值预报查询/数值预报图表查询')">
                  <v-list-item-title class="text-body-1">图表查询</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn icon @click.stop="cblcf">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>
          <v-container fluid style="height: 90%;">
            <router-view ref="myzjm"></router-view>
          </v-container>
        </v-container>
</template>
<script>


export default {
     data: function() {
        return {
            publicPath: process.env.BASE_URL
        }
    }
    , methods: {
    cblcf: function () {
      this.$refs.myzjm.cblcf1();
    }}
}
</script>
