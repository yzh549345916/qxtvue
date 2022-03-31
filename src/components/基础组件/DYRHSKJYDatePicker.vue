<template>
   <v-row justify="center" align="center">
    <v-col cols="6"  class="text-center ">
      <div style="margin-top: 15px">{{datePickerName}}</div>
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
              v-model="localDate"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker  v-model="localDate" locale="zh-cn" :first-day-of-week="0" color="primary" @input="menu1 = false"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="5" class="text-center ">
      <div style="margin-top: 15px">{{timePickerName}}</div>
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
              v-model="localTime"
              prepend-icon="access_time"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
            v-if="menu2"
            v-model="localTime"
            format="24hr"
            scrollable
            color="primary"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            @click:minute="$refs.menu.save(localTime)"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "DYRHSKJYDatePicker",
  data:function (){
    return{
      menu1: false,
      menu2: false,
      localDate:'',
      localTime:'',
    }
  },
  props: {
    datePickerName: {
      type: String,
      required: true
    },
    timePickerName: {
      type: String,
      required: true
    },
    mydate: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
  },
  mounted() {
    this.localDate=this.mydate;
    this.localTime=this.time;
    this.dateTimeChange();
  },
  methods: {
    dateTimeChange: function () {
     var dateTimeStr= this.localDate+" "+this.localTime+":00";
     this.$emit('datetime-change',dateTimeStr);
    },
    allowedHours: v => v !== 8|| v !== 20,
    allowedMinutes: v => v=== 0,
  },
  watch:{
    localTime(){
      this.dateTimeChange();
    },
    localDate(){
      this.dateTimeChange();
    }
  }
}
</script>

<style scoped>

</style>