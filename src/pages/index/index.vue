<template>
  <div id="home-container">
    <Left
        :exception-list="websocketReturnExceptionList"
        @updateCameraList="updateCameraList"
        @updateReadiedExceptionBoxList="updateReadiedExceptionBoxList"
        @updateFlowBalance="updateFlowBalance"
    />
    <Right
        ref="right"
        :camera-list="cameraList"
        :exception-list="websocketReturnExceptionList"
    />
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
      //@ts-ignore
      const $global = this.$global;
      return {
        cameraList:[],
        websocketReturnExceptionList: $global.readiedExceptionBoxList,
        readiedExceptionBoxList:[],
      }
    },
    methods:{
      updateReadiedExceptionBoxList: function (list = []) {
        if (list.length === 0) return;

        let readiedList = JSON.parse(JSON.stringify(this.readiedExceptionBoxList));

        list.forEach((item:string)=>{
          if (readiedList.includes(item) === true){
            readiedList.push(item)
          }
        })

        this.readiedExceptionBoxList = readiedList;
      },
      updateCameraList: function (list = []) {
        this.cameraList = list;
      },
      updateFlowBalance: function (value:number) {
        this.$emit('updateFlowBalance', value)
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
    //离开页面时，移除当前已读状态的异常摄像头
    beforeDestroy (){
      //@ts-ignore
      // let list = this.$global.readiedExceptionBoxList.map((item:any)=>{
      //   //@ts-ignore
      //   if (!this.readiedExceptionBoxList.includes(item.boxId)){
      //     return item;
      //   }
      // })
      //
      // //@ts-ignore
      // this.$global.readiedExceptionBoxList = list;
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>
