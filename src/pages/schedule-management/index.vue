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
          <SearchInput placeholder="输入任务名称搜索" @search="value=>setData(value,'missionName')"/>
        </div>

        <div class="right">
          <div class="mission-status">
            <span>任务状态：</span>
            <span :class="{active: missionStatus === 0}" @click="setData(0,'missionStatus')">全部</span>
            <span>|</span>
            <span  :class="{active: missionStatus === 1}" @click="setData(1,'missionStatus')">未开始</span>
            <span>|</span>
            <span  :class="{active: missionStatus === 2}" @click="setData(2,'missionStatus')">进行中</span>
            <span>|</span>
            <span  :class="{active: missionStatus === 3}" @click="setData(3,'missionStatus')">已结束</span>
          </div>

          <div class="operate-btn">
            <i class="el-icon-folder-add" />
            <i class="el-icon-delete" />
          </div>
        </div>
      </div>

      <Table
        :table-props="tableProps"
        ref="table"
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

        <template v-slot:serviceStatus="{row}">
          <span v-if="row.serviceStatus === 1">未领取</span>
          <span v-else-if="row.serviceStatus === 2" class="active">已领取</span>
          <span v-else-if="row.serviceStatus === 3" class="green">已归还</span>
        </template>

        <template v-slot:missionStatus="{row}">
          <span v-if="row.missionStatus === 1">未开始</span>
          <span v-else-if="row.missionStatus === 2" class="active">进行中</span>
          <span v-else-if="row.missionStatus === 3" class="green">已结束</span>
        </template>

        <template v-slot:operate="{row}">
          <div class="operate-btn">
            <router-link :to="{ path: '/schedule-management/mission-detail', query: { missionId: row.id }}">
              ···
            </router-link>
            <i class="el-icon-delete" />
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

  export default Vue.extend({
    components:{
      SearchInput,
      SearchForm,
      Table,
      ScheduleDialog,
    },
    data() {
      return {
        formItemsProp:[
          {key:'time',label:'任务时间',type:'daterange'},
          {key:'person',label:'人员',type:'input'},
          {key:'service',label:'设备',type:'select',
            options:[
              {value:1,label:'设备1'},
              {value:2,label:'设备2'},
              {value:3,label:'设备3'},
              {value:4,label:'设备4'},
            ]
          },
          {key:'status',label:'设备状态',type:'select',
            options:[
              {value:1,label:'未领取'},
              {value:2,label:'已领取'},
              {value:3,label:'已归还'},
            ]
          },

        ],
        tableProps:{
          url:'/mock/schedule-management/missionSelectList',
          rowKey:'id',
          firstColumn:{
            show:true,
            type:'selection'
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'time',label:'任务起止时间'},
            {prop:'name',label:'任务名称'},
            {prop:'personCount',label:'安排人员',insertHtml:true,width:300},
            {prop:'service',label:'绑定设备'},
            {prop:'serviceStatus',label:'设备状态',insertHtml:true},
            {prop:'missionStatus',label:'任务状态',insertHtml:true},
            { prop:'reporterStatus',label:'监督施工报告',
              format:function (value:number) {
                return value === 0 ? '' : '报告已生成'
              }
            },
            {prop:'operate', label:'操作',insertHtml:true}
          ],
        },
        searchParam:{},
        missionStatus:0,
        missionName:'',
        visible:false,
      }
    },
    methods: {
      toggleDialog: function (visible:boolean) {
        this.visible = visible;
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
          missionName:this.missionName,
          missionStatus:this.missionStatus,
          ...this.searchParam,
          ...params,
        };

        Object.keys(data).forEach(key=>{
          if (!data[key]) {
            delete data[key];
          }else if (key === 'time'){
            data.startTime = moment(data.time[0]).format('yyyy.MM.DD');
            data.endTime = moment(data.time[1]).format('yyyy.MM.DD');
            delete data.time;
          }
        })

        console.log(data);
        //@ts-ignore
        this.$refs.table.initTable(data);
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>