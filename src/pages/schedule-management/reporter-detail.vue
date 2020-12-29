<template>
  <div id="reporter-detail-container" class="hiddenScrollbar">
    <div class="top">
      <div class="fontBlackAndBold">基本信息</div>
      <GoBackBtn />
    </div>

    <div class="form-content">
      <i class="el-icon-cloudy" />
      <Form
        :form-props="formProps"
        :form-data="formData"
      />
    </div>

    <div class="info-census">
      <div class="title fontBlackAndBold">预警信息统计</div>
      <WarningCensus :data="censusData"/>
    </div>

    <div class="warning-content">
      <div class="title fontBlackAndBold borderBottom">预警详情</div>
      <div class="warning-type-content">

        <div class="type-items">
          <div class="title">人脸识别预警</div>

          <div class="list">
            <div
                class="item"
                v-for="(warningItem,index1) in faceList"
                :key="index1"
            >
              <div class="borderBottom">发生时间：{{warningItem.time}}</div>
              <div class="img">
                <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
              </div>
              <div>事件名称：{{warningItem.name}}</div>
              <div>关联人员：{{warningItem.person}}</div>
              <div>异常状态：{{warningItem.status}}</div>
            </div>
          </div>
        </div>

        <div class="type-items">
          <div class="title">安全帽预警</div>

          <div class="list">
            <div
                class="item"
                v-for="(warningItem,index1) in safeHatList"
                :key="index1"
            >
              <div class="borderBottom">发生时间：{{warningItem.time}}</div>
              <div class="img">
                <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
              </div>
              <div>事件名称：{{warningItem.name}}</div>
              <div>关联人员：{{warningItem.person}}</div>
              <div>异常状态：{{warningItem.status}}</div>
            </div>
          </div>
        </div>

        <div class="type-items">
          <div class="title">火灾预警</div>

          <div class="list">
            <div
                class="item"
                v-for="(warningItem,index1) in fireList"
                :key="index1"
            >
              <div class="borderBottom">发生时间：{{warningItem.time}}</div>
              <div class="img">
                <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
              </div>
              <div>事件名称：{{warningItem.name}}</div>
              <div>关联人员：{{warningItem.person}}</div>
              <div>异常状态：{{warningItem.status}}</div>
            </div>
          </div>
        </div>

        <div class="type-items">
          <div class="title">登高预警</div>

          <div class="list">
            <div
                class="item"
                v-for="(warningItem,index1) in climbList"
                :key="index1"
            >
              <div class="borderBottom">发生时间：{{warningItem.time}}</div>
              <div class="img">
                <img :src="require('@/assets/mission-person.jpg')" alt="***"/>
              </div>
              <div>事件名称：{{warningItem.name}}</div>
              <div>关联人员：{{warningItem.person}}</div>
              <div>异常状态：{{warningItem.status}}</div>
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
  import { getWarningCensus, getWarningSelectList } from '@/request/schedule';

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      WarningCensus,
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'code',label:'编号',type:'input'},
            {key:'date',label:'日期',type:'input'},
            {key:'startTime',label:'开始检测时间',type:'input'},
            {key:'endTime',label:'结束检测时间',type:'input'},
          ],
          hiddenFooter:true,
        },
        formData:{},
        censusData:{},
        warningList: [],
        faceList:[],
        fireList:[],
        safeHatList:[],
        climbList:[],
      }
    },
    methods: {},
    watch:{
      warningList: {
        handler: function (newVal, oldVal) {
          console.log(newVal)
        },
        deep:true
      }
    },
    mounted(): void {
      console.log('ok');
      this.formData = this.$route.query;

      getWarningCensus().then(res=>{
        if (!res.data) return
        this.censusData = res.data;
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.faceList = res.data.list;
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.safeHatList = res.data.list;
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.fireList = res.data.list;
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.climbList = res.data.list;
      })
    },
  })
</script>

<style scoped lang="less">
  @import "reporter-detail.less";
</style>