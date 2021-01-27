<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="video-dialog"
      width="800px"
      append-to-body
  >
    <template slot="title">
      <i class="el-icon-close" @click="close"/>
    </template>

    <div class="video-container">
      <video
          ref="videoPlayer"
          class="video-player"
          @error="playError"
          muted
          :style="{backgroundImage:videoData.picUrl || `url(${require('@/assets/mission-person.jpg')})`}"
      />
      <SvgIcon name="play" width="3.125rem" height="3.125rem" color="rgb(3, 114, 248)" v-on:click="play()" v-if="!playStatus"/>
      <SvgIcon name="pause" width="3.125rem" height="3.125rem" color="rgb(3, 114, 248)" @click="pause()" v-else />
    </div>

  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import flvjs from "flv.js/dist/flv.min.js";
  import { reloadEventVideo } from "@/request/exception";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      SvgIcon,
    },
    props: {
      videoData:{
        type: Object,
        default: function () {
          return {
            videoUrl:'',
            picUrl:''
          }
        }
      },
      visible:{
        required:true,
        type:Boolean,
      },
    },
    data() {
      return {
        playerRef:'',
        playStatus:false,
        firstPlay:true,
      }
    },
    methods: {
      close: function () {
        //@ts-ignore
        this.playerRef && this.playerRef.destroy();
        //@ts-ignore
        this.$emit('close');
        this.firstPlay = true;
        this.playStatus = false;
      },
      play: function(){
        this.playStatus = true;

        if(flvjs.isSupported()){
          if (this.firstPlay) {

            this.playerRef = flvjs.createPlayer({
              type: 'mp4',
              url: this.$props.videoData.videoUrl
            });

            //@ts-ignore
            this.playerRef.attachMediaElement(this.$refs.videoPlayer)
            //@ts-ignore
            this.playerRef.load()
          }

          //@ts-ignore
          this.playerRef.play()
          this.firstPlay = false;

        }else{
          this.$message.error('不支持的格式');
          return;
        }
      },
      pause: function () {
        this.playStatus = false;
        //@ts-ignore
        this.playerRef.pause()
      },
      playError: function (e:any) {
        this.$message({
          type:'error',
          message:'播放失败，重新加载中！'
        });

        const {exceptionId, type:exceptionType} = this.$props.videoData;
        reloadEventVideo({exceptionId, exceptionType}).then((res:any)=>{
          showMessageAfterRequest(res.data,'加载成功，请刷新页面！','加载失败，请稍后重试！')
        })
        console.log(e)
      }
    },
    watch:{
      visible: function(newVal, oldVal){
        this.firstPlay = true;
      },
    },
  })
</script>

<style scoped lang="less">
  @import "video-dialog.less";
</style>