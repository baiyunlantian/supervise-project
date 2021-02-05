<template>
  <div class="table-content">
    <div class="title">
      <div class="fontBlackAndBold">施工监督报告</div>
      <SvgIcon name="exportExcel" @click="handleExportExcel"/>
    </div>

    <Table
        ref="table"
        :table-props="tableProps"
        @multipleSelectChange="multipleSelectChange"
    >
      <template v-slot:operate="{row}">
        <div class="jump-page" @click="handleJumpPage(row)">查看详情>></div>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import Table from '@/components/table/index.vue';
  import moment from "moment";
  import {BOX} from "@/request/type";
  import {exportExcl} from "@/utils/common";
  import {getExceptionList} from "@/request/exception";

  export default Vue.extend({
    components:{
      SvgIcon,
      Table
    },
    data() {
      return {
        tableProps:{
          url:`${BOX}/exception/reportPageListInArrange`,
          rowKey:'reportId',
          firstColumn:{
            show:true,
            type:'selection'
          },
          pagination:{
            pageSize:12
          },
          params:{
            //@ts-ignore
            arrangeId:this.$route.query.arrangeId
          },
          tableColumn:[
            {prop:'buildTime',label:'日期'},
            {prop:'code',label:'编号'},
            {prop:'startTime',label:'开始检测日期'},
            {prop:'endTime',label:'结束检测日期'},
            {prop:'num',label:'预警条数'},
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        reportIds:[],
        exceptionEventCommon:{
          102:'人脸识别预警',
          101:'登高预警',
          103:'火灾预警',
          104:'安全帽预警',
          105:'静止预警',
          106:'反反光衣预警',
          107:'区域预警',
          108:'跌倒预警',
        },
      }
    },
    methods: {
      handleExportExcel: function () {
        // 如果有勾选表格行，则导出勾选的表格行所对应的报告详情信息，否则导出当前表格内容
        this.reportIds.length === 0 ? this.exportTableList() : this.exportExceptionCensus();
      },
      handleJumpPage: function (data:any) {
        sessionStorage.setItem('reporterDetailFormData',JSON.stringify(data))
        this.$router.push({ path: '/schedule-management/reporter-detail', query: { reportId: data.reportId }});
      },
      multipleSelectChange: function (value:any) {
        this.reportIds = value.map((item:any)=>item.reportId);
      },
      exportExceptionCensus: function () {
        let fnArray = this.reportIds.map((reportId:string)=>{
          return this.handleGetExceptionCensus(reportId)
        })

        Promise.all(fnArray).then((res:any)=>{
          //res--数组
          const list = this.handleFormatAllExceptionData(res);    //获取全所勾选的行的预警详情数据

          let sheetData: any = [];

          list.forEach((item:any,index:number)=>{
            let obj = [
              index+1,
              this.exceptionEventCommon[item.exceptionType],
              item.createTime,
              item.eventName,
              this.formatPersons(item.persons),
              item.isDeal === 0 ? '未处理' :'已处理',
            ];
            sheetData.push(obj);
          });

          const exclHeader = ['序号','预警类型','发生时间','事件名称','关联人员','状态'];
          const columnWidths = [5,10,15,10,10,5];
          const fileName = '预警表格';

          exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
        }).catch(e=>{
          console.log(e)
        })

      },
      exportTableList: async function () {
        //@ts-ignore
        const res = await this.$refs.table.exportExcelList();

        let sheetData: any = [];

        res.forEach((item:any,index:number)=>{
          let obj = [
            index+1,
            moment(item.buildTime).format('YYYY.MM.DD'),
            item.code,
            item.startTime,
            item.endTime,
            item.num,
          ];
          sheetData.push(obj);
        });

        const exclHeader = ['序号','日期','编号','开始检测时间','结束检测时间','预警条数'];
        const columnWidths = [5,10,10,10,10,5];
        const fileName = '施工监督报告表格';

        exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
      },
      //获取每份报告里的预警详情
      handleGetExceptionCensus: async function (reportId:string): Promise<object> {
        let {data} = await getExceptionList({pageNum:1,pageSize:99,reportId})
        return data.list;
      },
      //格式化所勾选的行的预警详情数据
      handleFormatAllExceptionData: function (list = []) :[] {

        let face:any = [];
        let climbHeight:any = [];
        let fire:any = [];
        let helmet:any = [];
        let motionless:any = [];
        let refectiveVest:any = [];
        let region:any = [];
        let tumble:any = [];

        try{
          list && list.forEach((censusItems:any)=>{
            //censusItem--每行预警详情数据
            censusItems.forEach((item:any)=>{
              const type : number = item.exceptionType;

              switch (type) {
                case 102:
                  face.push(item);
                  break;
                case 103:
                  fire.push(item);
                  break;
                case 104:
                  helmet.push(item);
                  break;
                case 105:
                  motionless.push(item);
                  break;
                case 106:
                  refectiveVest.push(item);
                  break;
                case 107:
                  region.push(item);
                  break;
                case 108:
                  tumble.push(item);
                  break;
                case 101:
                  climbHeight.push(item);
                  break;
              }
            })
          })
          return face.concat(climbHeight, fire, helmet, motionless, refectiveVest, region, tumble);
        }catch (e) {
          console.log(e)
          return []
        }
      },
      formatPersons: function (list = []) {
        let personText = list.map((person:any)=>{
          return person.personName
        })
        return personText.join('、');
      },
    },
  })
</script>

<style scoped lang="less">
  @import "mission-table.less";
</style>