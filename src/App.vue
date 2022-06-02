<template>
  <div id="app">
    <v-app>
      <div class="messages">
        <div><b>Selected Range:</b> {{ selectedRange }}</div>
        <div><b>Selected Range Type:</b> {{ selectedType }}</div>
        <div><b>Active Tab:</b> {{ activeTab }}</div>
        <div><b>Is initialized fired:</b> {{ isInitialized }}</div>
      </div>
      <div class="wrapper">
        <CustomDatePicker @change="onRangeChange" @init="onInit"/>
      </div>
    </v-app>

  </div>
</template>

<script>
import CustomDatePicker from "@/components/CustomDatePicker.vue";

export default {
  components: {
    CustomDatePicker
  },
  data() {
    return {
      selectedRange: [],
      selectedType: '',
      activeTab: '',
      isInitialized: false
    }
  },
  methods: {
    onRangeChange({type, range, activeTab}) {
      this.selectedRange = range;
      this.selectedType = type;
      this.activeTab = activeTab;
    },
    onInit({range}) {
      this.isInitialized = true;
      this.selectedRange = range;
    }
  }
}
</script>

<style scoped>

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  align-items: center;
}

.messages {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.wrapper {
  width: 100%;
  margin-top: 40px;
}
</style>