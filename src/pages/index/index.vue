<template>
  <div id="home-container">
    <Left
        :exception-list="websocketReturnExceptionList"
        @updateCameraList="updateCameraList"
        @updateReadiedExceptionBoxList="updateReadiedExceptionBoxList"
    />
    <Right
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
      createWebsocket: function () {
        const _this = this;
        let socket: any = null;
        (function  () {
          if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
          }else{
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
            //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
            let socketUrl=`ws://192.168.1.105:8951/ws/asset/${sessionStorage.getItem('token')}`;
            socket = new WebSocket(socketUrl);
            if(socket == null){
              socket.close();
              socket=null;
            }

            //打开事件
            socket.onopen = function() {
              console.log("websocket已打开");
              //socket.send("这是来自客户端的消息" + location.href + new Date());
            };
            //获得消息事件
            socket.onmessage = function(msg:any) {
              //发现消息进入    开始处理前端触发逻辑
              try {
                console.log(JSON.parse(msg.data));
                const {data,type} = JSON.parse(msg.data);

                if (type === 301){
                  this.$message({
                    type:'warning',
                    message:'流量使用警报'
                  })
                }else {
                  //@ts-ignore
                  _this.$global.readiedExceptionBoxList.push(data)
                }
              }catch (e) {
                console.log(e);
              }
            };
            //关闭事件
            socket.onclose = function() {
              console.log("websocket已关闭");
            };
            //发生了错误事件
            socket.onerror = function() {
              console.log("websocket发生了错误");
            }
          }
        }());
      },
    },
    mounted(): void {
      this.createWebsocket();
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
      let list = this.$global.readiedExceptionBoxList.map((item:any)=>{
        //@ts-ignore
        if (!this.readiedExceptionBoxList.includes(item.boxId)){
          return item;
        }
      })

      //@ts-ignore
      this.$global.readiedExceptionBoxList = list;
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>
