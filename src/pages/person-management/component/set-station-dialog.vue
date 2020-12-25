<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="set-station-dialog-container"
      width="600px"
      title=岗位设置
  >
    <el-form :model="stationData" ref="dynamicValidateForm" label-width="60px" class="demo-dynamic">
      <el-form-item
          v-for="(item, index) in dynamic"
          :label="item.label"
          :key="index"
          :prop="item.key"
      >
        <el-input v-model="stationData[item.key]" />
        <i class="el-icon-circle-close" @click="removeDynamic(item.key)"/>
        <span v-if="index === dynamic.length - 1" @click="addDynamic">+</span>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:{
      visible:Boolean,
    },
    data() {
      return {
        dynamic:[
          {key:'station1',label:'岗位:'},
          {key:'station2',label:'岗位:'},
          {key:'station3',label:'岗位:'},
          {key:'station4',label:'岗位:'},
        ],
        stationData:{},
      }
    },
    methods: {
      submit: function () {
        let data : any = {};
        this.dynamic.forEach((item:any)=>{
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
        this.dynamic = [
          {key:'station1',label:'岗位:'},
          {key:'station2',label:'岗位:'},
          {key:'station3',label:'岗位:'},
          {key:'station4',label:'岗位:'},
        ];
        this.$emit('close', 'setStationDialogVisible', false);
      },
      removeDynamic: function (stationKey:string) {
        console.log(stationKey);
        let stationIndex = 0;
        this.dynamic.forEach((item:any,index:number)=>{
          if (item.key === stationKey){
            stationIndex = index;
          }
        });
        this.dynamic.splice(stationIndex, 1);
      },
      addDynamic: function () {
        this.dynamic.push({key:`station${new Date().getTime()}`, label:'岗位：'})
      }
    },
  })
</script>

<style scoped lang="less">
  @import "set-station-dialog.less";
</style>