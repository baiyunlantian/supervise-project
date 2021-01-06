<template>
  <div id="equipment-management-container">
    <div class="top">
      <div
          class="item"
          v-for="(item, index) in censusConfig"
          :key="index"
          :class="item.key"
      >
        <div class="img">
          <img :src="item.img" alt="***"/>
        </div>
        <div class="text">{{item.label}}</div>
        <div class="count">{{census[item.key]}}</div>
      </div>
    </div>

    <SearchForm
        :form-data="searchParams"
        :form-items-prop="formItemsProp"
        @search="search"
    />

    <div class="table-content">
      <div class="title fontBlackAndBold">设备列表</div>

      <Table :table-props="tableProps" ref="table">
        <template v-slot:expandContent="{row}">
          <table class="expand-content">
            <tr
                class="item"
                v-for="(item,index) in row.cameraList"
                :key="index"
            >
              <td>{{item.name}}</td>
              <td>{{item.ip}}</td>
              <td>{{item.port}}</td>
              <td>{{item.account}}</td>
              <td>{{item.password}}</td>
              <td v-if="item.status === 0" :style="{color: 'rgb(0, 161, 76)'}">在线</td>
              <td v-else-if="item.status === 1" :style="{color: '#565656'}">离线</td>
              <td v-else-if="item.status === 2" :style="{color: 'rgb(255, 59, 59)'}">故障</td>
              <td v-else-if="item.status === 3" :style="{color: 'rgb(255, 186, 0)'}">闲置</td>
              <td>{{item.remark}}</td>
            </tr>
          </table>
        </template>

        <template v-slot:status="{row}">
          <span v-if="row.status === 0" :style="{color: 'rgb(0, 161, 76)'}">在线</span>
          <span v-else-if="row.status === 1" :style="{color: '#565656'}">离线</span>
          <span v-else-if="row.status === 2" :style="{color: 'rgb(255, 59, 59)'}">故障</span>
          <span v-else-if="row.status === 3" :style="{color: 'rgb(255, 186, 0)'}">闲置</span>
        </template>

        <template v-slot:operate="{row}">
          <i class="el-icon-edit" @click="handleClickEdit(row)"/>
          <i class="el-icon-delete" @click="handleClickDelete(row.id)"/>
        </template>
      </Table>
    </div>

    <Dialog
        :visible="visible"
        :initialValue="dialogData"
        @close="close"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Table from '@/components/table/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import Dialog from './dialog.vue';
  import { getEquipmentCensus, deleteEquipment } from "@/request/equipment";
  import {showMessageAfterRequest} from "@/utils/common";

  const statusCommon = [
    {value:0,label:'在线'},
    {value:1,label:'离线'},
    {value:2,label:'故障'},
    {value:3,label:'闲置'},
  ];


  export default Vue.extend({
    components:{
      Table,
      SearchForm,
      Dialog,
    },
    data() {
      return {
        census:{},
        searchParams:{},
        censusConfig:[
          {key:'total',label:'设备总数',img:require('@/assets/logout.png')},
          {key:'onLine',label:'在线设备',img:require('@/assets/person/add-group.png')},
          {key:'offLine',label:'离线设备',img:require('@/assets/person/adduser.png')},
          {key:'error',label:'故障设备',img:require('@/assets/person/batch-import.png')},
          {key:'stop',label:'闲置设备',img:require('@/assets/person/set-station.png')},
        ],
        formItemsProp:[
          {key:'name',label:'设备名称',type:'input'},
          {key:'status',label:'设备状态',type:'select',
            options:statusCommon
          },
        ],
        status:statusCommon,
        tableProps:{
          url:'/mock/equipment-management/selectList',
          rowKey:'id',
          highlight:true,
          pagination:{
            pageSize:12
          },
          firstColumn:{
            show:true,
            type:'expand',
            width:100
          },
          tableColumn:[
            {prop:'name',label:'设备名称'},
            {prop:'ip',label:'IP'},
            {prop:'port',label:'端口'},
            {prop:'account',label:'账号'},
            {prop:'password',label:'密码'},
            {prop:'status',label:'状态',insertHtml:true},
            {prop:'remark',label:'备注'},
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        visible:false,
        dialogData:{},
      }
    },
    methods: {
      search: function (data?:object) {
        //@ts-ignore
        this.initTable(data);
      },
      close: function (operate:string) {
        this.visible = false;

        if (operate === 'refresh'){
          this.initTable(this.searchParams);
        }
      },
      handleClickEdit: function (row:object) {
        this.visible = true;
        this.dialogData = row;
      },
      handleClickDelete: function (id:number | string) {
        this.$confirm('确定该删除设备吗？')
          .then(res=>{
            deleteEquipment({id}).then(res=>{
              showMessageAfterRequest(res.data, '删除成功', '删除失败');
              res.data === true ? this.initTable(this.searchParams) : '';
            })
          })
          .catch(e=>{
            //cancel
            console.log(e)
          })
      },
      initTable: function (data = {}) {
        //@ts-ignore
        this.$refs.table.initTable(data);
      }
    },
    mounted(): void {
      getEquipmentCensus().then(res=>{
        if (!res.data) return;
        let total = 0;
        Object.keys(res.data).forEach(key=>{
          total += res.data[key];
        })
        this.census = {total, ...res.data};
      })
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>