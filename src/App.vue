<template>
  <div id="app">
    <template v-if="path !== '/login'">
      <Header />
      <div class="main-container">
        <MenuList />
        <router-view />
      </div>
    </template>

    <Login v-else/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Header from '@/components/header/index.vue';
  import MenuList from '@/components/menu/index.vue';
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
    >div{
      height: 95vh !important;
    }
    >div:last-child{
      /*
        同时拥有overflow hidden 和 display inline-block 的元素，会对行内元素垂直对齐 有影响，
        导致原因是 overflow hidden 改变了默认对齐方式
        解决方法：添加vertical-align
      */
      display: inline-block;
      vertical-align: initial;
      width: calc(100% - 50px) !important;
      padding: 1% 3% 0 1%;
      background-color: rgb(240, 247, 255);
    }
  }
  @import "global.less";
</style>
