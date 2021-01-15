<template>
  <el-dialog
      :visible="visible"
      custom-class="deploy-dialog-container"
      :show-close="false"
      width="500px"
      :title="title"
  >
    <div class="content">
      <span>部门名称</span>
      <el-input v-model="name" @input="checkValid"/>
    </div>
    <div class="tip" v-show="!valid">{{tipText}}</div>

    <template slot="footer">
      <el-button type="primary" @click="onOk">{{okText}}</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Form from '@/components/form/index.vue';
  import {IllegalString} from "@/utils/common";

  export default Vue.extend({
    props:['department','visible','title','okText'],
    components:{
      Form,
    },
    data() {
      return {
        name:'',
        valid:true,
        tipText:'',
      }
    },
    methods: {
      close: function () {
        this.$emit('close','addOrEditDialogVisible',false);
      },
      onOk: function () {
        let id = '';
        let fatherId = this.$props.department.departId || sessionStorage.getItem('companyCode');
        if (this.$props.okText === '修改'){
          id = this.$props.department.departId;
        }else {
          id = fatherId;
        }

        if (!this.valid) return;

        this.$emit('submit', this.name, id, fatherId);
        this.close();
      },
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
          this.valid = false;
          this.tipText = '请输入部门名称';
        }
      }
    },
    watch:{
      visible: function (newVal, oldVal) {
        if (newVal === true){
          this.name = this.$props.okText === '添加' ? '' : this.$props.department.name;
        }
      }
    },
  })
</script>

<style scoped lang="less">
  @import "add-or-edit-department-dialog.less";
</style>