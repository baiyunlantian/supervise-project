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
          <i class="el-icon-edit" @click="handleClickOperateBtn('edit')"/>
          <i class="el-icon-delete" @click="handleClickOperateBtn('delete')"/>
        </div>
      </div>
    </template>

    <el-checkbox
        v-if="showCheckbox"
        class="checkbox-all"
        v-model="checkAll"
        @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>

    <el-checkbox-group v-model="checkedStation" @change="checkAll = checkedStation.length === stationIds.length ? true : false">
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
            <el-input v-model="stationData[item.key]" :disabled="disabledInput"/>
            <el-checkbox :label="item.key" :key="index" v-if="showCheckbox" />
          </el-form-item>
      </el-form>
    </el-checkbox-group>

    <div v-if="stationList.length === 0" class="empty-text">请先添加岗位。</div>


    <template slot="footer">
      <el-button type="primary" @click="handleOperateStation" v-show="submitBtnVisible">确认</el-button>
      <el-button @click="close">关闭</el-button>
    </template>

    <AddStationDialog
      :visible="addStationVisible"
      @close="toggleAddStationDialog"
      @refreshList="initStationList"
    />
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import AddStationDialog from './add-station-dialog.vue';
  import { updateStation, deleteStation, } from "@/request/department";
  import { getStationList } from "@/request/common";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    props:{visible:Boolean},
    components:{AddStationDialog},
    data() {
      return {
        checkedStation:[],    //选中的岗位，传给后台的值
        stationList:[],       //后台返回的岗位列表
        stationIds:[],        //方便全选时赋值
        stationData:{},       //from表单的model对象
        baseStationData:{},       //基础from表单数据
        rules: {
          stationName:[
            { required: true, message: '请输入岗位', trigger: 'blur'},
            { min:1, max:10, message: '最大长度为10个字', trigger: 'blur'},
          ],
        },
        operateType:'',
        addStationVisible:false,
        submitBtnVisible:false,
        disabledInput:true,
        showCheckbox:false,
        checkAll:false,
      }
    },
    methods: {
      close: function () {
        this.operateType = '';
        this.disabledInput = true;
        this.showCheckbox = false;
        this.submitBtnVisible = false;
        this.stationData = JSON.parse(JSON.stringify(this.baseStationData));

        this.$emit('close', 'setStationDialogVisible', false);
      },
      initStationList: function (init = true) {
        if (!init) return;
        let formData = new FormData();

        formData.append('companyCode', sessionStorage.getItem('companyCode') || '');

        getStationList(formData).then((res:any)=>{
          if (!res.data) return;
          let stationSelectList : any = [];
          let stationCommonMap = new Map();

          if (res.data.list && res.data.list.length > 0) {
            let data : any = {};
            let stationIds: any= [];
            let list = res.data.list.map((item:any)=>{
              item.stationId = String(item.stationId);
              stationSelectList.push({value:item.stationId, label:item.stationName});
              stationCommonMap.set(Number(item.stationId), item.stationName);
              data[item.stationId] = item.stationName;
              stationIds.push(item.stationId);
              return {key:item.stationId, label:'岗位：'}
            })

            this.stationData = data;
            this.baseStationData = JSON.parse(JSON.stringify(data));
            this.stationList = list;
            this.stationIds = stationIds;

            this.$emit('updateStation', stationSelectList, stationCommonMap);
          }
        })
      },
      handleOperateStation: function () {

        let handleFn : any;
        let text : string;
        let list : any = [];

        if (this.checkedStation.length === 0) {
          this.$message({
            type:'info',
            message:'请选择岗位！'
          });

          return;
        }

        if (this.operateType === 'edit'){
          handleFn = updateStation;
          text = '更新';

          Object.keys(this.stationData).forEach(key=>{
            //@ts-ignore
            list.push(`${key}-${this.stationData[key]}`)
          })
        }else if (this.operateType === 'delete'){
          handleFn = deleteStation;
          text = '删除';
          list =  this.checkedStation;
        }

        if (list.length === 0) {
          this.$message({
            type:'info',
            message:'请选择岗位！'
          });

          return;
        }

        handleFn({list}).then((res:any)=>{
          this.close();
          showMessageAfterRequest(res.data, text+'岗位成功', text+'岗位失败');
          res.data === true ? this.initStationList() : '';
        })

      },
      handleClickOperateBtn: function (type:string) {
        this.operateType = type;

        if (type === 'add'){
          this.toggleAddStationDialog()
        } else if (type === 'edit'){
          this.disabledInput = false;
          this.showCheckbox = false;
          this.submitBtnVisible = true;
        }else if (type === 'delete'){
          this.disabledInput = true;
          this.showCheckbox = true;
          this.submitBtnVisible = true;
        }
      },
      toggleAddStationDialog: function (visible = true) {
        this.addStationVisible = visible;
      },
      handleCheckAllChange: function () {
        if (this.checkAll){
          this.checkedStation = this.stationIds;
        }else{
          this.checkedStation = [];
        }
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