<template>
  <div class="table-content not-active-person">
    <div class="title">
      <div class="fontBlackAndBold">待激活人员列表（12人）</div>
      <div class="operate-btn">
        <i class="el-icon-upload" />
        <i class="el-icon-user-solid" />
      </div>
    </div>

    <div class="checkbox-all">
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div class="batch-operate">
        <span @click="batchOperate('pass')">批量通过</span>
        <span @click="batchOperate('refuse')">批量拒绝</span>
      </div>
    </div>

    <div class="list">
      <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
      >
        <div class="header">
          <el-checkbox @change="value=>handleCheckSingleChange(value,item.id)" v-if="index === 0" class="select-single-person" v-model="person0" :key="item.id" ref="person0"/>
          <el-checkbox @change="value=>handleCheckSingleChange(value,item.id)" v-else-if="index === 1" class="select-single-person" v-model="person1" :key="item.id" ref="person1"/>
          <el-checkbox @change="value=>handleCheckSingleChange(value,item.id)" v-else-if="index === 2" class="select-single-person" v-model="person2" :key="item.id" ref="person2"/>
          <div class="header-content">
            <div class="col-1">照片</div>
            <div class="col-2">姓名</div>
            <div class="col-3">手机号</div>
            <div class="col-4">性别</div>
            <div class="col-5">身份证</div>
            <div class="col-6">班组</div>
            <div class="col-7">岗位</div>
            <div class="col-8">编号</div>
            <div class="col-9">所属单位</div>
            <div class="col-10">操作</div>
          </div>
        </div>

        <div class="body">
          <div class="col-1">
            <img :src="require('@/assets/mission-person.jpg')"/>
          </div>
          <div class="content">

            <div class="body-header">
              <div class="col-2">{{item.name}}</div>
              <div class="col-3">{{item.phone}}</div>
              <div class="col-4">{{item.sex === 0 ? '男' : '女'}}</div>
              <div class="col-5">{{item.idCard}}</div>
              <div class="col-6">{{item.group}}</div>
              <div class="col-7">{{item.station}}</div>
              <div class="col-8">{{item.code}}</div>
              <div class="col-9">{{item.unit}}</div>
              <div class="col-10">
                <i class="el-icon-circle-check" />
                <i class="el-icon-circle-close" />
              </div>
            </div>

            <div class="cer-list">
              <div
                  class="cer-item"
                  v-for="(cerItem,cerIndex) in item.certificateList"
                  :key="cerIndex"
              >
                <div class="cer-info">
                  <div>{{cerItem.date}}</div>
                  <div>{{cerItem.name}}</div>
                </div>
                <div class="show-cer-detail">查看证书>></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Pagination :pagination="pagination" @changeNum="changeNum"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Pagination from '@/components/pagination/index.vue';
  import { getNotActivePersonSelectList } from '@/request/project-control';

  export default Vue.extend({
    components:{
      Pagination,
    },
    data() {
      return {
        isIndeterminate:false,
        checkAll:false,
        list:[],
        selectPerson: new Map(),
        person0:false,
        person1:false,
        person2:false,
        pagination:{
          total:0,
          pageSize:3,
          pageNum:1,
          totalPageNum:0,
        },
      }
    },
    methods: {
      changeNum: function (pageNum:number) {
        this.init({pageNum});
      },
      init: function (data?:object) {
        this.selectPerson.clear();
        let {pageSize, pageNum} = this.pagination;
        let params = {
          pageSize,
          pageNum,
          ...data
        };
        getNotActivePersonSelectList(params).then(res=>{
          if (!res.data) return;
          const { list, page } = res.data;
          this.list = list;
          this.pagination = {totalPageNum: Math.ceil(page.total/page.pageSize), ...page};

          list.forEach((item:any)=>{
            this.selectPerson.set(item.id, false);
          });
        });
      },
      batchOperate: function (type:string) {
        console.log(this.selectPerson);
      },
      handleCheckAllChange: function (check:boolean) {
        this.person0 = check;
        this.person1 = check;
        this.person2 = check;

        this.selectPerson.forEach((value:any, key:any)=>{
          this.selectPerson.set(key, check);
        });

      },
      handleCheckSingleChange: function (check:any,id:string | number) {
        this.selectPerson.set(id, check);

        let checkCount = 0;
        this.selectPerson.forEach((value:any, key:any)=>{
          if (this.selectPerson.get(key) === true){
            checkCount += 1;
          }
        });

        this.checkAll = checkCount === this.list.length ? true : false;
      },
    },
    mounted(): void {
      this.init();
    }
  })
</script>

<style scoped lang="less">
  @import "not-active-person.less";
</style>