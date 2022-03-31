<template>
  <v-card color="transparent" style="height: 100%;">
    <v-navigation-drawer
        dark
        absolute
        expand-on-hover
        v-model="drawer"
    >
      <v-divider></v-divider>
      <v-list
          nav
          dense
      >
        <v-list-item router-link :to="encodeURI('/MSJY/DYRH/StationJianYanChart')">
          <v-list-item-icon>
            <v-icon>mdi-chart-areaspline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>多元融合实况多站检验图表</v-list-item-title>
        </v-list-item>
        <v-list-item router-link :to="encodeURI('/MSJY/DYRH/SingleStationJianYanChart')">
          <v-list-item-icon>
            <v-icon>mdi-chart-areaspline-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>多元融合实况单站检验图表</v-list-item-title>
        </v-list-item>
        <v-list-item router-link :to="encodeURI('/MSJY/DYRH/StationJianYan')">
          <v-list-item-icon>
            <v-icon>mdi-grid</v-icon>
          </v-list-item-icon>
          <v-list-item-title>多元融合实况站点检验表格</v-list-item-title>
        </v-list-item>
        <v-list-item router-link :to="encodeURI('/MSJY/DYRH/StationJianYanStatistics')">
          <v-list-item-icon>
            <v-icon>mdi-calculator-variant-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>多元融合实况站点检验统计</v-list-item-title>
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
  name: "DYRH",
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

<style scoped>

</style>