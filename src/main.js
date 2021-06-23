import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'
import Bus from "../src/utils/bus"
import "./assets/css/popup.less"
// require('./mock.js')
import 'lib-flexible'
import * as filters from "./utils/filters"
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])//插入过滤器名和对应方法
})
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.prototype.Bus = Bus;
Vue.prototype.$moment = moment
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
