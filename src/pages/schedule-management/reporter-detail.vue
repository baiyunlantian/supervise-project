<template>
  <div id="reporter-detail-container" class="hiddenScrollbar">
    <div class="top">
      <div class="fontBlackAndBold">基本信息</div>
      <GoBackBtn />
    </div>

    <div class="form-content">
      <SvgIcon name="exportReporterList"/>
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
          <div class="title">{{item.label || ''}}预警</div>

          <div class="list">
            <div
                class="item"
                v-for="(valueItem,valueIndex) in item.value || []"
                :key="valueIndex"
            >
              <div class="borderBottom">发生时间：{{valueItem.createTime}}</div>
              <div class="img">
                <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
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
        censusData:{},
        censusList:[],
      }
    },
    methods: {},
    mounted(): void {
      this.formData = this.$route.query.data || {};
      //@ts-ignore
      let reportId = this.$route.query.data.reportId || '';

      getArrangeReportExceptionCensus({reportId}).then(res=>{
        if (!res.data) return;

        // let data = new Map();
        //
        // ['face','fire','helmet','motionless','refectiveVest','region','tumble','climbHeight'].forEach((item,index)=>{
        //   let list = [];
        //   for (let i = 0; i < 4; i++){
        //     list.push({
        //       createTime:'2021-01-4 21:10:31',
        //       personName:'佩恩',
        //       person:'自来也',
        //       isDeal:0,
        //     });
        //   }
        //    data.set(item, list);
        // })

        let censusData : any = {};
        let censusList : any = [];

        res.data.forEach((value:any, key:string)=>{
          censusData[key] = value.length || 0;
          switch (key) {
            case 'face':
              censusList.push({key, value, label:'人脸识别'});
              break;
            case 'fire':
              censusList.push({key, value, label:'火灾'});
              break;
            case 'helmet':
              censusList.push({key, value, label:'人员入侵'});
              break;
            case 'motionless':
              censusList.push({key, value, label:'静止'});
              break;
            case 'refectiveVest':
              censusList.push({key, value, label:'反光衣'});
              break;
            case 'region':
              censusList.push({key, value, label:'安全帽'});
              break;
            case 'tumble':
              censusList.push({key, value, label:'跌倒'});
              break;
            case 'climbHeight':
              censusList.push({key, value, label:'登高'});
              break;
          }
        })

        this.censusData = censusData;
        this.censusList = censusList;
      })

    },
  })
</script>

<style scoped lang="less">
  @import "reporter-detail.less";
</style>