<template>
  <div id="reporter-detail-container" class="hiddenScrollbar">
    <div class="top">
      <div class="fontBlackAndBold">基本信息</div>
      <GoBackBtn />
    </div>

    <div class="form-content">
      <SvgIcon name="exportExcel" @click="handleExportExcel"/>
      <Form
        :form-props="formProps"
        :form-data="formData"
      />
    </div>

    <div class="info-census">
      <div class="title ">预警信息统计</div>
      <WarningCensus :data="censusData"/>
    </div>

    <div class="warning-content">
      <div class="title fontBlackAndBold borderBottom">预警详情</div>
      <div class="warning-type-content">

        <div
            class="type-items"
            v-for="(item, index) in censusList"
            :key="index"
        >
          <div class="title">{{item.label || ''}}</div>

          <div class="list">
            <div
                class="item"
                v-for="(valueItem,valueIndex) in item.value || []"
                :key="valueIndex"
            >
              <div class="borderBottom">发生时间：{{valueItem.createTime}}</div>
              <div class="img">
                <img :src="valueItem.picUrl || require('@/assets/supervise-public.jpeg')" alt="***"/>
              </div>
              <div>事件名称：{{valueItem.person || ''}}</div>
              <div>关联人员：{{valueItem.personName || ''}}</div>
              <div>异常状态：{{valueItem.isDeal === 0 ? '未处理' : '已处理'}}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import GoBackBtn from '@/components/goBackBtn.vue';
  import Form from "@/components/form/index.vue";
  import WarningCensus from "@/components/warning-census/index.vue";
  import SvgIcon from '@/components/svgIcon.vue';
  import { getArrangeReportExceptionCensus,} from '@/request/schedule';
  import moment from "moment";
  import {exportExcl} from "@/utils/common";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      WarningCensus,
      SvgIcon,
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'code',label:'编号',type:'input'},
            {key:'buildTime',label:'日期',type:'input'},
            {key:'startTime',label:'开始检测时间',type:'input'},
            {key:'endTime',label:'结束检测时间',type:'input'},
          ],
          hiddenFooter:true,
        },
        formData:{},
        censusData:{
          face:0,
          helmet:0,
          region:0,
          refectiveVest:0,
          climbHeight:0,
          motionless:0,
          fire:0,
          tumble:0
        },
        censusList:[],
        exportExcelData:[],
        exceptionEventCommon:{
          face:'人脸识别预警',
          climbHeight:'登高预警',
          fire:'火灾预警',
          helmet:'安全帽预警',
          motionless:'静止预警',
          refectiveVest:'反反光衣预警',
          region:'区域预警',
          tumble:'跌倒预警',
        },
      }
    },
    methods: {
      handleExportExcel: function () {
        let sheetData: any = [];
        let face:any = [];
        let climbHeight:any = [];
        let fire:any = [];
        let helmet:any = [];
        let motionless:any = [];
        let refectiveVest:any = [];
        let region:any = [];
        let tumble:any = [];

        Object.keys(this.exportExcelData).forEach(key=>{
          //@ts-ignore
          this.exportExcelData[key] && this.exportExcelData[key].forEach((eventItem:any)=>{
            switch (key) {
              case 'face':
                face.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'climbHeight':
                climbHeight.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'fire':
                fire.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'helmet':
                helmet.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'motionless':
                motionless.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'refectiveVest':
                refectiveVest.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'region':
                region.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
              case 'tumble':
                tumble.push({...eventItem, type:this.exceptionEventCommon[key]});
                break;
            }
          })
        });

        let list:any = face.concat(climbHeight, fire, helmet, motionless, refectiveVest, region, tumble);;
        list.forEach((item:any,index:number)=>{

          let obj = [
            index+1,
            item.type,
            item.createTime,
            item.arrangeName,
            item.personName,
            item.isDeal === 0 ? '未处理' :'已处理',
          ];
          sheetData.push(obj);
        });

        const exclHeader = ['序号','预警类型','发生时间','事件名称','关联人员','状态'];
        const columnWidths = [5,10,15,10,10,5];
        //@ts-ignore
        const fileName = `${this.formData.buildTime||''}预警表格`;

        exportExcl(list, sheetData, exclHeader, columnWidths, fileName);
      },
    },
    mounted(): void {
      //@ts-ignore
      this.formData = JSON.parse(sessionStorage.getItem('reporterDetailFormData'));
      let reportId = Number(this.$route.query.reportId);

      getArrangeReportExceptionCensus({reportId}).then(res=>{
        if (!res.data) return;

        let censusData : any = {};
        let censusList : any = [];

        Object.keys(res.data).forEach((key:string)=>{
          const value = res.data[key];

          censusData[key] = value.length || 0;
          switch (key) {
            case 'face':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'fire':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'helmet':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'motionless':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'refectiveVest':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'region':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'tumble':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
            case 'climbHeight':
              censusList.push({key, value, label:this.exceptionEventCommon[key]});
              break;
          }
        })

        console.log('censusData',censusData)
        this.censusData = {...this.censusData, ...censusData};;
        this.censusList = censusList;
        this.exportExcelData = res.data;
      })

    },
  })
</script>

<style scoped lang="less">
  @import "reporter-detail.less";
</style>