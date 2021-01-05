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
    <div class="tip" v-show="!valid">请填写岗位名称</div>

    <template slot="footer">
      <el-button type="primary" @click="onOk">添加</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['visible',],
    data() {
      return {
        name:'',
        valid:true,
      }
    },
    methods: {
      checkValid: function () {
        this.valid = this.name ? true : false;
      },
      onOk: function () {
        if (this.name){
          this.valid = true;
        }else {
          this.valid = false;
          return;
        }

        console.log(this.name)
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