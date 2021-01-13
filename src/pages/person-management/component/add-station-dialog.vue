<template>
  <el-dialog
      :visible="visible"
      custom-class="deploy-dialog-container"
      :show-close="false"
      width="500px"
      title="添加岗位"
      append-to-body
  >
    <div class="content">
      <span>岗位：</span>
      <el-input v-model="name" @blur="checkValid"/>
    </div>
    <div class="tip" v-show="!valid">{{tipText}}</div>

    <template slot="footer">
      <el-button type="primary" @click="onOk">添加</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {addStation} from "@/request/department";
  import { IllegalString } from "@/utils/common";

  export default Vue.extend({
    props:['visible',],
    data() {
      return {
        name:'',
        valid:true,
        tipText:'',
      }
    },
    methods: {
      checkValid: function () {
        if (this.name){

          if(IllegalString.test(this.name)){
            this.valid = false;
            this.tipText = '含有非法字符';
          }else {
            this.valid = true;
          }

          if (this.name.length > 10){
            this.valid = false;
            this.tipText = '最大长度为10个字';
          }else {
            this.valid = true;
          }

        }else {
          this.tipText = '请填写岗位名称';
          this.valid = false;
        }
      },
      onOk: function () {
        this.checkValid();

        if (!this.valid) return;

        addStation({stationName:this.name}).then(res=>{
          let result = res.data;

          this.$message({
            type:result === true ? 'success' : 'error',
            message:`新增${result === true ? '成功' : '失败'}`,
          })

          this.close();
          this.$emit('refreshList', result);
        })
      },
      close: function () {
        this.name = '';
        this.$emit('close',false);
      }
    },
  })
</script>

<style scoped lang="less">
  @import "add-or-edit-department-dialog.less";
</style>