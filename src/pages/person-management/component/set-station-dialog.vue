<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="set-station-dialog-container"
      width="600px"
  >
    <template slot="title">
      <div class="custom-title">
        <div>岗位设置</div>
        <div class="operate-btn">
          <span class="el-icon-add" @click="handleClickOperateBtn('add')">+</span>
          <i class="el-icon-edit" />
          <i class="el-icon-delete" />
        </div>
      </div>
    </template>

    <el-form
        class="demo-dynamic"
        :model="stationData"
        ref="dynamicValidateForm"
        label-width="60px"
        v-if="stationList.length > 0"
    >
      <el-form-item
          v-for="(item, index) in stationList"
          :label="item.label"
          :key="index"
          :prop="item.key"
      >
        <el-input v-model="stationData[item.key]" />
        <i class="el-icon-circle-close" @click="removeDynamic(item.key)"/>
      </el-form-item>
    </el-form>
    <div v-else class="empty-text">请先添加岗位。</div>

    <template slot="footer">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="close">关闭</el-button>
    </template>

    <AddStationDialog
      :visible="addStationVisible"
      @close="toggleAddStation"
    />
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import AddStationDialog from './add-station-dialog.vue';
  import {
    addStation,
    updateStation,
    deleteStation,
    getStationList
  } from "@/request/department";

  export default Vue.extend({
    props:{
      visible:Boolean,
    },
    components:{
      AddStationDialog,
    },
    data() {
      return {
        stationList:[],
        stationData:{},
        rules: {
          stationName:[
            { required: true, message: '请输入岗位', trigger: 'blur'},
          ],
        },
        operateType:'',
        addStationVisible:false,
      }
    },
    methods: {
      submit: function () {
        let data : any = {};
        this.stationList.forEach((item:any)=>{
          //@ts-ignore
          if (this.stationData[item.key]){
            //@ts-ignore
            data[item.key] = this.stationData[item.key];
          }
        });

        console.log(data);
        this.close();
      },
      close: function () {
        this.stationData = {};
        this.$emit('close', 'setStationDialogVisible', false);
      },
      removeDynamic: function (stationId:string) {
        if (!stationId) return;

        deleteStation({stationId}).then(res=>{
          if (res.data){
            this.$message({
              type:'success',
              message:'人员成功'
            });
            this.$emit('initTable');
          }else {
            this.$message({
              type:'error',
              message:'人员失败'
            });
          }
        })
      },
      initStationList: function () {
        getStationList().then(res=>{
          if (!res.data) return;

          if (res.data.list && res.data.list.length > 0) {
            let list = res.data.list.map((item:any)=>{
              return {key:item.stationId, label:item.stationName}
            })

            this.stationList = list;
          }
        })
      },
      handleOperateStation: function (operate:string, id?:string) {
        let handleFn = new Function();
        let text : string;
        let data : any;

        if (operate === 'add'){
          handleFn = addStation;
          text = '添加';
        }else if (operate === 'update'){
          handleFn = updateStation;
          text = '更新';
        }else if (operate === 'delete'){
          handleFn = deleteStation;
          text = '删除';
        }

        handleFn(data).then((res:any)=>{
          if (res.data){
            this.$message({
              type:'success',
              message:text+'岗位成功'
            });
            this.initStationList();
          }else {
            this.$message({
              type:'error',
              message:text+'岗位失败'
            });
          }
        })

      },
      handleClickOperateBtn: function (type:string) {
        this.operateType = type;

        if (type === 'add') this.toggleAddStation();
      },
      toggleAddStation: function (visible = true) {
        this.addStationVisible = visible;
      }
    },
    mounted(): void {
      this.initStationList();
    }
  })
</script>

<style scoped lang="less">
  @import "set-station-dialog.less";
</style>