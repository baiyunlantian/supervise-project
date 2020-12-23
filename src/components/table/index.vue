<template>
  <div id="table-wrapper">
    <el-table
        :data="tableList"
        :row-key="rowKey"
        style="width: 100%"
        :stripe="tableProps.showStripe"
        :border="tableProps.showBorder"
        @selection-change="multipleSelectChange"
    >
      <!--  首列配置项--开头    -->

        <!--  具有展开功能    -->
        <el-table-column
            v-if="firstColumn.show && firstColumn.type === 'expand'"
            type="expand"
            :width="firstColumn.width"
            :align="firstColumn.align || 'center'"
        >
          <template slot-scope="scope">
            <slot name="expandContent" :row="scope.row"/>
          </template>
        </el-table-column>

        <!--  具有多选功能    -->
        <el-table-column
            v-else-if="firstColumn.show && firstColumn.type === 'selection'"
            type="selection"
            :width="firstColumn.width"
            :align="firstColumn.align || 'center'"
        />

        <!--  显示序号    -->
        <el-table-column
            v-else-if="firstColumn.show && firstColumn.type === 'index'"
            type="index"
            :label="firstColumn.label"
            :width="firstColumn.width"
            :align="firstColumn.align || 'center'"
        />
      <!--  首列配置项--结尾    -->

      <!--  其余列配置项--列头  -->
        <el-table-column
            v-for="(column, index) in tableColumn"
            :key="index"
            :column-key="column.prop"
            :prop="column.prop"
            :width="column.width"
            :align="column.align || 'center'"
            show-overflow-tooltip
        >
          <!-- 自定义表头---开始-->
          <template slot="header" slot-scope="scope">
            <!-- 是否开启单项筛选功能---开始-->
            <el-popover
                v-if="column.filter"
                placement="bottom"
                width="150"
                trigger="click">
              <div slot="reference">
                {{column.label}}
                <i class="el-icon-caret-bottom" />
              </div>
              <!--     单选项     -->
              <div class="el-table-filter__content el-table-filter__custom">
                <el-radio-group class="el-table-filter__radio-group radio-use-checkbox-style" v-model="filteredValue[column.prop]" @change="(value)=>filterChange(value, column.prop)">
                  <el-radio :label="null">全部</el-radio>
                  <el-radio
                      v-for="filter in column.filters"
                      :key="filter.value"
                      :label="filter.value">{{ filter.text }}</el-radio>
                </el-radio-group>
              </div>
            </el-popover>
            <!-- 是否开启单项筛选功能---结束-->

            <!--  默认表头  -->
            <template v-else>{{column.label}}</template>
          </template>
          <!-- 自定义表头---结束-->

          <!-- 自定义列内容  -->
          <template slot-scope="scope">
            <slot v-if="column.insertHtml" :name="column.prop" :row="scope.row"/>
            <template v-else>{{ column.format ? column.format(scope.row[column.prop], scope.row) : scope.row[column.prop]}}</template>
          </template>
        </el-table-column>
      <!--  其余列配置项--列头  -->
    </el-table>

    <Pagination v-if="!tableProps.hiddenPagination" :pagination="pagination" @changeNum="changePageNum"/>
  </div>
</template>

<script lang="ts">
  import Vue, {PropType} from "vue";
  import Pagination from '@/components/pagination/index.vue';
  import * as API from '@/utils/axios';
  import {PERSON} from '@/request/type';

  interface TABLE_PROPS {
    url: string,
    rowKey: string,
    tableColumn: Array<TABLE_COLUMN_PROPS>,
    hiddenPagination?: boolean,
    params?: object,
    showStripe?: boolean,
    showBorder?: boolean,
    firstColumn?: FIRST_COLUMN_PROPS,
  }

  interface TABLE_COLUMN_PROPS {
    prop: string,
    label: string,
    filters?: [{text:'',value:''}],
    filter?: Boolean,
    format?: Function,
    insertHtml?: Boolean,
  }

  interface FIRST_COLUMN_PROPS {
    show: boolean,
    label: string,
    type: 'selection' | 'expand' | 'index',
    width?: number,
    align?: 'left' | 'center' | 'right',
  }

  export default Vue.extend({
    props: {
      tableProps: {
        type: Object as PropType<TABLE_PROPS>,
        required: true,
      },
      searchParams:{}
    },
    components:{
      Pagination,
    },
    data() {
      return {
        url: '',
        rowKey: '',
        pagination: {
          hideOnSinglePage: true,
          pageNum: 1,
          total: 0,
          pageSize: 10,
          pagerCount: 7,
          totalPageNum:0,
        },
        params:{},
        firstColumn: {
          width: 200,
          label: '序号',
        },
        tableColumn: [],
        tableList: [],
        filteredValue:{},
      }
    },

    watch:{
      searchParams:{
        handler: function(newVal:object, oldVal:object) {
          // 每次通过搜索表单查询列表时，默认跳回第一页
          this.initTable({pageNum:1,...newVal});
        },
        deep:true,
      },
    },

    methods: {
      initTable: function (param = {}) {
        const {pageSize, pageNum} = this.pagination;
        /*
        * params---父组件传入的固定参数
        * this.$props.searchParams---通过操作页面传入的查询参数
        * */
        const data = {
          pageSize,
          pageNum,
          ...this.params,
          ...this.$props.searchParams,
          ...param,
        };

        API.POST(`${this.url}`, data)
          .then(res => {
            const {list, page} = res.data;
            this.tableList = list || [];
            if (page) {
              const {total = 0, pageSize = 10, pageNum = 1} = page;
              this.pagination = {...this.pagination, totalPageNum: Math.ceil(total/pageSize), total, pageSize, pageNum};
              this.$emit('updatePagination',this.pagination);
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      changePageNum: function (pageNum: number) {
        this.initTable({pageNum});
      },

      filterChange: function (value: string | number | null, key:string) {
        const _this:any = this;

         if (value === '' || value === 'null' || value === 'undefined' || value === null || value == undefined){
           delete _this.filteredValue[key];
         }else {
           _this.filteredValue[key] = value;
         }

        this.initTable(_this.filteredValue);
      },

      multipleSelectChange: function (selection:any) {
        this.$emit('multipleSelectChange',selection);
      }
    },

    mounted(): void {
      const { tableProps } = this.$props;
      const _this:any = this;
      Object.keys(tableProps).forEach((key:string)=>{
        if (typeof tableProps[key] === 'object') {
          _this[key] = Object.assign(_this[key], tableProps[key]);

          if (key === 'tableColumn') {
            // 有筛选项时，为每个筛选项创建单独的model对象
            tableProps[key].hasOwnProperty('filters') === true ? _this.filteredValue[tableProps[key].prop] = '' : '';
          }

        }else{
          _this[key] = tableProps[key];
        }
      });
      this.initTable();
    },
  })
</script>

<style lang="less">
  @import "index.less";
</style>