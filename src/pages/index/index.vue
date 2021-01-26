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
      },
      createWebsocket: () => {
        let socket: any = null;
        const chars = 'ABCDEFGHIJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < 32; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        (function  () {
          if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
          }else{
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
            //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
            let socketUrl=`wss://192.168.1.105:8951/ws/asset/${sessionStorage.getItem('token')}`;
            socket = new WebSocket(socketUrl);
            if(socket == null){
              socket.close();
              socket=null;
            }

            //打开事件
            socket.onopen = function() {
              console.log("websocket已打开");
              this.sendMessage();
              //socket.send("这是来自客户端的消息" + location.href + new Date());
            };
            //获得消息事件
            socket.onmessage = function(msg:any) {
              //发现消息进入    开始处理前端触发逻辑
              try {
                console.log(msg.data);
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
  })
</script>

<style lang="less">
  @import "index.less";
</style>
