<template>
  <div id="center-container">
    <div class="top-operate">
      <SearchInput @search="searchProject" />
      <el-button type="primary" @click="jump">新建项目</el-button>
    </div>

    <div class="project-content">
      <div class="name">{{project.name || ''}}</div>

      <div class="content">
        <div>项目状态：{{status[project.status]}}</div>
        <div>已耗时：{{project.usedDay || 0}}天</div>
        <div>预计耗时：{{project.expectedDay || 0}}天</div>
        <div>计划开始时间：{{project.startTime}}</div>
        <div>风险评估：{{project.risk}}级</div>
        <div>计划完成时间：{{project.endTime}}</div>
        <div>优先级：{{project.priority}}</div>
        <div>实际开始时间：{{project.actualStartTime}}</div>
        <div>责任人：{{project.manager}}</div>
        <div>实际完成时间：{{project.actualEndTime}}</div>
      </div>

      <div class="progress-box">
        <div>项目完成进度</div>
        <div>
          <div>项目进度：{{(project.progress*100).toFixed(0) || 0}}%</div>
          <div>延误率：{{(project.delay*100).toFixed(0) || 0}}%</div>
          <div>完成质量：{{(project.finish*100).toFixed(0) || 0}}%</div>
        </div>
      </div>

      <div class="progress-box">
        <div>今日完成进度</div>
        <div>
          <div>今日截止任务数：{{project.completeCount + project.notCompleteCount || 0}}</div>
          <div>已完成：{{project.completeCount || 0}}</div>
          <div>未完成：{{project.notCompleteCount || 0}}</div>
        </div>
      </div>
    </div>

    <div class="bottom-operate">
      <i class="el-icon-arrow-left" />
      <el-button type="primary">进入项目</el-button>
      <i class="el-icon-arrow-right" />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import SearchInput from '@/components/search-input/index.vue';
  import { getProjectDetail } from "@/request";


  export default Vue.extend({
    components:{
      SearchInput,
    },
    data(){
      return{
        status:['未开始','进行中','已结束','已中止'],
        project:{
          status:0,
          usedDay:0,
          expectedDay:0,
          risk:0,
          delay:0,
          finish:0,
          completeCount:0,
          notCompleteCount:0,
          name:'',
          priority:'',
          manager:'',
          startTime:'',
          endTime:'',
          actualStartTime:'',
          actualEndTime:'',
          progress:'',
        },
        projectName:'',
      }
    },
    methods:{
      searchProject: function (value:string) {
        console.log(value);
      },
      jump: function () {
        this.$router.push('/project-management');
      }
    },
    mounted(): void {
      getProjectDetail().then(res=>{
        if (res.data){
          this.project = res.data;
        }
      });
    }
  });
</script>

<style scoped lang="less">
  @import 'centre.less';
</style>