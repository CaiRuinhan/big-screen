import Vue from 'vue'
import App from './App.vue'
import echarts from 'echarts'
import Axios from 'axios'

Vue.prototype.$E = echarts
Vue.prototype.$A = Axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
