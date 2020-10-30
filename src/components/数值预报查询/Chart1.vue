
<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">BASiL</h1>
    </v-card-title>

    <v-tabs
        v-model="tab"
        background-color="transparent"
        color="basil"
        grow
    >
      <v-tab
          v-for="item in items"
          :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" color="basil">
      <v-tab-item
          v-for="item in items"
          :key="item"
          color="basil"
      >
        <v-card
            color="basil"
            flat
        >
          <v-card-text color="basil">{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      tab: null,
      items: [
        'Appetizers', 'Entrees', 'Deserts', 'Cocktails',
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
  },
}
</script>

<style>
/* Helper classes */
.basil {
  background-color: rgba(44, 147, 23,0.5) !important;
}
.basil--text {
  color: #212121a0 !important;
}
</style>