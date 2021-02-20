<template>
  <div class="detail-main-content-container">
    <div class="left">
      <div>发布时间:<span>{{data.createTime}}</span></div>
      <div>所属任务:<span>{{data.projectName}}</span></div>
      <div>事件类型:<span>{{handleEventTypeCommon(data.exceptionType)}}</span></div>
      <div>事件名称:<span>{{data.eventName}}</span></div>
      <div>异常来源:<span>{{data.boxName}}</span></div>
      <div>关联人员:<span>{{formatPersons(data.persons)}}</span></div>
      <div>异常情况:<span>{{data.info}}</span></div>
      <div>
        异常状态:
        <el-switch
            v-model="data.isDeal === 0 ? true : false"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="未处理"
            inactive-text="已处理"
            @change="handleUpdate"
        >
        </el-switch>
      </div>
    </div>

    <div class="right">
      <div class="main-video">
        <video
            ref="videoPlayer"
            class="video-player"
            @error="playError"
            muted
            :style="{backgroundImage:renderVideoBcgImg}"
        />
        <SvgIcon name="play" width="1.09375rem" height="1.09375rem" color="rgb(255,255,255)" v-on:click="play()" v-if="!playStatus"/>
        <SvgIcon name="pause" width="1.09375rem" height="1.09375rem" color="rgb(255,255,255)" @click="pause()" v-else-if="playStatus && !loadingStatus" />
        <i class="el-icon-loading" v-if="loadingStatus" />
      </div>

      <template v-if="imageList">
        <div class="sub-img">
          <img
              v-for="(item, index) in imageList"
              :key="index"
              :src="item.imageUrl"
              class="sub-img"
              :class="{active:imageIndex === index}"
              @click="changeMainImage(index)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import flvjs from "flv.js/dist/flv.min.js";
  import {reloadEventVideo} from "@/request/exception";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      SvgIcon
    },
    props:{
      data:{
        type: Object,
        required:true,
        default: function () {
          return {
            createTime: '',
            projectName:'',
            exceptionType:'',
            eventName:'',
            persons:[],
            isDeal:0,
            exceptionId:'',
            picUrl:'',
            videoUrl:'',
            cameraName:'',
            boxName:'',
          }
        }
      },
      imageList: {
        type: Array,
        required: false,
      },
    },
    data(){
      return{
        imageIndex:0,
        playerRef:'',
        playStatus:false,
        firstPlay:true,
        loadingStatus:false,
      }
    },
    computed:{
      renderVideoBcgImg:function () {
        const {imageList, data} = this.$props;
        //@ts-ignore
        return imageList && imageList[this.imageIndex]
          //@ts-ignore
          ? `url(${imageList[this.imageIndex].imageUrl})`
          : `url(${data.imageUrl})`
      },
    },
    methods: {
      formatPersons: function (list = []) {
        let personText = list.map((person:any)=>{
          return person.personName
        })
        return personText.join('、');
      },
      handleUpdate: function (value:boolean) {
        let {groupAutoId} = this.$props.data;
        let isDeal = value ? 0 : 1;

        this.$emit('updateItem', {groupAutoId, isDeal});
      },
      handleEventTypeCommon: function(type:number){
        let text = '人脸异常';
        switch (type) {
          case 101:
            text = '登高异常';
            break;
          case 103:
            text = '火灾异常';
            break;
          case 104:
            text = '安全帽异常';
            break;
          case 105:
            text = '静止异常';
            break;
          case 106:
            text = '反光衣异常';
            break;
          case 107:
            text = '区域异常';
            break;
          case 108:
            text = '跌倒异常';
            break;
        }
        return text;
      },
      changeMainImage: function (index?:number) {
        //切换图片时重置播放器状态
        this.playStatus = false;
        this.firstPlay = true;
        index >= 0 ? this.imageIndex = index : '';
        this.playerRef.pause();
        this.playerRef.unload();
        this.playerRef.detachMediaElement();
        this.playerRef.destroy();
      },
      play: function(){
        //  判断是在detail-dialog.vue还是在index.vue点击播放按钮
        // this.$props.imageList == undefined  展开详情框，否则直接播放视频
        if (this.$props.imageList == undefined){
          this.$emit('showDetailDialog',true);
          return
        }

        this.playStatus = true;
        this.loadingStatus = true;
        if(flvjs.isSupported()){
          if (this.firstPlay) {

            this.playerRef = flvjs.createPlayer({
              type: 'mp4',
              url: this.$props.imageList[this.imageIndex].videoUrl
            });

            //@ts-ignore
            this.playerRef.attachMediaElement(this.$refs.videoPlayer)
          }

          //play放在外面，避免视频播放途中点击暂停再点击播放时，视频重新加载
          setTimeout(()=>{
            this.loadingStatus = false;
            this.firstPlay = false;
            this.playerRef.load()
            this.playerRef.play()
          },2000)

        }else{
          this.$message.error('不支持的格式');
          return;
        }
      },
      pause: function () {
        this.playStatus = false;
        this.playerRef.pause()
      },
      playError: function (e:any) {
        this.playStatus = false;
        this.loadingStatus = false;
        this.$message({
          type:'error',
          message:'播放失败，重新加载中！'
        });

        const {exceptionType} = this.$props.data;
        const {exceptionId} = this.$props.imageList[this.imageIndex];
        reloadEventVideo({exceptionId, exceptionType}).then((res:any)=>{
          showMessageAfterRequest(res.data,'加载成功，请刷新页面！','加载失败，请稍后重试！')
        })
      }
    },
  })
</script>

<style lang="less">
  @import "detail-main-content.less";
</style>