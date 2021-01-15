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

    <div class="terminal-container bgcAndShadow">

      <SearchInput placeholder="" @search="filterBoxTree"/>

      <el-tree
          ref="tree"
          :props="defaultProps"
          :load="loadTree"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          lazy
          accordion
          node-key="boxId"
      >
        <template v-slot="{ node, data }" class="group">
          <div class="custom-tree-node">
            <div class="img">
              <span v-if="node.expanded === true || data.hasOwnProperty('parentId')">-</span>
              <span v-else-if="node.expanded === false">+</span>
            </div>
            <div class="label" :class="{active:node.expanded === true}">
              <span>{{data.label}}</span>
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
    >

      <div class="content">
        <div class="form-item">
          <div class="label">流量使用提醒：</div>
          <el-input type="number" v-model="flowMax"/>
        </div>
        <div class="sub">(不做使用上限提醒时请输入0，单位：M)</div>
      </div>

      <template slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
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
  import { getFlowCensus } from '@/request/index';

  export default Vue.extend({
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
        firstNode:'',
        resolveFn:new Function(),
        customTreeList:[],
      }
    },
    methods:{
      handleGetChildTree: function (boxId:string | number, resolve:Function) {
        if (!boxId) return;
        getCameraList({boxId}).then(res=>{
          let list = res.data.map((item:any)=>{
            return{
              parentId:boxId,
              id:item.cameraId,
              label:item.name,
              leaf: true,
            }
          });
          resolve(list);
        }).catch(e=>{
          resolve([]);
        });
      },
      handleGetFirstTree: function (resolve:Function) {
        getBoxList({pageSize:40, pageNum:1}).then(res=>{
          let list = res.data.list.map((item:any)=>{
            return {
              id:item.boxId,
              name:item.name,
              label:item.name,
              leaf:false,
              type:0
            };
          });
          resolve(list);
        }).catch(e=>{
          resolve([]);
        })
      },
      loadTree: function (node:any, resolve:Function) {
        // console.log('loadTree',node);
        if (node.level === 0) {
          this.firstNode = node;
          this.resolveFn = resolve;
          this.handleGetFirstTree(resolve);
        }else {
          this.handleGetChildTree(node.data.id, resolve);
        }
      },
      save: function () {
        console.log(this.flowMax);
        this.flowDialog = false;
      },
      filterBoxTree: function (boxName:any) {
        console.log(boxName)
        //@ts-ignore
        this.$refs.tree.filter(boxName);
      },
      filterNode(value:string, data:any) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    mounted(): void {
      /*
      getDeviceRunningCensus().then(res=>{
        if (!res.data) return
        this.boxCensus = res.data;
      })

      getFlowCensus().then(res=>{
        if (!res.data) return

        Object.keys(res.data).forEach(key=>{
          if (res.data[key]){
            res.data[key] = (res.data[key]/1024).toFixed(0);
          }else {
            res.data[key] = 0;
          }
        })
        this.flowCensus = res.data;
      })
      */
    },
  });
</script>

<style scoped lang="less">
  @import 'left.less';
</style>