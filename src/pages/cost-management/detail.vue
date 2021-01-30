<template>
  <div id="flow-detail-container">
    <GoBackBth />
    <div class="table-container bgcAndShadow">
      <div class="title">
        <span class="date">{{date}}</span>
        <SvgIcon
            name="exportExcel"
            @click="handleExportExcl"
        />
      </div>

      <Table :table-props="tableProps" ref="table"/>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Table from '@/components/table/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import GoBackBth from '@/components/goBackBtn.vue';
  import { BOX, MOCK } from "@/request/type";
  import { exportExcl } from "@/utils/common";
  import moment from "moment";

  export default Vue.extend({
    components:{
      Table,
      SvgIcon,
      GoBackBth,
    },
    data() {
      return {
        tableProps:{
          url:`${BOX}/vis/flowDayRecordList`,
          rowKey:'id',
          firstColumn:{
            show:true,
            type:'selection',
          },
          params:{
            date:this.$route.query.date
          },
          pagination:{
            pageSize:14
          },
          tableColumn:[
            {prop:'startTime',label:'开始时间',
              format:(value:string)=>{
                return moment(value).format('HH:mm:ss')
              },
            },
            {prop:'endTime',label:'结束时间',
              format:(value:string)=>{
                return moment(value).format('HH:mm:ss')
              },
            },
            {prop:'useTime',label:'播放时长',
              format:(value:number)=>{
                //单位：秒
                let hour = value && Math.floor(value/3600) || 0;
                let min = value && Math.floor(value % 3600 / 60) || 0;
                let sec = value && value % 60 || 0;
                return `${hour}小时${min}分${sec}秒`
              },
            },
            {prop:'outByte',label:'产生流量',
              format:(value:number)=>{
                //单位：B
                return `${value && Math.floor(value/1024/1024) || 0}M`
              },
            },
            {prop:'settlementAccount',label:'产生费用',
              format:(value:number)=>{
                //单位：分
                return value && value/100
              },
            },
          ],
        },
        date:'',
      }
    },
    methods: {
      handleExportExcl: () => {
        let _this = this;
        //@ts-ignore
        this.$refs.table.exportExcelList().then(res=>{
          let sheetData: any = [];

          res.forEach((item:any,index:number)=>{
            let {useTime, outByte, settlementAccount} = item;
            let hour = useTime && Math.floor(useTime/3600) || 0;
            let min = useTime && Math.floor(useTime % 3600 / 60) || 0;
            let sec = useTime && useTime % 60 || 0;
            let time = `${hour}小时${min}分${sec}秒`;

            let obj = [
              index+1,
              moment(item.startTime).format('HH:mm:ss'),
              moment(item.endTime).format('HH:mm:ss'),
              time,
              `${outByte && Math.floor(outByte/1024/1024) || 0}M`,
              settlementAccount && settlementAccount/100
            ];
            sheetData.push(obj);
          });

          const exclHeader = ['序号','开始时间','结束时间','播放时长','产生流量','产生费用'];
          const columnWidths = [5,11,10,10,10,10];
          //@ts-ignore
          const fileName = `${_this.date}流量使用记录表格`;

          exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
        });
      },
    },
    mounted(): void {
      //@ts-ignore
      this.date = this.$route.query.date && moment(this.$route.query.date).format('yyyy.MM.DD') || '';
    }
  })
</script>

<style scoped lang="less">
  @import "detail.less";
</style>