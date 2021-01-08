<template>
  <div class="exception-item bgcAndShadow">
    <div class="title">
      <div class="fontBlackAndBold">发生时间：{{data.time}}</div>
      <div class="operate-btn">
        <div class="cursor" @click="showDetailDialog()">···</div>
<!--        <i class="el-icon-delete" @click="handleDelete(data.id)"/>-->
        <SvgIcon name="delete" @click="handleDelete(data.id)"/>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
        <i class="el-icon-video-play play-icon" @click="visible = true"/>
      </div>

      <div class="right">
        <div>事件类型:<span>{{data.type}}</span></div>
        <div>所属任务:<span>{{data.project}}</span></div>
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
    </div>

    <VideoDialog :visible="visible" @close="close"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import VideoDialog from './video-dialog.vue';
  import SvgIcon from '@/components/svgIcon.vue';

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
            id:'',
          }
        }
      }
    },
    components:{
      VideoDialog,
      SvgIcon
    },
    data(){
      return {
        visible:false
      }
    },
    methods: {
      showDetailDialog: function () {
        this.$emit('showDetailDialog', true, this.$props.data);
      },
      handleDelete: function (id:string | number) {
        this.$emit('delete', id);
      },
      close: function () {
        this.visible = false;
      }
    },
  })
</script>

<style lang="less">
  @import "exception-item.less";
</style>