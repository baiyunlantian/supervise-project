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
      :form-data="formData"
      :form-props="formProps"
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

  export default Vue.extend({
    props:['visible'],
    components:{
      Form,
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'time',label:'任务时间',type:'daterange',startPlaceholder:'开始时间',endPlaceholder:'结束时间'},
            {key:'name',label:'任务名称',type:'input'},
            {key:'detail',label:'任务详情',type:'textarea'},
            {key:'schedulePerson',label:'安排人员',type:'select',multiple:true,
              options:[
                {value:1,label:'佩恩'},
                {value:2,label:'自来也'},
                {value:3,label:'佐助'},
                {value:4,label:'柱间'},
                {value:5,label:'鸣人'},
              ],
            },
            {key:'management',label:'负责人',type:'select',
              options:[
                {value:1,label:'长门'},
                {value:2,label:'三代'},
                {value:3,label:'大蛇丸'},
                {value:4,label:'六道木'},
                {value:5,label:'波风水门'},
              ],
            },
            {key:'service',label:'绑定设备',type:'select',
              options:[
                {value:1,label:'设备1'},
                {value:2,label:'设备2'},
                {value:3,label:'设备3'},
                {value:4,label:'设备4'},
              ]
            },
          ],
          hiddenFooter:true
        },
        formData:{},
      }
    },
    methods: {
      close: function () {
        this.formData = {};
        this.$emit('toggle',false);
      },
      submit: function () {
        let data = JSON.parse(JSON.stringify(this.formData));

        Object.keys(data).forEach(key=>{
          if (!data[key]) {
            delete data[key];
          }else if (key === 'time'){
            data.startTime = moment(data.time[0]).format('yyyy.MM.DD');
            data.endTime = moment(data.time[1]).format('yyyy.MM.DD');
            delete data.time;
          }
        })

        console.log(data);
        this.close();
      }
    },
  })
</script>

<style scoped lang="less">
  @import "schedule-dialog.less";
</style>