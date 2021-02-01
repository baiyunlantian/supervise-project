<template>
  <el-dialog
    :visible="visible"
    :show-close="false"
    custom-class="detail-dialog"
    width="800px"
  >
    <template slot="title">
      <div class="el-dialog__title">异常事件详情</div>
      <i class="el-icon-close" @click="close"/>
    </template>

    <DetailMainContent
        :data="detailData"
        :image-list="imageAndVideoList"
        @toggleVideo="toggleVideo"
        @updateItem="updateItem"
    />

    <div class="person-list">
      <div class="title">关联人员信息</div>
      <div class="list">
        <div class="item" v-for="(person,index) in detailData.persons">
          <div class="img">
            <img :src="person.personUrl" :alt="person.personName"/>
          </div>
          <div class="info">
            <div><span class="label">姓名</span><span>:</span>{{person.personName}}</div>
            <div><span class="label">性别</span><span>:</span>{{['女','男','未填写'][person.sex]}}</div>
            <div><span class="label">身份证号</span><span>:</span>{{person.ipNum}}</div>
            <div><span class="label">手机号</span><span>:</span>{{person.phone}}</div>
            <div><span class="label">部门</span><span>:</span>{{person.departName}}</div>
            <div><span class="label">岗位</span><span>:</span>{{person.stationName}}</div>
            <div><span class="label">工号</span><span>:</span>{{person.code}}</div>
            <div><span class="label">备注</span><span>:</span>{{person.remark}}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import DetailMainContent from './detail-main-content.vue';
  import VideoDialog from './video-dialog.vue';
  import { updateEvent, getExceptionDetail } from '@/request/exception';
  import { getStationList } from "@/request/common";
  import {showMessageAfterRequest} from "@/utils/common";


  export default Vue.extend({
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
            imageUrl:'',
            cameraName:'',
            boxName:'',
          }
        }
      },
      visible:{
        required:true,
        type:Boolean,
      },
    },
    components:{
      DetailMainContent,
      VideoDialog,
    },
    data() {
      return {
        videoVisible:false,
        detailData:{},
        stationCommonMap: new Map(),
        imageAndVideoList:[],
      }
    },
    methods: {
      close: function () {
        this.$emit('close',false);
      },
      toggleVideo: function (res = false) {
        this.videoVisible = res;
      },
      updateItem: function (data:any) {
        updateEvent(data).then(res=>{
          showMessageAfterRequest(res.data, '更新成功','更新失败');
          //@ts-ignore
          if (res.data === true){
            this.$emit('initList');

            this.$set(this.detailData, 'isDeal', data.isDeal);
          }
        })
      },
    },
    watch:{
      data:{
        handler: function (newVal, oldVal) {
          this.detailData = JSON.parse(JSON.stringify(newVal));
        },
        deep:true
      },
      visible: function (newVal, oldVal) {
        if (newVal === true){
          let {exceptionType, groupId} = this.$props.data;
          getExceptionDetail({exceptionType, groupId}).then(res=>{
            if (res.data){
              this.imageAndVideoList = res.data;
            }
          })
        }
      }
    },
    mounted(): void {
      getStationList().then((res:any)=>{
        if (!res.data) return;
        let stationCommonMap = new Map();

        if (res.data.list && res.data.list.length > 0) {
          res.data.list.forEach((item:any)=>{
            stationCommonMap.set(item.stationId, item.stationName);
          })

          this.stationCommonMap = stationCommonMap;
        }
      })
    }
  })
</script>

<style scoped lang="less">
  @import "detail-dialog.less";
</style>