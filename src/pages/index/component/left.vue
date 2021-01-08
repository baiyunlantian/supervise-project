<template>
  <div id="left-container">
    <div class="top bgcAndShadow">
      <div class="item">
        <div>
          <div class="text">当前在线设备</div>
          <div class="count" style="color: rgb(0, 131, 255)">{{flowCensus.onLine || 0}}</div>
        </div>
        <div>
          <div class="text">今日已开始任务</div>
          <div class="count" style="color: rgb(4, 178, 82)">{{flowCensus.mission || 0}}</div>
        </div>
      </div>
      <div class="item">
        <div>
          <div class="text">今日已用流量</div>
          <div class="count" style="color: rgb(237, 56, 81)">{{flowCensus.todayFlow || 0}}M</div>
        </div>
        <div>
          <div class="text">共用流量</div>
          <div class="count" style="color: rgb(152, 70, 209)">{{flowCensus.totalFlow || 0}}M</div>
        </div>
      </div>
      <SvgIcon name="setFlow" @click="flowDialog = true"/>
    </div>

    <div class="terminal-container bgcAndShadow">

      <SearchInput placeholder=""/>

      <el-tree
          ref="tree"
          :props="defaultProps"
          :load="loadTree"
          :expand-on-click-node="false"
          lazy
          accordion
          node-key="id"
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
  import { getFlowCensus } from "@/request";
  import {
    getTerminalTree,
    getTerminalChildTree,
  } from '@/request';

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
        flowCensus:{
          onLine:0,
          mission:0,
          totalFlow:0,
          todayFlow:0,
        },
        warningCensus:{},
        flowDialog:false,
        flowMax:'',
      }
    },
    methods:{
      handleGetChildTree: function (id:string | number, resolve:Function) {
        if (!id) return;
        getTerminalChildTree({id}).then(res=>{
          let list = res.data.list.map((item:any)=>{
            return{
              parentId:id,
              id:item.id,
              type:item.type,
              label:item.name,
              leaf: item.type === 0 ? false : true,
            }
          });
          resolve(list);
        }).catch(e=>{
          resolve([]);
        });
      },
      handleGetFirstTree: function (resolve:Function) {
        getTerminalTree().then(res=>{
          let list = res.data.list.map((item:any)=>{
            return {
              id:item.id,
              name:item.name,
              label:item.name,
              leaf: item.personCount > 0 ? false : true,
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
          this.handleGetFirstTree(resolve);
        }else {
          this.handleGetChildTree(node.data.id, resolve);
        }
      },
      save: function () {
        console.log(this.flowMax);
        this.flowDialog = false;
      }
    },
    mounted(): void {
      getFlowCensus().then(res=>{
        if (!res.data) return
        this.flowCensus = res.data;
      })
    },
  });
</script>

<style scoped lang="less">
  @import 'left.less';
</style>