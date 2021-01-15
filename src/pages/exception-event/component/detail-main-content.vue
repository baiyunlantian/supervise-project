<template>
  <div class="detail-main-content-container">
    <div class="left">
      <div>发布时间:<span>{{data.createTime}}</span></div>
      <div>所属项目:<span>{{data.arrangeName}}</span></div>
      <div>事件类型:<span>{{data.type}}</span></div>
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
      }
    },
  })
</script>

<style lang="less">
  @import "detail-main-content.less";
</style>