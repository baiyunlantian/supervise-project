<template>
  <el-dialog
      title="批量导入人员"
      :visible="batchImportPersonVisible"
      :show-close="false"
      custom-class="batch-import-person-dialog-container"
      width="500px"
  >
    <div class="body">
      <div class="form-item">
        <div class="label">部门：</div>
        <el-select v-model="importDepartId" clearable @change="validDepart">
          <el-option
              v-for="(option, index) in departSelectList"
              :key="index"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
      </div>
      <div class="error-text" v-if="!validDepartId">请选择部门</div>
    </div>

    <template slot="footer">
      <el-upload
          ref="upload"
          class="upload-demo"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :show-file-list="false"
          :limit="1"
          action="#"
          :http-request="customUpload"
      >
      </el-upload>
      <el-button type="primary" @click="submit">导入</el-button>
      <el-button type="default" @click="close">取消</el-button>
    </template>

  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {batchImportPerson} from "@/request/person";

  export default Vue.extend({
    props:['batchImportPersonVisible','departSelectList'],
    data() {
      return {
        importDepartId:'',
        validDepartId:true,
      }
    },
    methods: {
      close: function () {
        this.$emit('close');
        this.importDepartId = '';
      },
      customUpload: function (file:any) {
        let formData = new FormData();
        formData.append('companyCode',sessionStorage.getItem('companyCode') || '');
        formData.append('departId',this.importDepartId);
        formData.append('file',file.file);

        batchImportPerson(formData).then((response:any)=>{
          let promise = response.json();
          if (response.status === 202){
            promise.then((data:any)=>{
              this.$message({
                type:'error',
                message:data.msg || '导入失败',
              });
            })
          }else if (response.status === 200){
            promise.then((data:any)=>{
              if (data.data.failList && data.data.failList.length > 0){
                this.$emit('toggleFailVisible', true, data.data.failList)
              }else {
                this.$message({
                  type:'success',
                  message:'导入成功',
                });
                this.$emit('initTableAndSelectListAndTree');
              }
            })
          }else if (response.status >= 500){
            this.$message({
              type:'error',
              message:'导入失败',
            });
          }else if (response.status === 401){
            promise.then((data:any)=>{
              this.$message({
                type:'error',
                message:data.msg || '登录凭证已失效，请重新登录',
              });
              sessionStorage.clear();
              this.$router.push('/login');
            })
          }
          this.close();
        })
      },
      submit: function () {
        if (this.importDepartId){
          //@ts-ignore
          this.$refs['upload'].$children[0].$refs.input.click();
        }else{
          this.validDepartId = false;
        }
      },
      validDepart: function (option:any) {
        if (option && option.length > 0){
          this.validDepartId = true;
        }
      },
    },
  })
</script>

<style scoped lang="less">
  @import "batch-import-dialog.less";
</style>