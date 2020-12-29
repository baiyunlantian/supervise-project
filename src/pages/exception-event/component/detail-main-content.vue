<template>
  <div class="detail-main-content-container">
    <div class="left">
      <div>发布时间:<span>{{data.time || ''}}</span></div>
      <div>所属项目:<span>{{data.project}}</span></div>
      <div>事件类型:<span>{{data.type}}</span></div>
      <div>事件名称:<span>{{data.name}}</span></div>
      <div>异常来源:<span>{{data.source}}</span></div>
      <div>关联人员:<span>{{data.person}}</span></div>
      <div>异常情况:<span>{{data.info}}</span></div>
      <div>
        异常状态:
        <el-switch
            v-model="data.status === 0 ? true : false"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="未处理"
            inactive-text="已处理"
        >
        </el-switch>
      </div>
    </div>

    <div class="right">
      <div class="main-video">
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
        <i class="el-icon-video-play play-icon"/>
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

  export default Vue.extend({
    props:{
      data:{
        type: Object,
        required:true,
        default: function () {
          return {
            time: '',
            project:'',
            type:'',
            name:'',
            source:'',
            person:'',
            info:'',
          }
        }
      }
    },
    data() {
      return {
      }
    },
    methods: {},
  })
</script>

<style lang="less">
  @import "detail-main-content.less";
</style>