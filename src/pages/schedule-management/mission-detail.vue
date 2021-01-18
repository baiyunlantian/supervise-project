<template>
  <div id="mission-detail-container">
    <div class="top">
      <div class="fontBlackAndBold">任务详情</div>
      <GoBackBtn />
    </div>

    <div class="mission-info">
      <div class="operate-btn">
        <template v-if="disabledForm">
          <i class="el-icon-edit" @click="disabledForm = false"/>
          <i class="el-icon-delete" @click="handleClickDelete"/>
        </template>
        <template v-else>
          <i class="el-icon-success" @click="handleSubmit('ok')"/>
          <i class="el-icon-error" @click="handleSubmit('cancel')"/>
        </template>
      </div>

      <Form
        :form-props="formProps"
        :form-data="formData"
        :disabled="disabledForm"
      >
        <el-form-item label="使用时间" prop="useTime">
          <el-date-picker v-model="formData.useStartTime" type="date" placeholder="使用时间"></el-date-picker>
          <div class="range-separator">——</div>
          <el-date-picker v-model="formData.useEndTime" type="date" placeholder="归还时间"></el-date-picker>
        </el-form-item>
      </Form>

    </div>

    <div class="form-content">
      <div class="title">
        <div class="fontBlackAndBold">施工监督报告</div>
        <i class="el-icon-folder-add" @click="handleExportExcel"/>
      </div>

      <Table
          ref="table"
          :table-props="tableProps"
      >
        <template v-slot:operate="{row}">
          <router-link
              :to="{
            path: '/schedule-management/reporter-detail',
            query:{data:row}
          }">
            查看详情>>
          </router-link>
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import GoBackBtn from '@/components/goBackBtn.vue';
  import Form from '@/components/form/index.vue';
  import Table from '@/components/table/index.vue';
  import moment from "moment";
  import {
    exportExcl,
    insertOptionsToFormItems,
    showMessageAfterRequest
  } from '@/utils/common';
  import { updateSchedule, batchDeleteSchedule } from "@/request/schedule";
  import { PERSON } from "@/request/type";
  import {getPersonSelectList} from "@/request/common";
  import {getBoxList} from "@/request/equipment";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      Table
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'time',label:'任务时间',type:'daterange',startPlaceholder:'开始时间',endPlaceholder:'结束时间'},
            {key:'personList',label:'安排人员',type:'select',multiple:true, options:[],},
            {key:'boxId',label:'绑定设备',type:'select', options:[]},
            {key:'arrangeName',label:'任务名称',type:'input'},
            {key:'dutyPersonId',label:'负责人',type:'select', options:[],},
            {key:'boxStatus',label:'设备状态',type:'select',
              options:[
                {value:0,label:'未领取'},
                {value:1,label:'已领取'},
                {value:2,label:'已归还'},
              ]
            },
            {key:'detail',label:'任务详情',type:'textarea'},
            {key:'arrangeStatus',label:'任务状态',type:'select',
              options:[
                {value:0,label:'未开始'},
                {value:1,label:'进行中'},
                {value:2,label:'已结束'},
              ]
            },
          ],
          hiddenFooter:true
        },
        tableProps:{
          url:`${PERSON}/arrange/arrangeReportSelect`,
          rowKey:'arrangeId',
          pagination:{
            pageSize:12
          },
          params:{
            //@ts-ignore
            arrangeId:this.$route.query.data.arrangeId
          },
          tableColumn:[
            {prop:'buildTime',label:'日期'},
            {prop:'code',label:'编号'},
            {prop:'startTime',label:'开始检测日期'},
            {prop:'endTime',label:'结束检测日期'},
            {prop:'num',label:'预警条数'},
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        formData:{},
        baseFormData:{},
        disabledForm:true,
        arrangeId:'',
        personSelectList:[],
      }
    },
    methods: {
      handleExportExcel: function () {
        //@ts-ignore
        let dataList = this.$refs.table.tableList;
        let sheetData: any = [];

        dataList.forEach((item:any,index:number)=>{
          let obj = [
            index+1,
            moment(item.buildTime).format('YYYY.MM.DD'),
            item.code,
            item.startTime,
            item.endTime,
            item.num,
          ];
          sheetData.push(obj);
        });

        const exclHeader = ['序号','日期','工号','开始检测时间','结束检测时间','预警条数'];
        const columnWidths = [5,10,5,10,5,5,5,5,10];
        const fileName = '施工监督报告表格';

        exportExcl(dataList, sheetData, exclHeader, columnWidths, fileName);
      },
      handleSubmit: function (type:string) {
        this.disabledForm = true;

        if (type === 'cancel'){
          this.formData = JSON.parse(JSON.stringify(this.baseFormData));
        }else if (type === 'ok'){
          updateSchedule({arrangeId:this.arrangeId, ...this.formData}).then(res=>{
            showMessageAfterRequest(res.data, '更新成功', '更新失败');
          })
        }
      },
      handleClickDelete: function () {
        this.$confirm('确认删除该任务吗？')
        .then(ok=>{
          batchDeleteSchedule({arrangeIds:[this.arrangeId]}).then(res=>{
            showMessageAfterRequest(res.data, '删除成功', '删除失败');
            res.data === true ? this.$router.back() : '';
          })
        })
        .catch(e=>{
          console.log(e)
        })
      },
      initialValueForm: function () {
        const {data} :any = this.$route.query;

        let dutyPersonList = data.personList.filter((item:any)=>item.type === 0);
        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'dutyPersonId',dutyPersonList));

        dutyPersonList && dutyPersonList.length > 0 ? data.dutyPersonId = dutyPersonList[0].personId : '';
        this.arrangeId = data.arrangeId;
        this.formData = data;
        this.$set(this.formData, 'time', [data.dutyStartTime, data.dutyEndTime]);
      },
    },
    mounted(): void {
      this.initialValueForm();

      let formData = new FormData();
      formData.append('companyCode', sessionStorage.getItem('companyCode') || '');


      getPersonSelectList(formData).then((res:any)=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.personId, label:item.personName}
        })

        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'personList',list));
        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'dutyPersonId',list));
      })

      getBoxList({pageSize:40, pageNum:1}).then(res=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.boxId, label:item.name}
        })

        this.$set(this.formProps, 'items',insertOptionsToFormItems(this.formProps.items, 'boxId', list));
      })
    }
  })
</script>

<style scoped lang="less">
  @import "mission-detail.less";
</style>