<template>
  <v-card color="transparent">
    <v-row justify="center" align="center">
      <v-spacer></v-spacer>
      <v-col cols="3" style="min-width: 200px" class="text-center ">
        <dataTimeZJ @datetime-change='qbdateTimeChange'></dataTimeZJ>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" style="min-width: 200px" class="text-center ">
        <ybdataTimeZJ @datetime-change='ybdateTimeChange'></ybdataTimeZJ>
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
        <QtDys :ybTimeSpan="ybTimeSpan" :qbTimeSpan="qbTimeSpan"></QtDys>
      </v-row>
    </v-container>
    </v-sheet>

  </v-card >
</template>

<script>
import QtDys from '@/components/预报服务/环保局图表'
import dataTimeZJ from '@/components/基础组件/国家智能网格起报日期时间组件'
import ybdataTimeZJ from '@/components/基础组件/国家智能网格预报日期时间组件'
import {getZNWGQbTsp,getTodayHourAndMinuteTsp} from "@/assets/js/getTodaytimeFormat";
export default {
  data: function () {
    return {
      ybTimeSpan: getTodayHourAndMinuteTsp(),
      qbTimeSpan: getZNWGQbTsp(),
    }
  },
  methods: {
    ybdateTimeChange: function (dateTime) {
      this.ybTimeSpan = dateTime;
    },
    qbdateTimeChange: function (dateTime) {
      this.qbTimeSpan = dateTime;
    },
  },
  mounted() {

  },
  watch:{


  },
  computed: {

  },
  components: {
    QtDys,
    dataTimeZJ,
    ybdataTimeZJ
  }
}
</script>
