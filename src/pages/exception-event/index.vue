<template>
  <div id="exception-event-container">
    <div class="top">
      <div class="left bgcAndShadow">
        <div class="fontBlackAndBold title">异常预警统计</div>
        <div class="content">
          <div class="img">
            <SvgIcon
                name="exceptionCensus"
                color="#fff"
            />
          </div>
          <div class="item">
            <div class="label">总预警统计</div>
            <div class="count" style="color: rgb(255, 114, 0)">{{exceptionCensus.total || 0}}</div>
          </div>
          <div class="item">
            <div class="label">今日异常预警统计</div>
            <div class="count" style="color: rgb(255, 156, 0)">{{exceptionCensus.today || 0}}</div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="fontBlackAndBold title">今日异常预警分析</div>
        <WarningCensus :data="warningCensus"/>
      </div>
    </div>

    <div class="exception-content">
      <div class="left bgcAndShadow">
        <div class="fontBlackAndBold title">最新异常预警信息</div>

        <div class="content">
          <div class="lately-item bgcAndShadow" v-if="latelyList && latelyList.length > 0">
            <div class="operate-btn">
              <div class="cursor" @click="showDetailDialog(true, latelyList[0])">···</div>
              <SvgIcon name="delete" @click="deleteItem(latelyList[0])"/>
            </div>

            <DetailMainContent
                :data="latelyList[0]"
                @toggleVideo="(res)=>showDetailDialog(res, latelyList[0])"
                @updateItem="updateItem"
            />
          </div>

          <div class="items">
            <ExceptionItem
                v-for="(item,index) in latelyList.slice(1,5)"
                :key="index"
                :data="item"
                @showDetailDialog="showDetailDialog"
                @delete="deleteItem"
                @updateItem="updateItem"
            />
          </div>
        </div>
      </div>

      <div class="right bgcAndShadow">
        <div class="title">
          <div class="fontBlackAndBold">历史预警列表</div>
          <router-link to="/exception-event/history-list">查看更多>></router-link>
        </div>

        <Table
            ref="exceptionTable"
            :table-props="tableProps"
            @updatePagination="initLatelyList"
        >
          <template v-slot:isDeal="{row}">
            <span v-if="row.isDeal === 0" style="color: #ff4949">未处理</span>
            <span v-else style="color: #13ce66">已处理</span>
          </template>

          <template v-slot:operate="{row}">
            <div class="cursor" style="color: #0072ff" @click="showDetailDialog(true, row)">>></div>
          </template>
        </Table>
      </div>
    </div>

    <DetailDialog
        :visible="detailVisible"
        :data="detailData"
        @close="showDetailDialog"
        @initList="initHistoryList"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WarningCensus from '@/components/warning-census/index.vue';
  import Table from '@/components/table/index.vue';
  import DetailMainContent from './component/detail-main-content.vue';
  import ExceptionItem from './component/exception-item.vue';
  import DetailDialog from './component/detail-dialog.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getExceptionCensus, deleteEvent, updateEvent } from '@/request/exception';
  import { BOX } from "@/request/type";
  import moment from "moment";
  import {showMessageAfterRequest} from "@/utils/common";


  export default Vue.extend({
    components:{
      Table,
      WarningCensus,
      DetailMainContent,
      ExceptionItem,
      DetailDialog,
      SvgIcon,
    },
    data() {
      return {
        exceptionCensus:{
          total:0,
          today:0
        },
        warningCensus:{
          face:0,
          helmet:0,
          region:0,
          refectiveVest:0,
          climbHeight:0,
          motionless:0,
          fire:0,
          tumble:0
        },
        latelyList:[],
        tableProps:{
          url:`${BOX}/event/eventSelect`,
          rowKey:'exceptionId',
          hiddenPagination:true,
          params:{
            pageSize:17,
          },
          tableColumn:[
            {prop:'createTime',label:'时间',
              format: function (value:string) {
                return moment(value).format('MM-DD HH:mm:ss')
              }
            },
            {prop:'type',label:'事件类型'},
            {prop:'project',label:'所属项目'},
            {prop:'arrangeName',label:'事件名称'},
            {prop:'boxName',label:'异常来源',
              format: function (value:string, row:any) {
                return `${value}-${row.cameraName}`;
              }
            },
            {prop:'personName',label:'关联人员'},
            {prop:'isDeal',label:'异常状态',insertHtml:true},
            {prop:'operate',label:'',insertHtml:true},
          ],
        },
        detailVisible:false,
        detailData:{},
      }
    },
    methods: {
      showDetailDialog: function (visible:boolean, data = {}) {
        this.detailVisible = visible;
        this.detailData = data;
      },
      deleteItem: function (item:any) {
        this.$confirm('确定删除该条信息吗？')
          .then(res=>{
            let {exceptionId, type} = item;

            deleteEvent({exceptionId, type}).then(res=>{
              showMessageAfterRequest(res.data, '删除成功','删除失败');
              //@ts-ignore
              res.data === true ? this.$refs.exceptionTable.initTable({pageSize:17}) : '';
            })
        }).catch(e=>e)

      },
      initLatelyList: function () {
        //@ts-ignore
        this.latelyList = this.$refs.exceptionTable.tableList.slice(0,5);
      },
      initHistoryList: function () {
        //@ts-ignore
        this.$refs.exceptionTable.initTable({pageSize:17});
      },
      updateItem: function (data:object) {
        updateEvent(data).then(res=>{
          showMessageAfterRequest(res.data, '更新成功','更新失败');
          //@ts-ignore
          res.data === true ? this.initHistoryList() : '';
        })
      },
    },
    mounted(): void {
      getExceptionCensus().then(res=>{
        if (!res.data) return

        let total = 0, today = 0, census : any= {};

        res.data.list.forEach((item:any)=>{
          total += item.totalNum;
          today += item.todayNum;

          switch (item.type) {
            case 101:
              census.climbHeight = item.todayNum;
              break;
            case 102:
              census.face = item.todayNum;
              break;
            case 103:
              census.fire = item.todayNum;
              break;
            case 104:
              census.helmet = item.todayNum;
              break;
            case 105:
              census.motionless = item.todayNum;
              break;
            case 106:
              census.refectiveVest = item.todayNum;
              break;
            case 107:
              census.region = item.todayNum;
              break;
            case 108:
              census.tumble = item.todayNum;
              break;
          }
        })

        this.warningCensus = {...census, ...this.warningCensus};
        this.exceptionCensus = {today, total};
      })

    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>