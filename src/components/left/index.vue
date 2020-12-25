<template>
  <div id="left-container">
    <router-link
        v-for="(menu, index) in menuList"
        :key="index"
        :to="menu.path"
    >
      <div :class="{active: currentPath.indexOf(menu.path) >= 0}">
        <img :src="currentPath.indexOf(menu.path) >= 0 ? menu.active : menu.normal" alt=""/>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    data() {
      return {
        menuList:[
          {
            path:'/monitor-management',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
          {
            path:'/exception-management',
            normal:require('@/assets/menu/exception.png'),
            active:require('@/assets/menu/exception-active.png'),
          },
          {
            path:'/schedule-management',
            normal:require('@/assets/menu/schedule.png'),
            active:require('@/assets/menu/schedule-active.png'),
          },
          {
            path:'/person-management',
            normal:require('@/assets/menu/person.png'),
            active:require('@/assets/menu/person-active.png'),
          },
          {
            path:'/equipment-management',
            normal:require('@/assets/menu/equipment.png'),
            active:require('@/assets/menu/equipment-active.png'),
          },
        ],
        currentPath:'/',
      }
    },
    watch: {
      '$route.path':function (to, from){
        this.currentPath = to;
      }
    },
    methods: {},
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>