<template>
  <el-dialog
      :visible="visible"
      custom-class="schedule-dialog-container"
      :show-close="false"
      width="550px"
  >
    <template slot="title">
      <div class="el-dialog__title">添加排班任务</div>
      <i class="el-icon-close" @click="close"/>
    </template>

    <Form
        ref="form"
        :form-data="formData"
        :form-props="formProps"
        @selectChange="selectChange"
    />

    <template slot="footer">
      <el-button type="primary" @click="submit">添加</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Form from '@/components/form/index.vue';
  import moment from "moment";
  import { addSchedule } from "@/request/schedule";
  import {showMessageAfterRequest, insertOptionsToFormItems} from "@/utils/common";

  export default Vue.extend({
    props:['visible', 'personSelectList', 'boxList'],
    components:{
      Form,
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'time',label:'任务时间',type:'daterange',startPlaceholder:'开始时间',endPlaceholder:'结束时间'},
            {key:'arrangeName',label:'任务名称',type:'input'},
            {key:'detail',label:'任务详情',type:'textarea'},
            {key:'personList',label:'安排人员',type:'select',multiple:true, options:[],onChange:true},
            {key:'dutyPersonId',label:'负责人',type:'select', options:[],},
            {key:'boxId',label:'绑定设备',type:'select', options:[]},
          ],
          rules:{
            arrangeName:[{ required: true, message: '请输入任务名称', trigger: 'blur'},],
            time:[{ required: true, message: '请选择时间', trigger: 'blur'},],
            detail:[{ required: true, message: '请输入任务详情', trigger: 'blur'},],
            personList:[{ required: true, message: '请安排人员', trigger: 'blur'},],
            dutyPersonId:[{ required: true, message: '请负责人', trigger: 'blur'},],
            boxId:[{ required: true, message: '请绑定设备', trigger: 'blur'},],
          },
          hiddenFooter:true,
          hideRequiredAsterisk:true
        },
        formData:{},
      }
    },
    methods: {
      close: function (refreshTable = false) {
        this.formData = {};
        this.$emit('toggle',false, refreshTable);
      },
      submit: function () {
        //@ts-ignore
        this.$refs.form.validate((valid) => {
          let data = JSON.parse(JSON.stringify(this.formData));

          Object.keys(data).forEach(key=>{
            if (!data[key]) {
              delete data[key];
            }else if (key === 'time'){
              data.dutyStartTime = moment(data.time[0]).format('yyyy-MM-DD')+' 00:00:00';
              data.dutyEndTime = moment(data.time[1]).format('yyyy-MM-DD')+' 23:59:59';
              delete data.time;
            }
          })

          addSchedule(data).then(res=>{
            showMessageAfterRequest(res.data, '新增成功', '新增失败');
            res.data === true ? this.close(true) : this.close();
          }).catch(e=>{
            this.$message({
              type:'error',
              message:'新增失败'
            });
          })

        })
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
          let filterArray = this.$props.personSelectList.filter((item:any)=>item.value === option);

          filterArray && filterArray.length > 0 ? dutyPersonList.push(filterArray[0]) : '';
        })

        return dutyPersonList;
      },
    },
    watch:{
      personSelectList:{
        handler: function(newVal, oldVal){
          this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'personList',newVal));
        },
        deep:true,
      },
      boxList:{
        handler: function(newVal, oldVal){
          this.$set(this.formProps, 'items', insertOptionsToFormItems(this.formProps.items, 'boxId',newVal));
        },
        deep:true,
      },
    },
  })
</script>

<style scoped lang="less">
  @import "schedule-dialog.less";
</style>