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
      <div class="content">
        <div
          class="item"
          v-for="(item, index) in censusConfig"
          :key="index"
          :class="censusData[item.key] === 0 ? 'normal' : 'active'"
        >
          <div class="img">
            <img :src="censusData[item.key] !== 0 ? item.normal : item.active" alt="***"/>
          </div>
          <div class="text">
            <div class="label">{{item.label}}</div>
            <div class="count">{{censusData[item.key]}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-content">
      <div class="title fontBlackAndBold borderBottom">预警详情</div>
      <div class="warning-type-content">

        <div
            class="type-items"
            v-for="(value,index) in ['人脸识别预警','安全帽预警','反光衣预警','登高预警']"
            :key="index"
        >
          <div class="title">{{value}}</div>

          <div class="list">
            <div
                class="item"
                v-for="(warningItem,index1) in warningList[index]"
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
  import { getWarningCensus, getWarningSelectList } from '@/request/schedule';

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
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
        censusConfig:[
          { key:'face',label:'人脸识别预警',
            normal:require('@/assets/menu/equipment.png'),
            active:require('@/assets/menu/equipment-active.png'),
          },
          { key:'safeHat',label:'安全帽预警',
            normal:require('@/assets/menu/exception.png'),
            active:require('@/assets/menu/exception-active.png'),
          },
          { key:'workArea',label:'作业区域预警',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
          { key:'clothes',label:'反光衣预警',
            normal:require('@/assets/menu/person.png'),
            active:require('@/assets/menu/person-active.png'),
          },
          { key:'climb',label:'登高预警',
            normal:require('@/assets/menu/schedule.png'),
            active:require('@/assets/menu/schedule-active.png'),
          },
          { key:'stop',label:'静止预警',
            normal:require('@/assets/menu/equipment.png'),
            active:require('@/assets/menu/equipment-active.png'),
          },
          { key:'fire',label:'火灾预警',
            normal:require('@/assets/menu/exception.png'),
            active:require('@/assets/menu/exception-active.png'),
          },
          { key:'fall',label:'跌倒预警',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
        ],
        censusData:{},
        warningList: [],
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
        this.warningList[0] = res.data.list;
        console.log(0,this.warningList)
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.warningList[1] = res.data.list;
        console.log(1,this.warningList)
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.warningList[2] = res.data.list;
        console.log(2,this.warningList)
      })

      getWarningSelectList().then(res=>{
        if (!res.data) return
        //@ts-ignore
        this.warningList[3] = res.data.list;
        console.log(3,this.warningList)
      })
    },
  })
</script>

<style scoped lang="less">
  @import "reporter-detail.less";
</style>