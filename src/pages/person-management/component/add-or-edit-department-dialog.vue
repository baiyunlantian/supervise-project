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
      <el-input v-model="name" @blur="checkValid"/>
    </div>
    <div class="tip" v-show="!valid">请填写部门名称</div>

    <template slot="footer">
      <el-button type="primary" @click="onOk">{{okText}}</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Form from '@/components/form/index.vue';

  export default Vue.extend({
    props:['department','visible','title','okText'],
    components:{
      Form,
    },
    data() {
      return {
        name:'',
        valid:true,
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

        if (this.name){
          this.valid = true;
        }else {
          this.valid = false;
          return;
        }

        this.$emit('submit', this.name, id, fatherId);
        this.close();
      },
      checkValid: function () {
        this.valid = this.name ? true : false;
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