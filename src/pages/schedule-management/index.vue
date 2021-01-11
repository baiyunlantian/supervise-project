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
        <template v-slot:personCount="{row}">
          <div class="custom-img-list">
            <template v-for="(item,index) in row.personList">
              <div class="img-item" v-if="index <= 5" :key="index">
                <img v-if="index < 5" :src="require('@/assets/mission-person.jpg')" alt="头像"/>
                <span v-else-if="index === 5">····</span>
                <div v-if="item.type === 0" class="header">
                  <i class="el-icon-collection-tag" />
                  <span>负责人</span>
                </div>
              </div>
            </template>
          </div>
        </template>

        <template v-slot:boxStatus="{row}">
          <span v-if="row.boxStatus === 1">未领取</span>
          <span v-else-if="row.boxStatus === 2" class="active">已领取</span>
          <span v-else-if="row.boxStatus === 3" class="green">已归还</span>
        </template>

        <template v-slot:arrangeStatus="{row}">
          <span v-if="row.arrangeStatus === 1">未开始</span>
          <span v-else-if="row.arrangeStatus === 2" class="active">进行中</span>
          <span v-else-if="row.arrangeStatus === 3" class="green">已结束</span>
        </template>

        <template v-slot:operate="{row}">
          <div class="operate-btn">
            <router-link :to="{ path: '/schedule-management/mission-detail', query: { arrangeId: row.arrangeId }}">
              ···
            </router-link>
            <SvgIcon name="delete" @click="handleClickDelete(row.arrangeId)"/>
          </div>
        </template>

      </Table>
    </div>

    <ScheduleDialog :visible="visible" @toggle="toggleDialog"/>
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
  import {showMessageAfterRequest} from "@/utils/common";
  import { PERSON, MOCK } from "@/request/type";


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
          {key:'personId',label:'人员',type:'input'},
          {key:'boxId',label:'设备',type:'select',
            options:[
              {value:1,label:'设备1'},
              {value:2,label:'设备2'},
              {value:3,label:'设备3'},
              {value:4,label:'设备4'},
            ]
          },
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
          rowKey:'personId',
          firstColumn:{
            show:true,
            type:'selection',
            width:100
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'time',label:'任务起止时间'},
            {prop:'arrangeName',label:'任务名称'},
            {prop:'personCount',label:'安排人员',insertHtml:true,width:300},
            {prop:'boxId',label:'绑定设备'},
            {prop:'boxStatus',label:'设备状态',insertHtml:true},
            {prop:'arrangeStatus',label:'任务状态',insertHtml:true},
            { prop:'reporterStatus',label:'监督施工报告',
              format:function (value:number) {
                return value === 0 ? '' : '报告已生成'
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
            data.dutyStartTime = moment(data.time[0]).format('yyyy.MM.DD');
            data.dutyEndTime = moment(data.time[1]).format('yyyy.MM.DD');
            delete data.time;
          }
        })

        console.log(data);
        //@ts-ignore
        this.$refs.table.initTable(data);
      },
      handleClickDelete: function (id?:string) {
        let data = {
          arrangeIds: id ? [id] : this.arrangeIds
        };

        console.log(data);
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
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>