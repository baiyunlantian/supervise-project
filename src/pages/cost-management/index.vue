<template>
  <div id="cost-container">
    <SearchForm
        :form-items-prop="formItemsProp"
        :form-data="formData"
        @search="searchTable"
    />

    <div class="table-container bgcAndShadow">
      <div class="title">
        <div class="left">
          <div class="table-item" :class="{light:tableType === 'flow'}" @click="toggleTable('flow')">流量使用记录</div>
          <div class="table-item" :class="{light:tableType === 'account'}" @click="toggleTable('account')">账户充值明细</div>
        </div>
        <SvgIcon
          name="exportExcel"
          @click="handleExportExcl"
        />
      </div>

      <Table :table-props="flowTableProps" v-show="tableType === 'flow'" ref="flowTable">
        <template v-slot:operate="{row}">
          <router-link :to="{ path: '/cost-management/detail', query: { date: row.date}}">···</router-link>
        </template>
      </Table>

      <Table :table-props="accountTableProps" v-show="tableType === 'account'" ref="accountTable"/>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchForm from '@/components/search-form/index.vue';
  import Table from '@/components/table/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { BOX, MOCK } from "@/request/type";
  import { exportExcl } from "@/utils/common";
  import moment from "moment";

  export default Vue.extend({
    components:{
      SearchForm,
      Table,
      SvgIcon,
    },
    data() {
      return {
        formItemsProp:[
          {key:'time',label:'任务时间',type:'daterange'}
        ],
        formData:{},
        tableType:'flow',
        flowTableProps:{
          url:`${MOCK}/vis/flowDayRecordList`,
          rowKey:'id',
          firstColumn:{
            show:true,
            type:'selection',
          },
          pagination:{
            pageSize:12
          },
          tableColumn:[
            {prop:'date',label:'日期',},
            {prop:'totalUseTime',label:'播放时长',
              format:(value:number)=>{
                //单位：秒
                let hour = value && Math.floor(value/3600) || 0;
                let min = value && Math.floor(value % 3600 / 60) || 0;
                let sec = value && value % 60 || 0;
                return `${hour}小时${min}分${sec}秒`
              },
            },
            {prop:'totalOutByte',label:'产生流量',
              format:(value:number)=>{
              //单位：B
                return `${value && Math.floor(value/1024/1024) || 0}M`
              },
            },
            {prop:'totalSettlementAccount',label:'产生费用',
              format:(value:number)=>{
              //单位：分
                return value && value/100
              },
            },
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        accountTableProps:{
          url:`${MOCK}/vis/visAccountPayRecord`,
          rowKey:'id',
          firstColumn:{
            show:true,
            type:'selection',
          },
          pagination:{
            pageSize:13
          },
          tableColumn:[
            {prop:'payTime',label:'日期',
              format:(value:string)=>{
                return value
              },
            },
            {prop:'payAccount',label:'充值金额',
              format:(value:number)=>{
                //单位：分
                return value && value/100
              },
            },
            {prop:'surplusAccount',label:'账户余额',
              format:(value:number)=>{
                //单位：分
                return value && value/100
              },
            }
          ],
        },
      }
    },
    methods: {
      searchTable: function (data?:any) {
        let param :any = {};
        if (data && data.time){
          param.fromDate = moment(data.time[0]).format('yyyy-MM-DD')
          param.toDate = moment(data.time[1]).format('yyyy-MM-DD')
        }

        console.log(param)
        //@ts-ignore
        this.tableType === 'flow' ? this.$refs.flowTable.initTable(param) : this.$refs.accountTable.initTable(param)
      },
      handleExportExcl: function () {
        let el = this.tableType === 'flow' ? this.$refs.flowTable : this.$refs.accountTable;
        //@ts-ignore
        el.exportExcelList().then(res=>{
          let sheetData: any = [];
          let exclHeader = [];
          let columnWidths = [];
          let fileName = ``;

          if (this.tableType === 'flow'){
            exclHeader = ['序号','日期','播放时长','产生流量','产生费用'];
            columnWidths = [5,10,10,10,10];
            fileName = '流量使用记录';

            res.forEach((item:any,index:number)=>{
              let {date, totalUseTime, totalOutByte, totalSettlementAccount} = item;
              let hour = totalUseTime && Math.floor(totalUseTime/3600) || 0;
              let min = totalUseTime && Math.floor(totalUseTime % 3600 / 60) || 0;
              let sec = totalUseTime && totalUseTime % 60 || 0;
              let time = `${hour}小时${min}分${sec}秒`;

              let obj = [
                index+1,
                date,
                time,
                `${totalOutByte && Math.floor(totalOutByte/1024/1024) || 0}M`,
                totalSettlementAccount && totalSettlementAccount/100
              ];
              sheetData.push(obj);
            })
          }
          else {
            exclHeader = ['序号','日期','充值金额','账户余额'];
            columnWidths = [5,10,10,10];
            fileName = '账户充值明细';

            res.forEach((item:any,index:number)=>{
              let {payTime, payAccount, surplusAccount} = item;
              let obj = [
                index+1,
                payTime,
                payAccount && payAccount/100,
                surplusAccount && surplusAccount/100,
              ];
              sheetData.push(obj);
            })
          }

          exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
        });
      },
      toggleTable: function (type:string) {
        this.tableType = type;
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>