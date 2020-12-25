<template>
  <div id="app">
    <template v-show="path !== '/login'">
      <Header />
      <div class="main-container">
        <MenuList />
        <router-view />
      </div>
    </template>

    <Login v-show="path === '/login'"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Header from '@/components/header/index.vue';
  import MenuList from '@/components/left/index.vue';
  import Login from '@/pages/login/index.vue';

  export default Vue.extend({
    components:{
      Header,
      MenuList,
      Login,
    },
    data(){
      return{
        path:'/',
      }
    },
    watch: {
      '$route.path':function (to, from){
        this.path = to;
      }
    },
  })
</script>

<style lang="less">
  .main-container{
    display: flex;
    height: 95vh !important;
    >div:last-child{
      flex: 1;
      padding: 1% 3% 0 1%;
      background-color: rgb(240, 247, 255);
    }
  }
  @import "global.less";
</style>
