<template>
  <div id="left-container">
    <router-link
        v-for="(menu, index) in menuList"
        :key="index"
        :to="menu.path"
    >
      <div :class="{active: handlePathIsActive(menu.path) === true}">
        <img alt="" :src=" handlePathIsActive(menu.path) === true ? menu.active : menu.normal"/>
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
            path:'/',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
          {
            path:'/exception-event',
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
    methods: {
      handlePathIsActive: function (path:string) {
        let res: boolean;
        if (path === '/') {
          res = path === this.currentPath;
        }else{
          console.log(path)
          console.log(this.currentPath)
          res = this.currentPath.indexOf(path) >= 0;
        }

        return res;
      },
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>