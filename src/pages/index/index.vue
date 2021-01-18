<template>
  <div id="home-container">
    <Left @updateCameraList="updateCameraList"/>
    <Right :camera-list="cameraList"/>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import Left from './component/left.vue';
  import Right from './component/right.vue';

  export default Vue.extend({
    components:{
      Left,
      Right,
    },
    data(){
      return {
        cameraList:[],
      }
    },
    methods:{
      updateCameraList: function (list = []) {
        this.cameraList = list;
      }
    },

    beforeRouteEnter (to, from, next) {
      const token = window.sessionStorage.getItem('token');
      if (token === null || token == undefined || token === '' || token === 'null' || token === 'undefined' || token === '') {
        next({ path: '/login' })
      } else {
        next();
      }
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>
