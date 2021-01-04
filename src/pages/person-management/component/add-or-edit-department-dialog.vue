<template>
  <el-dialog
      :visible.sync="visible"
      custom-class="deploy-dialog-container"
      :show-close="false"
      width="500px"
      :title="title"
  >
    <div class="content">
      <span>部门名称</span>
      <el-input v-model="name"/>
    </div>

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
      }
    },
    methods: {
      close: function () {
        this.$emit('close','addOrEditDialogVisible',false);
      },
      onOk: function () {
        let id = '';
        if (this.$props.okText === '修改'){
          id = this.$props.department.departId;
        }else {
          console.log(this.$props.department)
          id = this.$props.department.fatherId || sessionStorage.getItem('companyCode') || '123456';
        }
        this.$emit('submit', this.name, id);
      },
    },
    watch:{
      department:{
        handler: function (newVal, oldVal) {
          this.name = newVal.name;
        },
        deep:true
      },
    },
  })
</script>

<style scoped lang="less">
  @import "add-or-edit-department-dialog.less";
</style>