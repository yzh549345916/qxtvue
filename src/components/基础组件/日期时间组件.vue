<template>
   <v-row justify="center" align="center">
    <v-col cols="6"  class="text-center ">
      <div style="margin-top: 15px">起报日期</div>
      <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="100px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="mydate"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker  v-model="mydate" locale="zh-cn" :first-day-of-week="0" color="primary" @input="menu1 = false"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="6" class="text-center ">
      <div style="margin-top: 15px">起报时次</div>
      <v-menu
          ref="menu"
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="100px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="time"

              prepend-icon="access_time"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
            v-if="menu2"
            v-model="time"
            format="24hr"
            scrollable
            min="8:00"
            max="20:00"
            color="primary"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            @click:minute="$refs.menu.save(time)"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import {getTodayHourAndMinute} from "@/assets/js/getTodaytimeFormat";

export default {
  name: "日期时间组件",
  data:function (){
    return{
      time: getTodayHourAndMinute(),
      menu1: false,
      menu2: false,
      mydate: new Date().toISOString().substr(0, 10),
    }
  },
  mounted() {
    this.dateTimeChange();
  },
  methods: {
    dateTimeChange: function () {
     var tt= (new Date((this.mydate+" "+this.time+":00").substring(0,19).replace(/-/g,'/'))).getTime();
     this.$emit('datetime-change',tt);
    },
    allowedHours: v => v === 8|| v === 20,
    allowedMinutes: v => v=== 0,
  },
  watch:{
    time(){
      this.dateTimeChange();
    },
    mydate(){
      this.dateTimeChange();
    }
  }
}
</script>

<style scoped>

</style>