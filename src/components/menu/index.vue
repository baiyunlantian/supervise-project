<template>
  <div id="menu-left-container">
    <router-link
        v-for="(menu, index) in menuList"
        :key="index"
        :to="menu.path"
    >
      <div :class="{active: handlePathIsActive(menu.path) === true}">
        <SvgIcon
            :name="menu.name"
            :color="handlePathIsActive(menu.path) === true ? 'rgb(3, 114, 248)' : '#fff'"
        />
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';

  export default Vue.extend({
    components:{
      SvgIcon
    },
    data() {
      return {
        menuList:[
          {
            path:'/',
            name:'monitor',
          },
          {
            path:'/exception-event',
            name:'exceptionCensus',
          },
          {
            path:'/schedule-management',
            name:'schedule',
          },
          {
            path:'/person-management',
            name:'userGroup',
          },
          {
            path:'/equipment-management',
            name:'equipment',
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