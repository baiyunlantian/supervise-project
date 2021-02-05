<template>
  <div id="warning-census-container">
    <div
        class="item"
        v-for="(item, index) in censusConfig"
        :key="index"
        :class="censusData[item.key] === 0 ? 'normal' : 'active'"
    >
      <div class="img">
        <SvgIcon
          :name="item.key"
          :color="censusData[item.key] === 0 ? colors[1] : colors[0]"
        />
      </div>
      <div class="text">
        <div class="label">{{item.label}}</div>
        <div class="count">{{censusData[item.key]}}</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import {getExceptionCensus} from "@/request/exception";

  export default Vue.extend({
    components:{SvgIcon},
    props:['data'],
    data() {
      return {
        censusConfig:[
          { key:'face',label:'人脸识别预警',},
          { key:'region',label:'安全帽预警',},
          { key:'helmet',label:'人员入侵预警',},
          { key:'refectiveVest',label:'反光衣预警',},
          { key:'climbHeight',label:'高空作业安全带预警',},
          { key:'motionless',label:'静止预警',},
          { key:'fire',label:'火灾预警',},
          { key:'tumble',label:'跌倒预警',},
        ],
        colors:['#fff','rgb(102, 102, 102)'],
        censusData:{
          face:0,
          helmet:0,
          region:0,
          refectiveVest:0,
          climbHeight:0,
          motionless:0,
          fire:0,
          tumble:0
        },
        socketRef: null,
        totalAndTodayCountCensus:{
          today:0,
          total:0,
        },
      }
    },
    methods:{
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
            _this.socketRef = socket;
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

                if (type == '301'){
                  this.$message({
                    type:'warning',
                    message:'流量使用警报'
                  })
                }else if (Number(type) > 100){
                  _this.handleUpdateWarningCensus(type);
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
      handleUpdateWarningCensus: function (type:string) {
        let key = '';
        switch (type) {
          case '101':
            key = 'climbHeight';
            break;
          case '102':
            key = 'face';
            break;
          case '103':
            key = 'fire';
            break;
          case '104':
            key = 'helmet';
            break;
          case '105':
            key = 'motionless';
            break;
          case '106':
            key = 'refectiveVest';
            break;
          case '107':
            key = 'region';
            break;
          case '108':
            key = 'tumble';
            break;
        }

        //@ts-ignore
        this.$set(this.censusData, key, this.censusData[key]+1);
        this.$emit('countCensus',{total:this.totalAndTodayCountCensus.total,today:this.totalAndTodayCountCensus.today+1})
        this.$emit('refreshTable');
      },
      handleInitCensus: function () {
        this.createWebsocket();
        this.handleGetCensusData();
      },
      handleGetCensusData: function () {
        getExceptionCensus().then(res=>{
          if (!res.data) return

          let census : any= {};
          let total = res.data.totalCount;
          let todayCensus = 0;

          res.data.todayCounts.forEach((item:any)=>{
            todayCensus += item.count;

            switch (item.exceptionType) {
              case 101:
                census.climbHeight = item.count;
                break;
              case 102:
                census.face = item.count;
                break;
              case 103:
                census.fire = item.count;
                break;
              case 104:
                census.helmet = item.count;
                break;
              case 105:
                census.motionless = item.count;
                break;
              case 106:
                census.refectiveVest = item.count;
                break;
              case 107:
                census.region = item.count;
                break;
              case 108:
                census.tumble = item.count;
                break;
            }
          })

          this.censusData = {...this.censusData, ...census};
          this.totalAndTodayCountCensus = {total, today:todayCensus};
          this.$emit('countCensus',{total,today:todayCensus})
        })
      }
    },
    mounted(): void {
      if (this.$props.data == undefined) this.handleInitCensus()
      else this.censusData = {...this.censusData, ...this.$props.data}
    },
    watch:{
      data:{
        handler: function (newVal, oldVal) {
          this.censusData = newVal;
        },
        deep:true
      },
    },
    beforeDestroy(): void {
      //@ts-ignore
      this.socketRef && this.socketRef.close();
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>