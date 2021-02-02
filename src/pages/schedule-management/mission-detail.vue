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
          ref="form"
          :form-props="formProps"
          :form-data="formData"
          :disabled="disabledForm"
          @selectChange="selectChange"
          @selectRemoveTag="selectRemoveTag"
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
        <SvgIcon name="exportExcel" @click="handleExportExcel"/>
      </div>

      <Table
          ref="table"
          :table-props="tableProps"
          @multipleSelectChange="multipleSelectChange"
          @updateCustomParam="updateCustomParam"
      >
        <template v-slot:num="{row}">
          <div>{{reportNum[row.reportId] || 0}}</div>
        </template>

        <template v-slot:operate="{row}">
          <div class="jump-page" @click="handleJumpPage(row)">查看详情>></div>
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
  import SvgIcon from '@/components/svgIcon.vue';
  import moment from "moment";
  import {
    exportExcl,
    insertOptionsToFormItems,
    showMessageAfterRequest
  } from '@/utils/common';
  import { updateSchedule, batchDeleteSchedule, getArrangeReportExceptionCensus } from "@/request/schedule";
  import { PERSON, MOCK } from "@/request/type";
  import {getPersonSelectList} from "@/request/common";
  import {getBoxList} from "@/request/equipment";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      Table,
      SvgIcon
    },
    data() {
      const _this = this;
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
          rules:{
            arrangeName:[{ required: true, message: '请输入任务名称', trigger: 'blur'},],
            time:[{ required: true, message: '请选择时间', trigger: 'blur'},],
            detail:[
              { required: true, message: '请输入任务详情', trigger: 'blur'},
              { min:1, max:56, message: '请输入1-56个字', trigger: 'blur'}
            ],
            personList:[{ required: true, message: '请安排人员', trigger: 'blur'},],
            dutyPersonId:[{ required: true, message: '请选择负责人', trigger: 'blur'},],
            boxId:[{ required: true, message: '请绑定设备', trigger: 'blur'},],
          },
          hiddenFooter:true,
          hideRequiredAsterisk:true
        },
        tableProps:{
          url:`${PERSON}/arrange/arrangeReportSelect`,
          rowKey:'reportId',
          firstColumn:{
            show:true,
            type:'selection'
          },
          pagination:{
            pageSize:12
          },
          params:{
            //@ts-ignore
            arrangeId:this.$route.query.arrangeId
          },
          tableColumn:[
            {prop:'buildTime',label:'日期'},
            {prop:'code',label:'编号'},
            {prop:'startTime',label:'开始检测日期'},
            {prop:'endTime',label:'结束检测日期'},
            {prop:'num',label:'预警条数',insertHtml:true,},
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        formData:{},
        baseFormData:{},
        disabledForm:true,
        arrangeId:'',
        reportIds:[],
        personSelectList:[],
        delFlagList:[],
        exceptionEventCommon:{
          face:'人脸识别预警',
          climbHeight:'登高预警',
          fire:'火灾预警',
          helmet:'安全帽预警',
          motionless:'静止预警',
          refectiveVest:'反反光衣预警',
          region:'区域预警',
          tumble:'跌倒预警',
        },
        reportNum:{},
      }
    },
    methods: {
      handleExportExcel: function () {
        // 如果有勾选表格行，则导出勾选的表格行所对应的报告详情信息，否则导出当前表格内容
        this.reportIds.length === 0 ? this.exportTableList() : this.exportExceptionCensus();

      },
      exportExceptionCensus: function () {
        let fnArray = this.reportIds.map((reportId:string)=>{
          return this.handleGetExceptionCensus(reportId)
        })

        Promise.all(fnArray).then((res:any)=>{
          //res--数组
          const list = this.handleFormatAllExceptionData(res);    //获取全所勾选的行的预警详情数据

          let sheetData: any = [];

          list.forEach((item:any,index:number)=>{
            let obj = [
              index+1,
              item.type,
              item.createTime,
              item.arrangeName,
              item.personName,
              item.isDeal === 0 ? '未处理' :'已处理',
            ];
            sheetData.push(obj);
          });

          const exclHeader = ['序号','预警类型','发生时间','事件名称','关联人员','状态'];
          const columnWidths = [5,10,15,10,10,5];
          const fileName = '预警表格';

          exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
        }).catch(e=>{
          console.log(e)
        })

      },
      //获取每份报告里的预警详情
      handleGetExceptionCensus: async function (reportId:string): Promise<object> {
          let {data} = await getArrangeReportExceptionCensus({reportId})
          return data;
      },
      //格式化所勾选的行的预警详情数据
      handleFormatAllExceptionData: function (list = []) :[] {

        let face:any = [];
        let climbHeight:any = [];
        let fire:any = [];
        let helmet:any = [];
        let motionless:any = [];
        let refectiveVest:any = [];
        let region:any = [];
        let tumble:any = [];

        try{
          list && list.forEach((censusItem:any)=>{
            //censusItem--每行预警详情数据
            Object.keys(censusItem).forEach(key=>{
              censusItem[key] && censusItem[key].forEach((eventItem:any)=>{
                //eventItem--预警类型
                switch (key) {
                  case 'face':
                    face.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'climbHeight':
                    climbHeight.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'fire':
                    fire.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'helmet':
                    helmet.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'motionless':
                    motionless.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'refectiveVest':
                    refectiveVest.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'region':
                    region.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                  case 'tumble':
                    tumble.push({...eventItem, type:this.exceptionEventCommon[key]});
                    break;
                }
              })
            })
          })
          return face.concat(climbHeight, fire, helmet, motionless, refectiveVest, region, tumble);
        }catch (e) {
          console.log(e)
          return []
        }
      },
      exportTableList: function () {
        //@ts-ignore
        this.$refs.table.exportExcelList.then(res=>{
          let sheetData: any = [];

          res.forEach((item:any,index:number)=>{
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

          exportExcl(res, sheetData, exclHeader, columnWidths, fileName);
        });
      },
      handleSubmit: function (type:string) {
        this.disabledForm = true;

        if (type === 'cancel'){
          this.formData = JSON.parse(JSON.stringify(this.baseFormData));
          //@ts-ignore
          this.$set(this.formData, 'time', [this.baseFormData.dutyStartTime, this.baseFormData.dutyEndTime]);
        }else if (type === 'ok'){
          //@ts-ignore
          this.$refs.form.validate((valid) => {
            let data: any = {
              arrangeId:this.arrangeId,
              ...this.formData
            };

            Object.keys(data).forEach(key=>{
              if (!data[key]) return;
              if (key === 'useStartTime' || key === 'useEndTime') {
                data[key] = moment(data[key]).format('yyyy-MM-DD')+' 00:00:00';
              }else if (key === 'time'){
                data.dutyStartTime = moment(data[key][0]).format('yyyy-MM-DD')+' 00:00:00';
                data.dutyEndTime = moment(data[key][1]).format('yyyy-MM-DD')+' 23:59:59';
                delete data.time;
              }
            })

            updateSchedule(data).then(res=>{
              showMessageAfterRequest(res.data, '更新成功', '更新失败');
            })
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
        //@ts-ignore
        let data:any = JSON.parse(sessionStorage.getItem('missionDetailFormData'));
        let dutyPersonList: any = [];
        let delFlagList: any = [];

        let personList = data.personList.map((item:any)=>{
          //负责人
          if (item.type === 1){
            data.dutyPersonId = item.personId;
          }

          //delFlag: 1--已删除  0--未删除
          if(item.delFlag === 1){
            delFlagList.push(item.personName);
          }
          dutyPersonList.push({value:item.personId, label:item.personName, disabled:item.delFlag === 1 ? true : false});
          return item.delFlag === 1 ? item.personName : item.personId
        });

        this.delFlagList = delFlagList;
        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'dutyPersonId',dutyPersonList));
        this.arrangeId = data.arrangeId;
        this.formData = {...data, time:[data.dutyStartTime, data.dutyEndTime], personList};
        this.baseFormData = {...data, time:[data.dutyStartTime, data.dutyEndTime], personList};
        // this.$set(this.formData, 'time', [data.dutyStartTime, data.dutyEndTime]);
      },
      multipleSelectChange: function (value:any) {
        this.reportIds = value.map((item:any)=>item.reportId);
      },
      selectChange: function (options:any, key:string) {
        if (key !== 'personList') return;

        //@ts-ignore
        if (options.includes(this.formData.dutyPersonId) === false){
          this.$set(this.formData, 'dutyPersonId', '');
        }

        let list = this.filterDutyPersonList(options);
        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'dutyPersonId',list));
      },
      filterDutyPersonList: function (options:any):object {
        let dutyPersonList : any = [];

        (options || []).forEach((option:string)=>{
          let filterArray = this.personSelectList.filter((item:any)=>item.value === option);

          filterArray && filterArray.length > 0 ? dutyPersonList.push(filterArray[0]) : '';
        })

        return dutyPersonList;
      },
      handleRenderPersonSelectList: function () {
        this.delFlagList.forEach((item:string)=>{
          this.personSelectList.forEach((option:any, index)=>{
            if (item === option.value){
              option.disabled = true;
              this.$set(this.personSelectList, index, option)
            }
          })
        })

        this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'personList',this.personSelectList));
      },
      selectRemoveTag: function (option:never, key:string) {
        if (this.delFlagList.includes(option)){
          this.$message({
            type:'warning',
            message:'该人员已被系统删除，移除失败'
          });
          //@ts-ignore
          this.$set(this.formData, 'personList', [...this.formData.personList, option]);
        }
      },
      handleJumpPage: function (data:any) {
        sessionStorage.setItem('reporterDetailFormData',JSON.stringify(data))
        this.$router.push({ path: '/schedule-management/reporter-detail', query: { reportId: data.reportId }});
      },
      updateCustomParam: function (data:object) {
        this.reportNum = data;
      }
    },
    mounted(): void {
      getPersonSelectList().then((res:any)=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.personId, label:item.personName}
        })

        this.personSelectList = list;
        this.handleRenderPersonSelectList();
      })

      getBoxList({pageSize:40, pageNum:1}).then(res=>{
        if (!res.data) return;

        let list = res.data.list.map((item:any)=>{
          return {value:item.boxId, label:item.name}
        })

        this.$set(this.formProps, 'items',insertOptionsToFormItems(this.formProps.items, 'boxId', list));
      })

      this.initialValueForm();

    }
  })
</script>

<style scoped lang="less">
  @import "mission-detail.less";
</style>