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

    <MissionTable />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import GoBackBtn from '@/components/goBackBtn.vue';
  import Form from '@/components/form/index.vue';
  import MissionTable from './component/mission-table.vue';
  import moment from "moment";
  import {insertOptionsToFormItems, showMessageAfterRequest} from '@/utils/common';
  import { updateSchedule, batchDeleteSchedule } from "@/request/schedule";
  import {getPersonSelectList} from "@/request/common";
  import {getBoxList} from "@/request/equipment";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      MissionTable,
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
        formData:{},
        baseFormData:{},
        disabledForm:true,
        arrangeId:'',
        personSelectList:[],
        delFlagList:[],
      }
    },
    methods: {
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