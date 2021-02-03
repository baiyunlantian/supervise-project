<template>
  <div id="right-container">
    <WarningCensus  class="top"/>

    <div class="monitor-container">
      <div class="operate">
        <div class="left">
          <div class="text">
            <div class="fontBlackAndBold">是否将视频实时同步到云端:</div>
            <div class="sub">(开启将会产生流量费用)</div>
          </div>
          <el-switch
              :value="!reportStatus"
              active-color="#ff4949"
              inactive-color="rgb(3, 114, 248)"
              active-text="OFF"
              inactive-text="ON"
              @change="updateReportStatus"
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
            v-for="(item,index) in monitorList.slice(0, sliceMonitorList)"
            :key="index"
        >
          <video
              :ref="index"
              class="video-player"
              muted
              @error="playError"
          />

          <div class="operate-content" :class="{exception:handleJudgeException(item.cameraId)}">
            <div class="text">{{item.name}}</div>
            <SvgIcon
                name="fullScreen"
                color="#fff"
                @click="fullScreenHandle(index)"
                width="0.625rem"
                height="0.625rem"
            />
          </div>

          <div class="operate-video-btn">
            <SvgIcon name="play" width="3.125rem" height="3.125rem" color="rgb(3, 114, 248)" v-on:click="play(index, item.cameraId)" v-if="!isPlayArray[index].play" />
            <SvgIcon name="pause" width="3.125rem" height="3.125rem" color="rgb(3, 114, 248)" @click="pause(index, item.cameraId)" v-else />
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
  import { getCameraStreamControl, getReportVideoConfig, updateReportVideoConfig } from '@/request/index';
  import {showMessageAfterRequest, VideoSrc} from "@/utils/common";
  import flvjs from 'flv.js/dist/flv.min.js'

  export default Vue.extend({
    props:['cameraList','exceptionList'],
    components:{
      WarningCensus,
      SvgIcon,
    },
    data(){
      return{
        reportStatus:false,
        layout:'three',
        monitorList:[],
        isPlayArray:[
          {play:false, encoded:''},
          {play:false, encoded:''},
          {play:false, encoded:''},
          {play:false, encoded:''},
        ],
        playerList:[],
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
        return endIndex;
      },
    },
    methods:{
      // 播放
      play: function(index:number, cameraId:string){
        /*
        * command:  101--开启推流   100--关闭推流
        * encodedString:  关闭推流时传入
        * */
        let data = {
          cameraId,
          command:101
        };
        getCameraStreamControl(data).then(res=>{
          if (!res.data) return;
          let {encodedString, pullAddress, notify, visToken} = res.data;
          this.$set(this.isPlayArray, index, {play:true, encoded:encodedString},)

          if (notify === false){
            this.$message({
              type:'info',
              message:'该设备离线中，无法播放'
            });
            return;
          }

          //@ts-ignore
          let videoEl = this.$refs[index][0];

          if(flvjs.isSupported()){
            let player = flvjs.createPlayer({
              type: 'flv',
              url: pullAddress
            },{
              headers:{
                'X-Auth-Token':visToken,
              }
            });

            this.$set(this.playerList, index, player);
          }else{
            this.$message.error('不支持的格式');
            return;
          }

          //@ts-ignore
          this.playerList[index].attachMediaElement(videoEl)
          //@ts-ignore
          this.playerList[index].load()
          //@ts-ignore
          this.playerList[index].play()

        }).catch(e=>{
          console.log(e)
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
          command:100,
          encodedString:this.isPlayArray[index].encoded,
        };

        getCameraStreamControl(data).then(res=>{
          if (!res.data) return;
          let {encodedString, pullAddress, notify} = res.data;

          if (notify === false){
            this.$message({
              type:'info',
              message:'该设备离线中...'
            });
            return;
          }

          if (this.playerList[index]){
            //@ts-ignore
            this.playerList[index].pause();
            //@ts-ignore
            this.playerList[index].destroy();
            //@ts-ignore
            this.$set(this.playerList, index, null);
          }

          this.$set(this.isPlayArray, index, {play:false, encoded:encodedString},)
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
        let ele = this.$refs[index][0];
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
      },
      playError: function (e:any) {
        console.log(e)
        this.$message({
          type:'error',
          message:'播放失败，请刷新页面！'
        });
      },
      //切换是否将视频同步到云端状态
      updateReportStatus: function(value:boolean) {
        let isPushCloudStream = value === false ? 0 : 1;
        updateReportVideoConfig({isPushCloudStream}).then(res=>{
          this.reportStatus = res.data === true ? value : !value;
          showMessageAfterRequest(res.data, '修改成功','修改失败');
        }).catch(e=>{
          this.$message({
            type:'error',
            message:'修改失败'
          })
          this.reportStatus = !value;
        })
      },
      //判断摄像头是否检测出异常行为，异常的话显示红点
      handleJudgeException: function (cameraId:string) {

        let list = this.$props.exceptionList && this.$props.exceptionList.filter((item:any)=>item.cameraId === cameraId)
        return list && list.length > 0 ? true : false;
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

      getReportVideoConfig().then(res=>{
        if (!res.data) return;
        this.reportStatus = res.data.isPushCloudStream === 0 ? false : true;
      })

    }
  });
</script>

<style scoped lang="less">
  @import 'right.less';
</style>