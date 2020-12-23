<template>
  <div id="left-container">

    <div class="company-container">
      <div class="router_jump">人员管理>></div>
      <div class="title-text">{{company.name}}</div>
      <div class="person-count">
        <div>企业人数：{{company.total}}</div>
        <div>在场人数：{{company.actual}}</div>
      </div>
    </div>

    <div class="project-container">
      <div class="project-census">
        <div class="module-title">
          <div class="title-text">项目统计</div>
          <div class="router_jump">项目管控>></div>
        </div>
        <div class="total">
          <div>项目数量：<span>{{project.total}}</span></div>
        </div>
        <div class="items">
          <div class="item">
            <div>{{project.notStart}}</div>
            <div>未开始</div>
          </div>
          <div class="item">
            <div>{{project.running}}</div>
            <div>进行中</div>
          </div>
          <div class="item">
            <div>{{project.end}}</div>
            <div>已结束</div>
          </div>
          <div class="item">
            <div>{{project.stop}}</div>
            <div>已中止</div>
          </div>
        </div>
      </div>

      <div class="project-progress">
        <div class="title-text">项目进度统计</div>
        <div class="progress-list">
          <div class="item" v-for="(item, index) in projectProgressList" :key="index">
            <div>{{item.name}}</div>
            <div class="progress-line">
              <div class="default-line">
                <div class="blue-bar" :style="{width:item.progress*100+'%'}"></div>
              </div>
              <div class="text">{{item.status === 3 ? '已中止' : `${(item.progress*100).toFixed(0) || 0}%`}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { getCompanyInfo, getProjectCensus, getProjectProgressList } from "@/request";

  export default Vue.extend({
    data(){
      return{
        company:{
          name:"test",
          total:0,
          actual:0,
        },
        project:{
          notStart:0,
          running:0,
          end:0,
          stop:0,
          total:0,
        },
        projectProgressList:[],
      }
    },
    mounted(): void {
      getCompanyInfo().then(res=>{
        if (res.data){
          this.company = res.data;
        }
      });

      getProjectCensus().then(res=>{
        if (res.data){
          let total = 0;
          Object.keys(res.data).forEach(key=>{
            total += res.data[key] || 0;
          });

          this.project = {total, ...res.data};
        }
      });

      getProjectProgressList().then(res=>{
        if (res.data){
          this.projectProgressList = res.data.list;
        }
      });
    },
  });
</script>

<style scoped lang="less">
  @import 'left.less';
</style>