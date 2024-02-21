import Vue from 'vue'
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
import * as echarts from 'echarts'

import App from './App.vue'
import router from './router';
import axios from 'axios'

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(TDesign)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
