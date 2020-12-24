<template>
  <div class="custom-pagination-container">
    <el-pagination
        @current-change="changePageNum"
        :current-page="pagination['pageNum']"
        :page-size="pagination['pageSize']"
        :total="pagination['total']"
        background
        layout="total,prev, pager,next, jumper"
        prev-text="<<"
        next-text=">>"
    />
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
        console.log(pageNumParam,type)
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
      },
      change: function ( type:string, str:string) {
        this.changePageNum(type, str)
      }
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>