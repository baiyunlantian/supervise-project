<template>
  <div class="detail-main-content-container">
    <div class="left">
      <div>发布时间:<span>{{data.createTime}}</span></div>
      <div>所属项目:<span>{{data.arrangeName}}</span></div>
      <div>事件类型:<span>{{handleEventTypeCommon(data.type)}}</span></div>
      <div>事件名称:<span>{{data.name}}</span></div>
      <div>异常来源:<span>{{data.boxName}}-{{data.cameraName}}</span></div>
      <div>关联人员:<span>{{data.personName}}</span></div>
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
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
        <i class="el-icon-video-play play-icon" @click="toggleVideo(true)"/>
      </div>

      <div class="sub-img hiddenScrollbar">
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from "moment";

  export default Vue.extend({
    props:{
      data:{
        type: Object,
        required:true,
        default: function () {
          return {
            createTime: '',
            project:'',
            type:'',
            arrangeName:'',
            personName:'',
            info:'',
            exceptionId:'',
            picUrl:'',
            videoUrl:'',
            cameraName:'',
            boxName:'',
          }
        }
      }
    },
    methods: {
      toggleVideo: function (res:boolean) {
        this.$emit('toggleVideo',res);
      },
      handleUpdate: function (value:boolean) {
        let {exceptionId, type} = this.$props.data;
        let isDeal = value ? 0 : 1;

        this.$emit('updateItem', {exceptionId, type, isDeal});
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
    },
  })
</script>

<style lang="less">
  @import "detail-main-content.less";
</style>