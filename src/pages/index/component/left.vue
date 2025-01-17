<template>
  <div id="left-container">
    <div class="top bgcAndShadow">
      <div class="item">
        <div>
          <div class="text">当前在线设备</div>
          <div class="count" style="color: rgb(0, 131, 255)">{{boxCensus.boxRunningCount || 0}}</div>
        </div>
        <div>
          <div class="text">今日已开始任务</div>
          <div class="count" style="color: rgb(4, 178, 82)">{{boxCensus.arrangeRunningCount || 0}}</div>
        </div>
      </div>
      <div class="item">
        <div>
          <div class="text">今日已用流量</div>
          <div class="count" style="color: rgb(237, 56, 81)">{{flowCensus.todayOutByte}}M</div>
        </div>
        <div>
          <div class="text">共用流量</div>
          <div class="count" style="color: rgb(152, 70, 209)">{{flowCensus.totalOutByte}}M</div>
        </div>
      </div>
      <SvgIcon name="setFlow" @click="flowDialog = true"/>
    </div>

    <div class="terminal-container bgcAndShadow hiddenScrollbar">

      <SearchInput placeholder="" @search="filterBoxTree"/>

      <el-tree
          ref="tree"
          :props="defaultProps"
          :data="treeBoxList"
          :load="loadTree"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          class="hiddenScrollbar"
          lazy
          accordion
          node-key="boxId"
          @node-expand="expandBoxTree"
      >
        <template v-slot="{ node, data }" class="group">
          <div class="custom-tree-node" @click="handleClickTreeNode(node, data)" :class="{currentCamera:currentCameraId === data.id, expand:node.expanded}">
            <div class="img">
              <span v-if="node.expanded === true || data.hasOwnProperty('parentId')">-</span>
              <span v-else-if="node.expanded === false">+</span>
            </div>
            <div class="label" :class="{active:node.expanded === true, exception:handleJudgeException(node.level, data.id)}">
              <span>{{data.label}}</span>
              <span class="point" v-if="handleJudgeException(node.level, data.id)"></span>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <el-dialog
      :visible="flowDialog"
      title="流量提醒设置"
      width="400px"
      :show-close="false"
      custom-class="flow-dialog"
    >

      <div class="content">
        <div class="form-item">
          <div class="label">流量使用提醒：</div>
          <el-input type="input" v-model="flowMax" @input="checkFlowValid"/>
        </div>
        <div class="sub">(不做使用上限提醒时请输入0，单位：M)</div>
        <div class="error-text" :style="{visibility: flowValid === true ? 'hidden' : 'visible'}">请输入大于等于0的正整数</div>
      </div>

      <template slot="footer">
        <el-button type="primary" @click="updateFlow">保存</el-button>
        <el-button @click="flowDialog = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import SearchInput from '@/components/search-input/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getCameraList, getBoxList, getDeviceRunningCensus } from "@/request/equipment";
  import { getFlowCensus, getFlowAlert, updateFlowAlert, deleteFlowAlert } from '@/request/index';
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    props:['exceptionList'],
    components:{
      SearchInput,
      SvgIcon,
    },
    data(){
      return{
        defaultProps: {
          children: 'zones',
          label: 'label',
          isLeaf: 'leaf',
          id:'id',
          parentId:'parentId',
        },
        treeBoxList:[],
        boxCensus:{
          boxRunningCount:0,
          arrangeRunningCount:0,
        },
        flowCensus:{
          totalOutByte:0,
          todayOutByte:0,
        },
        flowDialog:false,
        flowMax:'',
        flowValid:true,
        firstNode:'',
        resolveFn:new Function(),
        cameraList:[],
        currentCameraId:'',
        cameraListCommon:new Map(),
        defaultExpanded:[],
      }
    },
    methods:{
      handleGetChildTree: function (boxId:string, resolve:Function) {
        if (!boxId) return;

        this.handleJudgeBoxException(boxId);
        getCameraList({boxId}).then(res=>{
          let onLine:any = [];
          let offLine:any = [];
          res.data.forEach((item:any)=>{
            if (item.enable === 1){
              onLine.push({
                parentId:boxId,
                id:item.cameraId,
                label:item.name,
                leaf: true,
              });
            }else {
              offLine.push({
                parentId:boxId,
                id:item.cameraId,
                label:item.name,
                leaf: true,
              });
            }
          });
          this.cameraListCommon.set(boxId, res.data);
          this.$emit('updateCameraList',res.data);
          this.cameraList = res.data;
          resolve(onLine.concat(offLine));
        }).catch(e=>{
          this.$emit('updateCameraList',[]);
          this.cameraList = [];
          resolve([]);
        });
      },
      handleGetFirstTree: function (resolve:Function, custom?:string) {
        getBoxList({pageSize:40, pageNum:1}).then(res=>{
          let onLine:any=[];
          let offLine:any=[];
          res.data.list.forEach((item:any)=>{
            let {free, trouble, running} = item;
            let data = {
              id:item.boxId,
              name:item.name,
              label:item.name,
              leaf:false,
              type:0
            };

            if(free === 0 && trouble === 0 && running === 1){
              onLine.push(data)
            }else {
              offLine.push(data)
            }
          });

          let list = onLine.concat(offLine);

          if (custom){
            this.treeBoxList = list;
            return;
          }
          resolve(list);

          setTimeout(()=>{
            if (list.length > 0){
              //@ts-ignore
              this.$refs.tree.$children[0].handleExpandIconClick();
            }
          },500)
        }).catch(e=>{
          resolve([]);
        })
      },
      loadTree: function (node:any, resolve:Function, custom?:string) {
        // console.log('loadTree',node);
        if (node.level === 0) {
          this.firstNode = node;
          this.resolveFn = resolve;
          this.handleGetFirstTree(resolve, custom);
        }else {
          this.handleGetChildTree(node.data.id, resolve);
        }
      },
      filterBoxTree: function (boxName:any) {
        //@ts-ignore
        this.$refs.tree.filter(boxName);
      },
      filterNode(value:string, data:any) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      updateFlow: function () {
        if (!this.flowValid) return;

        let data :any = {};
        let handleFn;

        if (this.flowMax === '0'){
          handleFn = deleteFlowAlert;
        }else {
          handleFn = updateFlowAlert;
          data.flowByte = Number(this.flowMax) * 1024 * 1024;    //转成字节传后端
        }

        handleFn(data).then((res:any)=>{
          showMessageAfterRequest(res.data,'设置成功','设置失败');
          this.flowDialog = false;
        })
      },
      checkFlowValid: function (value:string) {
        if (!value){
          //为空时
          this.flowValid = false;
        }else if (value.length >= 2 && value.indexOf('0') === 0){
          //输入0开头的数字
          this.flowValid = false;
        }else if (/^[1-9]\d*$/.test(value) === false && value !== '0'){
          //非大于0的正整数
          this.flowValid = false;
        }else if (value === '0'){
          this.flowValid = true;
        }else {
          this.flowValid = true;
        }
      },
      handleClickTreeNode: function (node:any, data:any) {
        if (node.level === 1) return;
        //点击摄像头时
        let currentIndex = 0;
        this.cameraList.forEach((item:any,index:number)=>{
          if (item.cameraId === data.id) {
            currentIndex = index;
            return;
          }
        })

        //将当前摄像头移动到播放列表第一位
        this.currentCameraId = data.id;
        let currentCamera = this.cameraList.splice(currentIndex,1);
        this.$emit('updateCameraList', currentCamera.concat(this.cameraList));
        this.cameraList = currentCamera.concat(this.cameraList);
      },
      //判断摄像头是否检测出异常行为，异常的话显示红点
      handleJudgeException: function (nodeLevel:number, id:string) {

        let list = this.$props.exceptionList && this.$props.exceptionList.filter((item:any)=>{
          if (!item) return false;
          return nodeLevel === 1 ? item.boxId === id : item.cameraId === id
        })

        return list.length > 0 ? true : false;
      },
      //判断获取摄像头tree时盒子是否为异常状态，异常的话记录boxId
      handleJudgeBoxException: function (boxId:string) {
        let list : string[] = [];
        this.$props.exceptionList.map((item:any)=>{
          if (!item) return ;
          item.boxId === boxId ? list.push(boxId) : '';
        })

        this.$emit('updateReadiedExceptionBoxList', list);
      },
      expandBoxTree: function (data:any, node:any, tree:any) {
        if (this.cameraListCommon.get(data.id)){
          this.$emit('updateCameraList',this.cameraListCommon.get(data.id));
        }
      },
    },
    mounted(): void {

      getDeviceRunningCensus().then(res=>{
        if (!res.data) return
        this.boxCensus = res.data;
      })

      getFlowCensus().then(res=>{
        if (!res.data) return

        Object.keys(res.data).forEach(key=>{
          if (res.data[key]){
            res.data[key] = (res.data[key]/1024/1024).toFixed(0);
          }else {
            res.data[key] = 0;
          }
        })
        this.flowCensus = res.data;
      })

      getFlowAlert().then(res=>{
        if (!res.data) return
        let {preSettingFlowByte} = res.data;
        this.flowMax = preSettingFlowByte && preSettingFlowByte > 0 ? (preSettingFlowByte/1024/1024).toFixed(0) : '0';
      })
    },
  });
</script>

<style scoped lang="less">
  @import 'left.less';
</style>