<template>
  <div class="table-content normal-person">
    <div class="title">
      <div class="fontBlackAndBold">人员列表</div>
      <div class="operate-btn">
        <SvgIcon name="downloadTemplate" @click="exportPersonExcel"/>
        <SvgIcon name="delete" @click="batchDeletePerson"/>
      </div>
    </div>

    <Table :table-props="tableProps" ref="table" @multipleSelectChange="multipleSelectChange">
      <template v-slot:url="{row}">
        <img :src="row.url" alt="***"/>
      </template>
      <template v-slot:operate="{row}" class="operate-btn">
        <SvgIcon name="edit" @click="triggerParentEvent('personInfo',row, 'personDialogVisible', true)"/>
        <SvgIcon name="delete" @click="toggleDialog('personId',row.personId, 'deleteDialogVisible', true)"/>
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
  import SvgIcon from '@/components/svgIcon.vue';
  import { deletePerson, createBatchImportPersonExcel } from '@/request/person';
  import {showMessageAfterRequest} from "@/utils/common";
  import { PERSON } from "@/request/type";


  export default Vue.extend({
    props:['searchParams', 'departCommonMap', 'stationCommonMap', ],
    components:{
      Table,
      AddOrUpdatePersonDialog,
      DeleteDialog,
      SvgIcon,
    },
    data() {
      return {
        tableProps:{
          url:`${PERSON}/person/personSelectList`,
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
              format: (value:number) => {
              let sex = '';
              if (value === 1){
                sex = '男'
              }else if (value === 0){
                sex = '女'
              }else {
                sex = '未填写'
              }
                return sex
              }
            },
            {prop:'ipNum',label:'身份证号',width: 200},
            {prop:'phone',label:'手机号',},
            {prop:'departId',label:'部门',
              format: (value:string) => {
                return this.$props.departCommonMap.get(value);
              }
            },
            {prop:'station',label:'岗位',
              format: (value:string) => {
                return this.$props.stationCommonMap.get(value);
              }
            },
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

        deletePerson(personIds).then(res=>{
          showMessageAfterRequest(res.data, '删除人员成功', '删除人员失败');
          //@ts-ignore
          res.data === true ? this.$emit('initTableAndSelectListAndTree') : '';
        })
      },
      exportPersonExcel: function () {
        let formData = new FormData();
        formData.append('companyCode','1');

        createBatchImportPersonExcel(formData).then(res=>{})
      },
      loadTable: function (data:object) {
        //@ts-ignore
        this.$refs.table.initTable(data);
      }
    },
  })
</script>

<style scoped lang="less">
  @import "tableList.less";
</style>