<template>
  <div class="exception-item bgcAndShadow">
    <div class="title">
      <div class="fontBlackAndBold">发生时间：{{data.createTime}}</div>
      <div class="operate-btn">
        <div class="cursor" @click="showDetailDialog()">···</div>
        <SvgIcon name="delete" @click="handleDelete(data)"/>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <img :src="data.imageUrl || require('@/assets/supervise-public.jpeg')" alt="***"/>
        <i class="el-icon-video-play play-icon" @click="showDetailDialog"/>
      </div>

      <div class="right">
        <div>事件类型:<span>{{handleEventTypeCommon(data.exceptionType)}}</span></div>
        <div>所属任务:<span>{{data.projectName}}</span></div>
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
    </div>

<!--    <VideoDialog :visible="visible" :video-data="data" @close="close"/>-->
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import VideoDialog from './video-dialog.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getExceptionDetail } from '@/request/exception';

  export default Vue.extend({
    props:{
      data:{
        type: Object,
        required:true,
        default: function () {
          return {
            createTime: '',
            projectName:'',
            type:'',
            arrangeName:'',
            persons:[],
            eventName:'',
            isDeal:'',
            exceptionId:'',
            imageUrl:'',
            videoUrl:'',
            cameraName:'',
            boxName:'',
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
      formatPersons: function (list = []) {
        let personText = list.map((person:any)=>{
          return person.personName
        })
        return personText.join('、');
      },
      showDetailDialog: function () {
        this.$emit('showDetailDialog', true, this.$props.data);
      },
      handleDelete: function (item:object) {
        this.$emit('delete', item);
      },
      close: function () {
        this.visible = false;
      },
      handleUpdate: function (value:boolean) {
        let {groupAutoId} = this.$props.data;
        let isDeal = value === true ? 0 : 1;

        this.$emit('updateItem', {groupAutoId, isDeal});
      },
      handleEventTypeCommon: function(type:number){
        let text = '人脸识别';
        switch (type) {
          case 101:
            text = '高空作业安全带';
            break;
          case 103:
            text = '火灾';
            break;
          case 104:
            text = '安全帽';
            break;
          case 105:
            text = '静止';
            break;
          case 106:
            text = '反光衣';
            break;
          case 107:
            text = '人员入侵';
            break;
          case 108:
            text = '跌倒';
            break;
        }
        return text;
      },
    },
  })
</script>

<style scoped lang="less">
  @import "exception-item.less";
</style>