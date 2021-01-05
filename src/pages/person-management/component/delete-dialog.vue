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
      <el-button type="primary" @click="handleDelete">确认</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['id','visible','title','mainText','subText'],
    data() {
      return {
      }
    },
    methods: {
      handleDelete: function () {
        let param: any;

        if (this.$props.title.indexOf('部门') >= 0){
          param = this.$props.id;
        }else {
          param = {personIds:[this.$props.id]};
        }
        /*
        * 删除单个人员时传递 object
        * 删除单个部门时传递 string
        * */
        this.$emit('triggerDelete', param);
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