<template>
  <div class="custom-pagination-container">
    <div class="opera-page">
      <span @click="changePageNum(1)">首页</span>
      <span class="multiple prev" @click="changePageNum('prev','multiple')">《</span>
    </div>
    <el-pagination
        @current-change="changePageNum"
        :current-page="pagination['pageNum']"
        :page-size="pagination['pageSize']"
        :total="pagination['total']"
        background
        layout="prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
    />
    <div class="opera-page">
      <span class="multiple next" @click="changePageNum('next','multiple')">》</span>
      <span @click="changePageNum(pagination.totalPageNum)">末页</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue';

  interface PAGINATION_PROP {
    total: number,
    pageSize: number,
    pageNum: number,
    totalPageNum: number,
  }

  export default Vue.extend({
    props:{
      pagination:{
        type: Object as PropType<PAGINATION_PROP>,
        required: true,
      },
    },
    methods: {
      changePageNum: function (pageNumParam:number | string, type?:string) {
        const { pageNum:currentPageNum, totalPageNum} = this.$props.pagination;

        if (pageNumParam === currentPageNum || totalPageNum === 1) return;

        if (type === 'multiple') {
          let num = pageNumParam === 'prev' ? currentPageNum - 5  :  currentPageNum + 5 ;
          if (num <= 1) {
            num = 1;
          }else if (num >= totalPageNum){
            num = totalPageNum;
          }
          this.$emit('changeNum',num);
        }else {
          this.$emit('changeNum',pageNumParam);
        }
      }
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>