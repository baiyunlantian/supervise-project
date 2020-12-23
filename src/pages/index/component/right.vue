<template>
  <div id="right-container">

    <div class="module-container">
      <div class="module-title">
        <div class="title-text">资产统计</div>
        <div class="router_jump">资产管控>></div>
      </div>
      <div class="content">
        <div>总资产：{{assets.total || 0}}</div>
        <div>资产总额：{{assets.actual || 0}}</div>
      </div>
    </div>

    <div class="module-container" style="margin: 4vh 0">
      <div class="module-title">
        <div class="title-text">设备统计</div>
        <div class="router_jump">系统管理>></div>
      </div>
      <div class="content">
        <div>设备总数：{{equipment.onLine + equipment.offLine || 0}}</div>
        <div>在线：{{equipment.onLine || 0}}</div>
        <div>离线：{{equipment.offLine || 0}}</div>
      </div>
    </div>

    <div class="mission-container">
      <div class="module-title">
        <div class="title-text">我的任务</div>
        <div class="router_jump">所有任务>></div>
      </div>
      <div class="mission-list">
        <div class="mission-item" v-for="item in missionList" :key="item.id">
          <div>
            <div>{{item.projectName}}</div>
            <div>{{item.person}}</div>
          </div>
          <div>
            <div>{{item.missionName}}</div>
            <div>{{item.time}}</div>
          </div>
          <div>查看详情>></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { getAssetsCensus, getEquipmentCensus, getMissionList } from "@/request";

  export default Vue.extend({
    data(){
      return{
        assets:{
          actual:0,
          total:0
        },
        equipment:{
          onLine:0,
          offLine:0,
        },
        missionList:[]
      }
    },
    mounted(): void {
      getAssetsCensus().then(res=>{
        if (res.data){
          this.assets = res.data;
        }
      });

      getEquipmentCensus().then(res=>{
        if (res.data){
          this.equipment = res.data;
        }
      });

      getMissionList().then(res=>{
        if (res.data){
          this.missionList = res.data.list || [];
        }
      });
    }
  });
</script>

<style scoped lang="less">
  @import 'right.less';
</style>