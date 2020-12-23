<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="detail-dialog-container"
      width="800px"
  >
    <template slot="title">
      <div class="title">
        <div class="fontBlackAndBold">人员详细信息</div>
        <div class="operate-btn">
          <i class="el-icon-edit" @click="operatePerson(personInfo.id,'add')"/>
          <i class="el-icon-s-custom" @click="operatePerson(personInfo.id,'edit')"/>
          <i class="el-icon-edit-outline" @click="operatePerson(personInfo.id,'edit')"/>
        </div>
      </div>
    </template>

    <div class="form-content">
      <div>姓名：{{personInfo.name}}</div>
      <div>性别：{{personInfo.sex === 0 ? '男' : '女'}}</div>
      <div class="width35">身份证号：{{personInfo.idCard}}</div>
      <div class="width25">手机号：{{personInfo.phone}}</div>
      <div>班组：{{personInfo.group}}</div>
      <div>岗位：{{personInfo.station}}</div>
      <div class="width35"><span class="code">编号：</span><span>{{personInfo.code}}</span></div>
      <div class="width25">所属单位：{{personInfo.unit}}</div>
      <div>状态：{{personInfo.status === 0 ? '在场' : '离场'}}</div>
    </div>

    <div class="cer-title">
      <div>证书</div>
      <div class="highlight-font">+新增证书</div>
    </div>

    <div class="cer-list hiddenScrollbar">
      <div
          class="item"
          v-for="(item, index) in personInfo.certificateList"
          :key="index"
      >
        <div class="cer-info">
          <div>{{item.date}}</div>
          <div>{{item.name}}</div>
        </div>
        <div class="highlight-font show-cer-detail">查看证书>></div>
      </div>
    </div>

    <template slot="footer">
      <el-button @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { findPersonDetailById } from '@/request/project-control';

  export default Vue.extend({
    props:['visible','personInfo'],
    data() {
      return {
      }
    },
    methods: {
      operatePerson: function (id:number|string, type:string) {

      },
      close: function () {
        this.$emit('close','detailDialogVisible', false)
      }
    },
  })
</script>

<style scoped lang="less">
  @import "detail-dialog.less";
</style>