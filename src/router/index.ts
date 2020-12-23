import VueRouter from "vue-router"

export default new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/pages/login/index.vue'], resolve),
    },
    {
      path: '/person-management',
      name: 'person-management',
      component: resolve => require(['@/pages/person-management/index.vue'], resolve),
    },
    {
      path: '*',
      name: 'Home',
      component: resolve => require(['@/pages/index/index.vue'], resolve)
    },
  ]
})