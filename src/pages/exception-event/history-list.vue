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
  import {insertOptionsToSearchFormItems, showMessageAfterRequest} from "@/utils/common";
  import {getBoxList} from "@/request/equipment";
  import {getPersonSelectList} from "@/request/common";

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
              {value:101,label:'登高异常'},
              {value:102,label:'人脸异常'},
              {value:103,label:'火灾异常'},
              {value:104,label:'安全帽异常'},
              {value:105,label:'静止异常'},
              {value:106,label:'反光衣异常'},
              {value:107,label:'区域异常'},
              {value:108,label:'跌倒异常'},
            ],
          },
          {key:'arrangeId',label:'所属任务',type:'select',
            options:[],
          },
          {key:'boxId',label:'设备',type:'select', options:[],},
          {key:'personId',label:'关联人员',type:'select', options:[],},
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
          pageNum:param.hasOwnProperty('pageNum') ? pageNum : 1,
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
      let formData = new FormData();
      formData.append('companyCode', sessionStorage.getItem('companyCode') || '');
      this.initList(this.pagination);


      getBoxList({pageSize:40, pageNum:1}).then(res=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.boxId, label:item.name}
        })

        const {targetIndex, targetItem} = insertOptionsToSearchFormItems(this.formItemsProp, 'boxId', list);
        this.formItemsProp.splice(targetIndex, 1, targetItem)
      })

      getPersonSelectList(formData).then((res:any)=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.personId, label:item.personName}
        })

        const {targetIndex, targetItem} = insertOptionsToSearchFormItems(this.formItemsProp, 'personId', list);
        this.formItemsProp.splice(targetIndex, 1, targetItem)
      })

    }
  })
</script>

<style scoped lang="less">
  @import "history-list.less";
</style>