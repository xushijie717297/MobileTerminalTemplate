import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'
import Bus from "../src/utils/bus"
import "./assets/css/popup.less"
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// require('./mock.js')
import 'lib-flexible'
//调试工具
import Vconsole from 'vconsole';
// new Vconsole();

import * as filters from "./utils/filters"
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])//插入过滤器名和对应方法
})
axios.defaults.headers.post['Content-Type'] = 'application/json';
import Interceptors from './axios/index' // 拦截器
Vue.use(Interceptors.request) // 请求拦截器
Vue.use(Interceptors.response) // 响应拦截器
Vue.use(VueAwesomeSwiper)
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.prototype.Bus = Bus;
Vue.prototype.$moment = moment
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
