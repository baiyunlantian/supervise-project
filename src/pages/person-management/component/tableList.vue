<template>
  <div class="table-content normal-person">
    <div class="title">
      <div class="fontBlackAndBold">人员列表</div>
      <div class="operate-btn">
        <i class="el-icon-folder-add" @click="exportPersonExcel"/>
        <i class="el-icon-delete" @click="batchDeletePerson"/>
      </div>
    </div>

    <Table :table-props="tableProps" ref="table" @multipleSelectChange="multipleSelectChange">
      <template v-slot:url="{row}">
        <img :src="row.url || require('@/assets/mission-person.jpg')" alt="头像"/>
      </template>
      <template v-slot:operate="{row}" class="operate-btn">
        <i class="el-icon-edit" @click="triggerParentEvent('personInfo',row, 'personDialogVisible', true)"/>
        <i class="el-icon-delete" @click="toggleDialog('personId',row.personId, 'deleteDialogVisible', true)"/>
      </template>
    </Table>

    <DeleteDialog
        :id="personId"
        :visible="deleteDialogVisible"
        @close="toggleDialog"
        @triggerDelete="handleDeletePerson"
        title="删除人员"
        main-text="确认删除人员吗？"
        sub-text="删除后该人员有关信息将被删除，请谨慎操作！"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Table from '@/components/table/index.vue';
  import AddOrUpdatePersonDialog from './add-or-update-person-dialog.vue';
  import DeleteDialog from './delete-dialog.vue';
  import { deletePerson, createBatchImportPersonExcel } from '@/request/person';

  export default Vue.extend({
    props:['searchParams'],
    components:{
      Table,
      AddOrUpdatePersonDialog,
      DeleteDialog,
    },
    data() {
      return {
        tableProps:{
          url:'/mock/person/personSelectList',
          rowKey:'personId',
          firstColumn:{
            show:true,
            type:'selection',
            width:50,
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'url',label:'照片',insertHtml:true,},
            {prop:'name',label:'姓名',},
            { prop:'sex',label:'性别',
              format: function (value:number) {
                return value === 1 ? '男' : '女'
              }
            },
            {prop:'ipNum',label:'身份证号',width: 200},
            {prop:'phone',label:'手机号',},
            {prop:'departId',label:'部门',},
            {prop:'station',label:'岗位'},
            {prop:'code',label:'工号'},
            {prop:'remark',label:'备注'},
            {prop:'operate',label:'操作',insertHtml:true,width:100},
          ],
        },
        personId:'',
        personIds:[],
        deleteDialogVisible:false,
      }
    },
    methods: {
      multipleSelectChange: function (selection:[]) {
        this.personIds = selection;
      },
      toggleDialog: function (key1:any, value1:any, key2:any, value2:any ) {
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      triggerParentEvent: function (key1:string, value1:any, key2:string, value2:any) {
        this.$emit('toggleDialog',key1, value1, key2, value2);
      },
      batchDeletePerson: function() {
        const personIds = this.personIds.map((item:any)=>{
          return item.personId;
        })

        this.handleDeletePerson({personIds})
      },
      handleDeletePerson: function (personIds:object) {
        console.log(personIds)

        deletePerson(personIds).then(res=>{
          if (res.data){
            this.$message({
              type:'success',
              message:'删除人员成功'
            });
            //@ts-ignore
            this.$refs.table.initTable(this.$props.searchParams);
          }else {
            this.$message({
              type:'error',
              message:'删除人员失败'
            });
          }
        })
      },
      exportPersonExcel: function () {
        let formData = new FormData();
        formData.append('companyCode','1');

        createBatchImportPersonExcel(formData).then(res=>{})
      }
    },
  })
</script>

<style scoped lang="less">
  @import "tableList.less";
</style>