<template>
  <div id="reporter-detail-container" class="hiddenScrollbar">
    <div class="top">
      <div class="fontBlackAndBold">基本信息</div>
      <GoBackBtn />
    </div>

    <div class="form-content">
      <SvgIcon name="exportExcel" @click="handleExportPdf"/>
      <Form
        :form-props="formProps"
        :form-data="formData"
      />
    </div>

    <div class="info-census">
      <div class="title ">预警信息统计</div>
      <WarningCensus :data="censusData"/>
    </div>

    <div class="warning-content" ref="warningContent">
      <div class="title fontBlackAndBold borderBottom">预警详情</div>
      <div class="warning-type-content">

        <div
            class="type-items"
            v-for="(item, index) in ['face','helmet','region','refectiveVest','climbHeight','motionless','fire','tumble']"
            :key="index"
        >
          <div class="title" v-if="renderCensusData[item] && renderCensusData[item].length > 0">{{exceptionEventCommon[item] || ''}}</div>

          <div class="list">
            <div
                class="item"
                v-for="(valueItem,valueIndex) in renderCensusData[item] || []"
                :key="valueIndex"
            >
              <div class="borderBottom">发生时间：{{valueItem.createTime}}</div>
              <div class="img">
                <img :src="valueItem.imageUrl || require('@/assets/supervise-public.jpeg')" alt="***"/>
              </div>
              <div>事件名称：{{valueItem.eventName || ''}}</div>
              <div>关联人员：{{formatPersons(valueItem.persons)}}</div>
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
  import html2Canvas from 'html2canvas';
  import JsPDF from 'jspdf/dist/jspdf.min.js';
  import { getExceptionList, getExceptionCensus } from '@/request/exception';
  import {exportExcl} from "@/utils/common";
  import { Message } from "element-ui";

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
        renderCensusData:{
          face:[],
          helmet:[],
          region:[],
          refectiveVest:[],
          climbHeight:[],
          motionless:[],
          fire:[],
          tumble:[]
        },
        exportExcelData:[],
        exceptionEventCommon:{
          face:'人脸识别预警',
          climbHeight:'登高预警',
          fire:'火灾预警',
          helmet:'安全帽预警',
          motionless:'静止预警',
          refectiveVest:'反光衣预警',
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

        this.censusList.forEach((data:any)=>{
          let item = data.value;
          const type : number = item.exceptionType;

          switch (type) {
            case 102:
              face.push({...item, exceptionType:'face'});
              break;
            case 103:
              fire.push({...item, exceptionType:'fire'});
              break;
            case 104:
              helmet.push({...item, exceptionType:'helmet'});
              break;
            case 105:
              motionless.push({...item, exceptionType:'motionless'});
              break;
            case 106:
              refectiveVest.push({...item, exceptionType:'refectiveVest'});
              break;
            case 107:
              region.push({...item, exceptionType:'region'});
              break;
            case 108:
              tumble.push({...item, exceptionType:'climbHeight'});
              break;
            case 101:
              climbHeight.push({...item, exceptionType:'tumble'});
              break;
          }
        })

        let list:any = face.concat(climbHeight, fire, helmet, motionless, refectiveVest, region, tumble);
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
        //@ts-ignore
        const fileName = `${this.formData.buildTime||''}预警表格`;

        exportExcl(list, sheetData, exclHeader, columnWidths, fileName);
      },
      formatPersons: function (list = []) {
        let personText = list.map((person:any)=>{
          return person.personName
        })
        return personText.join('、');
      },
      handleExportPdf: function () {
        Message.info({
          message:"正在生成文件......",
          duration:0,
          iconClass:"el-icon-loading",
        });

        const element = this.$refs.warningContent;
        const _this = this;
        html2Canvas(element, {scale: 2, useCORS: true}).then(canvas=>{
          const contentWidth = canvas.width;
          const contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          const pageHeight = contentWidth / 592.28 * 841.89;
          //未生成pdf的html页面高度
          let surplusHeight = contentHeight;
          //页面偏移
          let position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          const imgWidth = 592.28;
          const imgHeight = 592.28 / contentWidth * contentHeight;

          const pageData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new JsPDF('l', 'pt','a4'); //不分页

          //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (surplusHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
          } else {
            while (surplusHeight > 0) {
              pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              surplusHeight -= pageHeight;
              position -= 592.28;
              //避免添加空白页
              if (surplusHeight > 0) {
                pdf.addPage();
              }
            }
          }
          pdf.save(`${_this.formData.buildTime || ''}预警信息.pdf`);
          //@ts-ignore
          Message.closeAll();
        }).catch(e=>{
          //@ts-ignore
          Message.closeAll();
        });
      },
    },
    mounted(): void {
      //@ts-ignore
      this.formData = JSON.parse(sessionStorage.getItem('reporterDetailFormData'));
      let reportId = this.$route.query.reportId;

      getExceptionList({pageNum:1,pageSize:99,reportId}).then(res=>{
        if (!res.data) return;
        let {list} = res.data;
        if (!list) return

        let censusList : any = [];
        let renderCensusData: any = {
          face:[],
          helmet:[],
          region:[],
          refectiveVest:[],
          climbHeight:[],
          motionless:[],
          fire:[],
          tumble:[]
        };

        list.forEach((item:any)=>{
          const type : number = item.exceptionType;

          switch (type) {
            case 102:
              censusList.push({key:'face', value:item, label:this.exceptionEventCommon.face});
              renderCensusData.face.push(item);
              break;
            case 103:
              censusList.push({key:'fire', value:item, label:this.exceptionEventCommon.fire});
              renderCensusData.fire.push(item);
              break;
            case 104:
              censusList.push({key:'helmet', value:item, label:this.exceptionEventCommon.helmet});
              renderCensusData.helmet.push(item);
              break;
            case 105:
              censusList.push({key:'motionless', value:item, label:this.exceptionEventCommon.motionless});
              renderCensusData.motionless.push(item);
              break;
            case 106:
              censusList.push({key:'refectiveVest', value:item, label:this.exceptionEventCommon.refectiveVest});
              renderCensusData.refectiveVest.push(item);
              break;
            case 107:
              censusList.push({key:'region', value:item, label:this.exceptionEventCommon.region});
              renderCensusData.region.push(item);
              break;
            case 108:
              censusList.push({key:'tumble', value:item, label:this.exceptionEventCommon.tumble});
              renderCensusData.tumble.push(item);
              break;
            case 101:
              censusList.push({key:'climbHeight', value:item, label:this.exceptionEventCommon.climbHeight});
              renderCensusData.climbHeight.push(item);
              break;
          }
        })

        this.censusList = censusList;
        this.renderCensusData = renderCensusData;
      })

      getExceptionCensus({reportId}).then(res=>{
        if (!res.data) return

        let census : any= {};

        try{
          res.data.counts.forEach((item:any)=>{

            switch (item.exceptionType) {
              case 101:
                census.climbHeight = item.count;
                break;
              case 102:
                census.face = item.count;
                break;
              case 103:
                census.fire = item.count;
                break;
              case 104:
                census.helmet = item.count;
                break;
              case 105:
                census.motionless = item.count;
                break;
              case 106:
                census.refectiveVest = item.count;
                break;
              case 107:
                census.region = item.count;
                break;
              case 108:
                census.tumble = item.count;
                break;
            }
          })

          this.censusData = {...this.censusData, ...census};
        }catch (e) {
          console.log(e)
        }
      })

    },
  })
</script>

<style scoped lang="less">
  @import "reporter-detail.less";
</style>