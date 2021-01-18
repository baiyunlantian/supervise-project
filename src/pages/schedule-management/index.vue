<template>
  <div id="schedule-management-container">
    <SearchForm
      :form-data="searchParam"
      :form-items-prop="formItemsProp"
      @search="searchTable"
    >
      <div class="add-schedule" @click="visible = true">
        <i class="el-icon-plus"/>
      </div>
    </SearchForm>

    <div class="form-content">
      <div class="title">
        <div class="left">
          <div class="fontBlackAndBold">任务管理列表</div>
          <SearchInput placeholder="输入任务名称搜索" @search="value=>setData(value,'arrangeName')"/>
        </div>

        <div class="right">
          <div class="mission-status">
            <span>任务状态：</span>
            <span :class="{active: arrangeStatus === 0}" @click="setData(0,'arrangeStatus')">全部</span>
            <span>|</span>
            <span  :class="{active: arrangeStatus === 1}" @click="setData(1,'arrangeStatus')">未开始</span>
            <span>|</span>
            <span  :class="{active: arrangeStatus === 2}" @click="setData(2,'arrangeStatus')">进行中</span>
            <span>|</span>
            <span  :class="{active: arrangeStatus === 3}" @click="setData(3,'arrangeStatus')">已结束</span>
          </div>

          <div class="operate-btn">
            <SvgIcon name="downloadTemplate" />
            <SvgIcon name="batchDelete" @click="handleClickDelete(null)"/>
          </div>
        </div>
      </div>

      <Table
          ref="table"
          :table-props="tableProps"
          @multipleSelectChange="multipleSelectChange"
      >
        <template v-slot:personList="{row}">
          <div class="custom-img-list">
            <template v-for="(item,index) in row.personList">
              <div class="img-item" v-if="index <= 5" :key="index">
                <img v-if="index < 5" :src="item.url || require('@/assets/mission-person.jpg')" :alt="item.personName"/>
                <span v-else-if="index === 5">····</span>
                <div v-if="item.type === 1" class="header">
                  <i class="el-icon-collection-tag" />
                  <span>{{item.personName}}</span>
                </div>
              </div>
            </template>
          </div>
        </template>

        <template v-slot:boxStatus="{row}">
          <span v-if="row.boxStatus === 0">未领取</span>
          <span v-else-if="row.boxStatus === 1" class="active">已领取</span>
          <span v-else-if="row.boxStatus === 2" class="green">已归还</span>
        </template>

        <template v-slot:arrangeStatus="{row}">
          <span v-if="row.arrangeStatus === 0">未开始</span>
          <span v-else-if="row.arrangeStatus === 1" class="active">进行中</span>
          <span v-else-if="row.arrangeStatus === 2" class="green">已结束</span>
        </template>

        <template v-slot:operate="{row}">
          <div class="operate-btn">
            <router-link :to="{ path: '/schedule-management/mission-detail', query: { data: row}}">
              ···
            </router-link>
            <SvgIcon name="delete" @click="handleClickDelete(row.arrangeId)"/>
          </div>
        </template>

      </Table>
    </div>

    <ScheduleDialog
        :visible="visible"
        :box-list="boxList"
        :person-select-list="personSelectList"
        @toggle="toggleDialog"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchForm from '@/components/search-form/index.vue';
  import Table from '@/components/table/index.vue';
  import SearchInput from '@/components/search-input/index.vue';
  import ScheduleDialog from './component/schedule-dialog.vue';
  import moment from "moment";
  import SvgIcon from "@/components/svgIcon.vue";
  import { batchDeleteSchedule } from "@/request/schedule";
  import { getBoxList } from "@/request/equipment";
  import { getPersonSelectList } from "@/request/common";
  import {showMessageAfterRequest, insertOptionsToSearchFormItems} from "@/utils/common";
  import { PERSON, } from "@/request/type";


  export default Vue.extend({
    components:{
      SearchInput,
      SearchForm,
      Table,
      ScheduleDialog,
      SvgIcon,
    },
    data() {
      return {
        formItemsProp:[
          {key:'time',label:'任务时间',type:'daterange'},
          {key:'personId',label:'人员',type:'select',options:[]},
          {key:'boxId',label:'设备',type:'select', options:[]},
          {key:'boxStatus',label:'设备状态',type:'select',
            options:[
              {value:1,label:'未领取'},
              {value:2,label:'已领取'},
              {value:3,label:'已归还'},
            ]
          },
        ],
        tableProps:{
          url:`${PERSON}/arrange/arrangeSelectList`,
          rowKey:'arrangerId',
          firstColumn:{
            show:true,
            type:'selection',
            width:100
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'dutyStartTime',label:'任务起止时间',
              format: (value:string, row:any) => {
                return moment(value).format('yyyy.MM.DD')+'-'+moment(row.dutyEndTime).format('yyyy.MM.DD')
              }
            },
            {prop:'arrangeName',label:'任务名称'},
            {prop:'personList',label:'安排人员',insertHtml:true,width:300},
            {prop:'boxName',label:'绑定设备'},
            {prop:'boxStatus',label:'设备状态',insertHtml:true},
            {prop:'arrangeStatus',label:'任务状态',insertHtml:true},
            { prop:'reportBuild',label:'监督施工报告',
              format:function (value:number) {
                return value === 0 ? '未生成' : '已生成'
              }
            },
            {prop:'operate', label:'操作',insertHtml:true}
          ],
        },
        searchParam:{},
        arrangeStatus:0,
        arrangeName:'',
        visible:false,
        arrangeIds:[],
        personSelectList:[],
        boxList:[],
      }
    },
    methods: {
      toggleDialog: function (visible:boolean, refreshTable = false) {
        this.visible = visible;

        refreshTable === true ? this.searchTable() : '';
      },
      setData: function (value:number | string, key:string) {
        //@ts-ignore
        this.$data[key] = value;
        let data: any = {}
        data[key] = value;
        this.searchTable(data);
      },
      searchTable: function (params = {}) {
        let data: any = {
          arrangeName:this.arrangeName,
          arrangeStatus:this.arrangeStatus,
          ...this.searchParam,
          ...params,
        };

        Object.keys(data).forEach(key=>{
          if (!data[key]) {
            delete data[key];
          }else if (key === 'time'){
            data.dutyStartTime = moment(data.time[0]).format('yyyy-MM-DD')+' 00:00:00';
            data.dutyEndTime = moment(data.time[1]).format('yyyy-MM-DD')+' 00:00:00';
            delete data.time;
          }
        })

        //@ts-ignore
        this.$refs.table.initTable(data);
      },
      handleClickDelete: function (id?:string) {
        let data = {
          arrangeIds: id ? [id] : this.arrangeIds
        };

        this.$confirm('确认删除任务吗？')
          .then(ok=>{
            batchDeleteSchedule(data).then(res=>{
              showMessageAfterRequest(res.data, '删除成功', '删除失败');
              res.data === true ? this.searchTable() : '';
            })
          })
          .catch(e=>{
            console.log(e)
          })
      },
      multipleSelectChange: function (value:any) {
        this.arrangeIds = value.map((item:any)=>item.arrangeId);
      },
      initPersonSelectList: function (formData:object) {
        getPersonSelectList(formData).then((res:any)=>{
          if (!res.data) return;

          let list = res.data.list.map((item:any)=>{
            return {value:item.personId, label:item.personName}
          })

          const {targetIndex, targetItem} = insertOptionsToSearchFormItems(this.formItemsProp, 'personId', list);
          this.personSelectList = list;
          this.formItemsProp.splice(targetIndex, 1, targetItem)
        })
      }
    },
    mounted(): void {
      let formData = new FormData();
      formData.append('companyCode', sessionStorage.getItem('companyCode') || '');

      this.initPersonSelectList(formData);

      getBoxList({pageSize:40, pageNum:1}).then(res=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.boxId, label:item.name}
        })

        const {targetIndex, targetItem} = insertOptionsToSearchFormItems(this.formItemsProp, 'boxId', list);
        this.boxList = list;
        this.formItemsProp.splice(targetIndex, 1, targetItem)
      })
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>