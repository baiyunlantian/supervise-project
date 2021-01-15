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
          <el-date-picker v-model="formData.useTime" type="date" placeholder="使用时间"></el-date-picker>
          <div class="range-separator">——</div>
          <el-date-picker v-model="formData.returnTime" type="date" placeholder="归还时间"></el-date-picker>
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
  import { exportExcl, showMessageAfterRequest } from '@/utils/common';
  import { getScheduleDetail, updateSchedule, batchDeleteSchedule } from "@/request/schedule";
  import { PERSON } from "@/request/type";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      Table
    },
    data() {
      let _this = this;
      return {
        formProps:{
          items:[
            {key:'time',label:'任务时间',type:'daterange',startPlaceholder:'开始时间',endPlaceholder:'结束时间'},
            {key:'personList',label:'安排人员',type:'select',multiple:true,
              options:[
                {value:1,label:'佩恩'},
                {value:2,label:'自来也'},
                {value:3,label:'佐助'},
                {value:4,label:'柱间'},
                {value:5,label:'鸣人'},
              ],
            },
            {key:'boxId',label:'绑定设备',type:'select',
              options:[
                {value:1,label:'设备1'},
                {value:2,label:'设备2'},
                {value:3,label:'设备3'},
                {value:4,label:'设备4'},
              ]
            },
            {key:'arrangeName',label:'任务名称',type:'input'},
            {key:'dutyPersonId',label:'负责人',type:'select',
              options:[
                {value:1,label:'长门'},
                {value:2,label:'三代'},
                {value:3,label:'大蛇丸'},
                {value:4,label:'六道木'},
                {value:5,label:'波风水门'},
              ],
            },
            {key:'boxStatus',label:'设备状态',type:'select',
              options:[
                {value:1,label:'未领取'},
                {value:2,label:'已领取'},
                {value:3,label:'已归还'},
              ]
            },
            {key:'detail',label:'任务详情',type:'textarea'},
            {key:'arrangeStatus',label:'任务状态',type:'select',
              options:[
                {value:1,label:'未开始'},
                {value:2,label:'进行中'},
                {value:3,label:'已结束'},
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
            arrangeId:this.$route.query.arrangeId
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
      }
    },
    mounted(): void {
      const {arrangeId} = this.$route.query;
      //@ts-ignore
      this.arrangeId = arrangeId;

      getScheduleDetail({arrangeId}).then(res=>{
        if (!res.data) return;

        let time = [res.data.dutyStartTime, res.data.dutyEndTime];
        this.formData = {time, ...res.data};
        this.baseFormData = {time, ...res.data};
      })
    }
  })
</script>

<style scoped lang="less">
  @import "mission-detail.less";
</style>