<template>
  <div id="header-container">
    <div>工程监督智能服务平台</div>
    <img :src="require('@/assets/logout.png')" alt="logout" @click="logout"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from 'moment';

  export default Vue.extend({
    data(){
      return{
      }
    },
    methods:{
      logout: function () {
        console.log('logout')
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>