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
      path: '/exception-event',
      name: 'exception-event',
      component: resolve => require(['@/pages/exception-event/index.vue'], resolve),
    },
    {
      path: '/exception-event/history-list',
      name: 'exception-event/history-list',
      component: resolve => require(['@/pages/exception-event/history-list.vue'], resolve),
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
      path: '/schedule-management/reporter-detail',
      name: 'schedule-management/reporter-detail',
      component: resolve => require(['@/pages/schedule-management/reporter-detail.vue'], resolve),
    },
    {
      path: '/equipment-management',
      name: 'equipment-management',
      component: resolve => require(['@/pages/equipment-management/index.vue'], resolve),
    },
    {
      path: '/equipment-management/set-voice',
      name: 'equipment-management/set-voice',
      component: resolve => require(['@/pages/equipment-management/set-voice.vue'], resolve),
    },
    {
      path: '*',
      name: 'Home',
      component: resolve => require(['@/pages/index/index.vue'], resolve)
    },
  ]
})