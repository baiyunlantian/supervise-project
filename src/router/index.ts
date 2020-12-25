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
      path: '/schedule-management',
      name: 'schedule-management',
      component: resolve => require(['@/pages/schedule-management/index.vue'], resolve),
    },
    {
      path: '/schedule-management/mission-detail',
      name: 'schedule-management/mission-detail',
      component: resolve => require(['@/pages/schedule-management/mission-detail.vue'], resolve),
    },
    {
      path: '*',
      name: 'Home',
      component: resolve => require(['@/pages/index/index.vue'], resolve)
    },
  ]
})