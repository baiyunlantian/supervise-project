import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from './elementUI/index'
import less from 'less'
import 'element-ui/lib/theme-chalk/index.css'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import '@/request/mock.js'


Vue.config.productionTip = false

ElementUI.install(Vue)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
// @ts-ignore
Vue.use(less)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
