<template>
  <div id="history-list-container">
    <SearchForm
      :form-data="searchParams"
      :form-items-prop="formItemsProp"
      @search="searchList"
    >
      <GoBackBtn />
    </SearchForm>

    <div class="list">
      <ExceptionItem
          v-for="(item,index) in list"
          :key="index"
          :data="item"
          @showDetailDialog="showDetailDialog"
          @delete="deleteItem"
          @updateItem="updateItem"
      />
    </div>

    <Pagination
      :pagination="pagination"
      @changeNum="pageNum=>initList({pageNum})"
    />

    <DetailDialog
        :visible="detailVisible"
        :data="detailData"
        @close="showDetailDialog"
        @initList="initList"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ExceptionItem from './component/exception-item.vue';
  import DetailDialog from './component/detail-dialog.vue';
  import Pagination from '@/components/pagination/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import GoBackBtn from '@/components/goBackBtn.vue';
  import {deleteEvent, getExceptionList, updateEvent} from '@/request/exception';
  import moment from "moment";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      ExceptionItem,
      DetailDialog,
      Pagination,
      SearchForm,
      GoBackBtn,
    },
    data() {
      return {
        list:[],
        searchParams:{},
        formItemsProp:[
          {key:'type',label:'事件类型',type:'select',
            options:[
              {value:1,label:'类型1'},
              {value:2,label:'类型2'},
              {value:3,label:'类型3'},
              {value:4,label:'类型4'},
            ],
          },
          {key:'arrangeId',label:'所属任务',type:'select',
            options:[
              {value:1,label:'任务1'},
              {value:2,label:'任务2'},
              {value:3,label:'任务3'},
              {value:4,label:'任务4'},
            ],
          },
          {key:'boxId',label:'设备',type:'select',
            options:[
              {value:1,label:'设备1'},
              {value:2,label:'设备2'},
              {value:3,label:'设备3'},
              {value:4,label:'设备4'},
            ],
          },
          {key:'personId',label:'关联人员',type:'input'},
          {key:'time',label:'时间',type:'datetimerange',format:'yyyy-MM-dd HH:mm:ss'},
          {key:'isDeal',label:'状态',type:'select',
            options:[
              {value:1,label:'已处理'},
              {value:0,label:'未处理'},
            ],
          },
        ],
        pagination:{
          total:0,
          pageNum:1,
          pageSize:12,
        },
        detailVisible:false,
        detailData:{},
      }
    },
    methods: {
      initList: function (param = {}) {
        const {pageSize, pageNum} = this.pagination;
        let data : any = {
          pageSize,
          pageNum,
          ...param
        };

        getExceptionList(data).then(res=>{
          if (!res.data) return
          const {list, page} = res.data;
          this.list = list;
          this.pagination = page;
        })
      },
      searchList: function (param:any) {
        let data = param;

        if (data.time && data.time.length > 0){
          data.startTime = moment(data.time[0]).format('yyyy-MM-DD HH:mm:ss');
          data.endTime = moment(data.time[1]).format('yyyy-MM-DD HH:mm:ss');
          delete data.time;
        }

        this.initList(data);
      },
      showDetailDialog: function (visible:boolean, data = {}) {
        this.detailVisible = visible;
        this.detailData = data;
      },
      deleteItem: function (item:any) {
        this.$confirm('确定删除该条信息吗？')
          .then(res=>{
            let {exceptionId, type} = item;

            deleteEvent({exceptionId, type}).then(res=>{
              showMessageAfterRequest(res.data, '删除成功','删除失败');
              //@ts-ignore
              res.data === true ? this.initList(this.searchParams) : '';
            })
          }).catch(e=>e)
      },
      updateItem: function (data:object) {
        updateEvent(data).then(res=>{
          showMessageAfterRequest(res.data, '更新成功','更新失败');
          //@ts-ignore
          res.data === true ? this.initList(this.searchParams) : '';
        })
      },
    },
    mounted(): void {
      this.initList(this.pagination);
    }
  })
</script>

<style scoped lang="less">
  @import "history-list.less";
</style>