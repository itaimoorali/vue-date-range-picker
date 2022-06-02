import Vue from 'vue';
import vuetify from "@/plugins/vuetify";
import App from './App.vue'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount('#app');