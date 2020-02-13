import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import axios from 'axios'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import {config} from "../app.config"

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

let Axios = axios.create({
  baseURL: `http://${config.server.host}:${config.server.port}`,
})

Vue.prototype.axios=Axios;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
