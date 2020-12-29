<template>
  <div id="exception-event-container">
    <div class="top">
      <div class="left bgcAndShadow">
        <div class="fontBlackAndBold title">异常预警统计</div>
        <div class="content">
          <div class="img">
            <img :src="require('@/assets/menu/equipment.png')" alt="***" />
          </div>
          <div class="item">
            <div class="label">总预警统计</div>
            <div class="count" style="color: rgb(255, 114, 0)">{{exceptionCensus.total || 0}}</div>
          </div>
          <div class="item">
            <div class="label">今日异常预警统计</div>
            <div class="count" style="color: rgb(255, 156, 0)">{{exceptionCensus.today || 0}}</div>
          </div>
        </div>
      </div>

      <div class="right bgcAndShadow">
        <div class="fontBlackAndBold title">今日异常预警分析</div>
        <WarningCensus :data="warningCensus"/>
      </div>
    </div>

    <div class="exception-content">
      <div class="left bgcAndShadow">
        <div class="fontBlackAndBold title">最新异常预警信息</div>

        <div class="content">
          <div class="lately-item bgcAndShadow">
            <div class="operate-btn">
              <div class="cursor" @click="showDetailDialog(true, latelyList[0])">···</div>
              <i class="el-icon-delete" @click="deleteItem(latelyList[0].id)"/>
            </div>

            <DetailMainContent :data="latelyList[0]"/>
          </div>

          <div class="items">
            <ExceptionItem
                v-for="(item,index) in latelyList"
                :key="index"
                :data="item"
                @showDetailDialog="showDetailDialog"
                @delete="deleteItem"
            />
          </div>
        </div>
      </div>

      <div class="right bgcAndShadow">
        <div class="title">
          <div class="fontBlackAndBold">历史预警列表</div>
          <router-link to="/exception-event/history-list">查看更多>></router-link>
        </div>

        <Table :table-props="tableProps">
          <template v-slot:status="{row}">
            <span v-if="row.status === 0" style="color: #ff4949">未处理</span>
            <span v-else style="color: #13ce66">已处理</span>
          </template>

          <template v-slot:operate="{row}">
            <div class="cursor" style="color: #0072ff" @click="showDetailDialog(true, row)">>></div>
          </template>
        </Table>
      </div>
    </div>

    <DetailDialog
        :visible="detailVisible"
        :data="detailData"
        @close="showDetailDialog"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import WarningCensus from '@/components/warning-census/index.vue';
  import Table from '@/components/table/index.vue';
  import DetailMainContent from './component/detail-main-content.vue';
  import ExceptionItem from './component/exception-item.vue';
  import DetailDialog from './component/detail-dialog.vue';
  import { getWarningCensus } from '@/request/schedule';
  import { getLatelyList } from '@/request/exception-event';


  export default Vue.extend({
    components:{
      Table,
      WarningCensus,
      DetailMainContent,
      ExceptionItem,
      DetailDialog,
    },
    data() {
      return {
        exceptionCensus:{
          total:321,
          today:34
        },
        warningCensus:{},
        latelyList:[],
        tableProps:{
          url:'/mock/exception-event/latelyList',
          rowKey:'id',
          hiddenPagination:true,
          params:{
            pageSize:20,
          },
          tableColumn:[
            {prop:'time',label:'时间'},
            {prop:'type',label:'事件类型'},
            {prop:'project',label:'所属项目'},
            {prop:'name',label:'事件名称'},
            {prop:'source',label:'异常来源'},
            {prop:'person',label:'关联人员'},
            {prop:'status',label:'异常状态',insertHtml:true},
            {prop:'operate',label:'',insertHtml:true},
          ],
        },
        detailVisible:false,
        detailData:{},
      }
    },
    methods: {
      showDetailDialog: function (visible:boolean, data = {}) {
        this.detailVisible = visible;
        this.detailData = data;
      },
      deleteItem: function (id:number | string) {
        if (!id) return

        this.$message({
          type:'success',
          message:'删除成功'
        });
        getLatelyList({pageSize:4}).then(res=>{
          if (!res.data) return
          this.latelyList = res.data.list;
        })
      }
    },
    mounted(): void {
      getWarningCensus().then(res=>{
        if (!res.data) return
        this.warningCensus = res.data;
      })

      getLatelyList({pageSize:4}).then(res=>{
        if (!res.data) return
        this.latelyList = res.data.list;
      })
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>