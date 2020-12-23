<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="leave-dialog-container"
      width="500px"
      :title=title
  >
    <div class="content">
      <div style="color: deepskyblue">{{mainText}}</div>
      <div style="color: orange">{{subText}}</div>
    </div>

    <template slot="footer">
      <el-button type="primary" @click="handleLeave">确认</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['personId','visible','title','mainText','subText'],
    data() {
      return {
      }
    },
    methods: {
      handleLeave: function () {
        console.log('submit');
        this.close();
      },
      close: function () {
        this.$emit('close','deleteDialogVisible', false)
      },
    },
  })
</script>

<style scoped lang="less">
  @import "delete-dialog.less";
</style>