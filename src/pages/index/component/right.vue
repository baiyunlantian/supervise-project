<template>
  <div id="right-container">
    <WarningCensus :data="warningCensus" class="bgcAndShadow top"/>

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
              <i class="el-icon-video-play" v-on:click="play(index)" v-if="!isPlayArray[index]" />
              <i class="el-icon-video-pause" @click="pause(index)" v-else />
              <img :src="require('@/assets/fullscreen.png')" alt="全屏" @click="fullScreenHandle(index)"/>
              <i class="el-icon-circle-close" />
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
  import { getWarningCensus } from '@/request/schedule';
  import {VideoSrc} from "@/utils/common";

  export default Vue.extend({
    components:{
      WarningCensus,
    },
    data(){
      return{
        warningCensus:{},
        status:false,
        layout:'three',
        monitorList:[1,2,3,4],
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
              src:VideoSrc,
            },
            {
              type:"video/webm", // 可以播放，用ogg也可打开
              src:VideoSrc,
            },
            {
              type:"video/ogg",    // 可以播放，用webm也可打开
              src:VideoSrc,
            },
            {
              type:"video/3gp",    // 可以播放
              src:VideoSrc,
            }
          ],
          poster: require('@/assets/mission-person.jpg'), // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controls: {
            fullscreenToggle: true
          }
        },
        isPlayArray:[false,false,false,false]
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

        //@ts-ignore
        return this.monitorList.slice(0, endIndex);
      },
    },
    methods:{
      // 播放
      play: function(index:number){
        this.$set(this.isPlayArray, index, true)
        //@ts-ignore
        this.$refs[index][0].player.play();
      },
      // 暂停
      pause: function(index:number){
        this.$set(this.isPlayArray, index, false)
        //@ts-ignore
        this.$refs[index][0].player.pause();
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
    mounted(): void {
      getWarningCensus().then(res=>{
        if (!res.data) return
        this.warningCensus = res.data;
      })
    }
  });
</script>

<style scoped lang="less">
  @import 'right.less';
</style>