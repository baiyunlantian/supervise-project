import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from './elementUI/index'
import less from 'less'
import VideoPlayer from 'vue-video-player'
import 'element-ui/lib/theme-chalk/index.css'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import '@/request/mock.js'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'


Vue.config.productionTip = false

ElementUI.install(Vue)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
// @ts-ignore
Vue.use(less)
Vue.use(VideoPlayer)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
