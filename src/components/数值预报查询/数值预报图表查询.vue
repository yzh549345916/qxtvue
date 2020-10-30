<template>
  <v-card color="transparent" style="height: 100%;">
    <v-navigation-drawer
        dark
        app
        absolute
        expand-on-hover
        v-model="drawer"
    >
      <v-divider></v-divider>
      <v-list
          nav
          dense
      >
        <v-list-item link to="/数值预报查询/数值预报图表查询/单站多要素">
          <v-list-item-icon>
            <v-icon>mdi-chart-areaspline-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>单站多要素</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/数值预报查询/数值预报图表查询/多站单要素">
          <v-list-item-icon>
            <v-icon>mdi-chart-areaspline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>多站单要素</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/数值预报查询/数值预报图表查询/地图查询">
          <v-list-item-icon>
            <v-icon>mdi-map</v-icon>
          </v-list-item-icon>
          <v-list-item-title>地图查询</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div style="height: 100%;">
      <router-view></router-view>
    </div>

  </v-card>

</template>

<script>
export default {
  data () {
    return {
      drawer: null,
    }
  }
  ,methods: {
  cblcf1: function () {
    this.drawer = !this.drawer
  }}
}

</script>
