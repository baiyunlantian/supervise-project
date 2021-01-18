<template>
  <div id="right-container">
    <WarningCensus :data="warningCensus" class="top"/>

    <div class="monitor-container">
      <div class="operate">
        <div class="left">
          <div class="text">
            <div class="fontBlackAndBold">是否将视频实时同步到云端:</div>
            <div class="sub">(开启将会产生流量费用)</div>
          </div>
          <el-switch
              v-model="status"
              active-color="#ff4949"
              inactive-color="rgb(3, 114, 248)"
              active-text="OFF"
              inactive-text="ON"
          />
        </div>

        <div class="right">
          <div class="label">视频展现方式</div>
          <div class="layout">
            <div class="layout-one" :class="{active:layout === 'one'}" @click="layout = 'one'">
              <span></span>
            </div>
            <div class="layout-two" :class="{active:layout === 'two'}"  @click="layout = 'two'">
              <span></span>
              <span></span>
            </div>
            <div class="layout-three" :class="{active:layout === 'three'}"  @click="layout = 'three'">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="monitor-content" :class="[layout]">
        <div
            class="monitor-item"
            v-for="(item,index) in sliceMonitorList"
            :key="index"
        >

          <video-player
              class="video-player vjs-custom-skin"
              :ref="index"
              :playsinline="true"
              :options="playerOptions"
          />

          <div class="operate-content">
            <div class="text">摄像头{{index}}</div>
            <div class="operate-btn">
              <SvgIcon name="play" color="#fff" v-on:click="play(index, item.cameraId)" v-if="!isPlayArray[index].play" />
              <SvgIcon name="pause" color="#fff" @click="pause(index, item.cameraId)" v-else />
              <SvgIcon
                  name="fullScreen"
                  color="#fff"
                  @click="fullScreenHandle(index)"
                  width="0.625rem"
                  height="0.625rem"
              />
              <SvgIcon name="circleClose" color="#fff" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import WarningCensus from '@/components/warning-census/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getExceptionCensus } from '@/request/exception';
  import { getCameraStreamControl } from '@/request/index';

  export default Vue.extend({
    props:['cameraList'],
    components:{
      WarningCensus,
      SvgIcon,
    },
    data(){
      return{
        warningCensus:{
          face:0,
          helmet:0,
          region:0,
          refectiveVest:0,
          climbHeight:0,
          motionless:0,
          fire:0,
          tumble:0
        },
        status:false,
        layout:'three',
        monitorList:[],
        renderList:[],
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
          autoplay: false, // 如果为true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 是否视频一结束就重新开始。
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              type: "video/mp4", // 类型
              src:'',
            },
            {
              type:"video/webm", // 可以播放，用ogg也可打开
              src:'',
            },
            {
              type:"video/ogg",    // 可以播放，用webm也可打开
              src:'',
            },
            {
              type:"video/3gp",    // 可以播放
              src:'',
            }
          ],
          poster: require('@/assets/mission-person.jpg'), // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controls: {
            fullscreenToggle: true
          }
        },
        isPlayArray:[
          {play:false, encoded:''},
          {play:false, encoded:''},
          {play:false, encoded:''},
          {play:false, encoded:''},
        ]
      }
    },
    computed:{
      sliceMonitorList: function () {
        let endIndex = 1;
        if (this.layout === 'two'){
          endIndex = 2;
        }else if (this.layout === 'three'){
          endIndex = 4;
        }

        console.log(this.monitorList);
        //@ts-ignore
        return this.monitorList.slice(0, endIndex);
      },
    },
    methods:{
      // 播放
      play: function(index:number, cameraId:string){
        /*
        * command:  101--开启推流   102--关闭推流
        * encodedString:  关闭推流时传入
        * */
        let data = {
          cameraId,
          command:101
        };
        getCameraStreamControl(data).then(res=>{
          if (!res.data) return;
          let {encodedString, pullAddress, notify} = res.data;
          let sources = JSON.parse(JSON.stringify(this.playerOptions.sources));

          sources.forEach((item:any)=>item.src = pullAddress)

          this.$set(this.playerOptions, 'sources', sources);
          this.$set(this.isPlayArray, index, {play:true, encoded:encodedString},)
          //@ts-ignore
          this.$refs[index][0].player.play();
        }).catch(e=>{
          this.$message({
            type:'error',
            message:'播放失败'
          });
        })

      },
      // 暂停
      pause: function(index:number, cameraId:string){
        let data = {
          cameraId,
          command:102,
          encodedString:this.isPlayArray[index].encoded,
        };

        getCameraStreamControl(data).then(res=>{
          if (!res.data) return;
          let {encodedString, pullAddress, notify} = res.data;
          let sources = JSON.parse(JSON.stringify(this.playerOptions.sources));

          sources.forEach((item:any)=>item.src = pullAddress)

          this.$set(this.playerOptions, 'sources', sources);
          this.$set(this.isPlayArray, index, {play:false, encoded:encodedString},)
          //@ts-ignore
          this.$refs[index][0].player.pause();
        }).catch(e=>{
          this.$message({
            type:'error',
            message:'关闭失败'
          });
        })
      },
      //全屏
      fullScreenHandle: function(index:number){
        //@ts-ignore
        if(!this.$refs[index][0].player.isFullscreen()){
          //@ts-ignore
          this.$refs[index][0].player.requestFullscreen();
          //@ts-ignore
          this.$refs[index][0].player.isFullscreen(true);
        }else{
          //@ts-ignore
          this.$refs[index][0].player.exitFullscreen();
          //@ts-ignore
          this.$refs[index][0].player.isFullscreen(false);
        }
      },
    },
    watch:{
      cameraList:{
        handler: function(newVal, oldVal){
          this.monitorList = newVal;
        },
        deep:true
      },
    },
    mounted(): void {
      getExceptionCensus().then(res=>{
        if (!res.data) return

        let census : any= {};

        res.data.list.forEach((item:any)=>{

          switch (item.type) {
            case 101:
              census.climbHeight = item.totalNum;
              break;
            case 102:
              census.face = item.totalNum;
              break;
            case 103:
              census.fire = item.totalNum;
              break;
            case 104:
              census.helmet = item.totalNum;
              break;
            case 105:
              census.motionless = item.totalNum;
              break;
            case 106:
              census.refectiveVest = item.totalNum;
              break;
            case 107:
              census.region = item.totalNum;
              break;
            case 108:
              census.tumble = item.totalNum;
              break;
          }
        })

        this.warningCensus = {...this.warningCensus, ...census};
      })
    }
  });
</script>

<style scoped lang="less">
  @import 'right.less';
</style>