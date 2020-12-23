<template>
  <div class="table-content normal-person">
    <div class="title">
      <div class="fontBlackAndBold">人员列表</div>
      <div class="operate-btn">
        <i class="el-icon-edit"/>
        <i class="el-icon-folder-add"/>
        <i class="el-icon-delete"/>
      </div>
    </div>

    <Table :table-props="tableProps" ref="table" @multipleSelectChange="multipleSelectChange">
      <template v-slot:img="{row}">
        <img :src="require('@/assets/mission-person.jpg')" alt="头像"/>
      </template>
      <template v-slot:operate="{row}" class="operate-btn">
        <i class="el-icon-edit" @click="deploy += 1"/>
        <i class="el-icon-delete" @click="toggleDialog('personId',row.id, 'deleteDialogVisible', true)"/>
      </template>
    </Table>

    <DetailDialog :person-info="personInfo" :visible="detailDialogVisible" @close="toggleDialog" />
    <DeleteDialog
        :personId="personId"
        :visible="deleteDialogVisible"
        @close="toggleDialog"
        title="删除人员"
        main-text="确认删除部门吗？"
        sub-text="删除后部门内的人员同时被删除，请谨慎操作！"
    />
    <DeployDialog :deploy="deploy" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Table from '@/components/table/index.vue';
  import DetailDialog from './component/detail-dialog.vue';
  import DeleteDialog from './component/delete-dialog.vue';
  import DeployDialog from './component/add-or-edit-department-dialog.vue';

  export default Vue.extend({
    components:{
      Table,
      DetailDialog,
      DeleteDialog,
      DeployDialog,
    },
    data() {
      return {
        tableProps:{
          url:'/mock/project-control/person/notActivePersonSelectList',
          rowKey:'id',
          firstColumn:{
            show:true,
            type:'selection',
            width:50,
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'img',label:'照片',insertHtml:true,},
            {prop:'name',label:'姓名',},
            { prop:'sex',label:'性别',
              format: function (value:number) {
                return value === 0 ? '男' : '女'
              }
            },
            {prop:'idCard',label:'身份证号',width: 200},
            {prop:'phone',label:'手机号',},
            {prop:'department',label:'部门',},
            {prop:'station',label:'岗位'},
            {prop:'code',label:'工号'},
            {prop:'remark',label:'备注'},
            {prop:'operate',label:'操作',insertHtml:true,width:100},
          ],
        },
        personInfo:{},
        personId:'',
        deploy:0,
        detailDialogVisible:false,
        deleteDialogVisible:false,
      }
    },
    methods: {
      operatePerson: function (id:string, type:string) {
        console.log(id)
        console.log(type)
      },
      multipleSelectChange: function (selection:[]) {
        console.log(selection);
      },
      toggleDialog: function (key1:any, value1:any, key2:any, value2:any ) {
        //@ts-ignore
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      }
    },
  })
</script>

<style scoped lang="less">
  @import "normal-person.less";
</style>