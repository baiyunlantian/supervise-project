<template>
  <div class="left bgcAndShadow">
    <div class="top">
      <div class="fontBlackAndBold">人员组织架构</div>
      <div class="operate-btn">
        <div class="add-group cursor" @click="setStationDialogVisible = true">
          <SvgIcon name="setStation" color="#fff"/>
        </div>
        <div class="add-group cursor" @click="handleClickAddOrUpdateDepart('add')">
          <SvgIcon
              name="addFirstDepart"
              color="#fff"
              width="1.09375rem"
              height="1.09375rem"
          />
        </div>
      </div>
    </div>

    <div class="project-tree hiddenScrollbar">

      <el-tree
          ref="tree"
          :data="customTreeList"
          :props="defaultProps"
          :load="loadTree"
          :expand-on-click-node="false"
          lazy
          node-key="departId"
      >
        <template v-slot="{ node, data }" class="group">
          <div class="custom-tree-node">
            <div class="img">
              <img v-if="data.type === 1" :src="data.url" alt=""/>
              <span v-else-if="data.type === 0 && node.expanded === true">-</span>
              <span v-else-if="data.type === 0 && node.expanded === false">+</span>
            </div>
            <div class="label" :class="{active:node.expanded === true}">
              <span>{{data.label}}</span>
              <div class="operate-btn" v-if="node.expanded === true">
                <SvgIcon name="edit" @click="handleClickAddOrUpdateDepart('edit', data)"/>
                <SvgIcon name="addChildDepart" @click="handleClickAddOrUpdateDepart('add', data)"/>
                <SvgIcon name="delete" @click="setData('department',data, 'deleteDialogVisible', true)"/>
              </div>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <DeleteDialog
        :id="department.departId"
        :visible="deleteDialogVisible"
        @close="setData"
        @triggerDelete="handleDeleteDepart"
        title="删除部门"
        main-text="确认删除部门吗？"
        sub-text="删除后部门内的人员同时被删除，请谨慎操作！"
    />

    <AddOrEditDepartmentDialog
        :department="department"
        :visible="addOrEditDialogVisible"
        :title="addOrEditText === 'add' ? '添加部门' : '修改部门'"
        :ok-text="addOrEditText === 'add' ? '添加' : '修改'"
        @close="setData"
        @submit="addOrUpdateDepart"
    />

    <SetStationDialog
        :visible="setStationDialogVisible"
        @close="setData"
        @updateStation="updateStation"
    />

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import DeleteDialog from './delete-dialog.vue';
  import AddOrEditDepartmentDialog from './add-or-edit-department-dialog.vue';
  import SetStationDialog from "@/pages/person-management/component/set-station-dialog.vue";
  import SvgIcon from '@/components/svgIcon.vue';
  import {
    addDepart,
    updateDepart,
    deleteDepart,
    getDepartmentTreeList,
  } from "@/request/department";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      DeleteDialog,
      AddOrEditDepartmentDialog,
      SetStationDialog,
      SvgIcon,
    },
    data() {
      return {
        defaultProps: {
          children: 'zones',
          label: 'label',
          isLeaf: 'leaf',
          departId:'departId',
          fatherId:'fatherId',
        },
        department:{},
        addOrEditText:'add',
        addOrEditDialogVisible:false,
        deleteDialogVisible:false,
        setStationDialogVisible: false,
        firstNode:'',
        resolveFn:new Function(),
        customTreeList:[],
      }
    },
    methods: {
      handleClickAddOrUpdateDepart: function (type:string, data = {}) {
        this.addOrEditText = type;
        this.department = data;
        this.addOrEditDialogVisible = true;
      },
      handleDeleteDepart: function (id:string) {
        if (!id) return;

        deleteDepart({departId:id}).then(res=>{
          showMessageAfterRequest(res.data, '删除部门成功', '删除部门失败');
          if (res.data === true){
            //@ts-ignore
            this.customRefreshTree(this.department.fatherId);
            this.$emit('initTableAndSelectList');
          }
        })
      },
      handleGetTreeSelectList: async function (resolve:Function, fatherId?:string, type?:string) {
        let data = {
          fatherId:fatherId ? fatherId : sessionStorage.getItem('companyCode'),
        }

        getDepartmentTreeList(data).then(res=>{
          if (!res.data) return;

          const { departList, personList, personNum } = res.data;
          let list : any = [];

          personList.forEach((item:any)=>{
            list.push({
              personId:item.personId,
              name:item.personName,
              label:item.personName,
              url:item.url,
              leaf: true,
              type:1
            });
          });

          departList.forEach((item:any)=>{

            list.push({
              fatherId:item.fatherId,
              departId:item.departId,
              name:item.departName,
              label:`${item.departName}(${personNum[item.departId] || 0}人)`,
              leaf: false,
              type:0
            });
          });

          //操作一级部门
          if (type === 'custom'){
            //@ts-ignore
            this.customTreeList = list;
            return;
          }

          resolve(list);
        }).catch(e=>{
          console.log(e)
          resolve([]);
        })
      },
      loadTree: function (node:any, resolve:Function, type?:string) {
        if (node.level === 0) {
          this.firstNode = node;
          this.resolveFn = resolve;
          this.handleGetTreeSelectList(resolve, undefined, type);
        }else {
          this.handleGetTreeSelectList(resolve, node.data.departId);
        }
      },
      addOrUpdateDepart: function (name:string, id:string, refreshTreeById:string) {
        let data: any = {
          departName:name
        };

        let handleFn: Function;
        let text: string;
        if (this.addOrEditText === 'add') {
          handleFn = addDepart;
          text = '新增';
          data.fatherId = id;
        }else {
          handleFn = updateDepart;
          text = '更新';
          data.departId = id;
        }

        handleFn(data).then((res:any)=>{
          showMessageAfterRequest(res.data, text+'部门成功', text+'部门失败');
          if (res.data === true){
            this.customRefreshTree(refreshTreeById);
            this.$emit('initTableAndSelectList');
          }
        })

      },
      setData: function (key1:string, value1:any, key2:string, value2:any ) {
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      //手动刷新节点树
      customRefreshTree: function (fatherId = sessionStorage.getItem('companyCode')) {
        if (fatherId === sessionStorage.getItem('companyCode')) {
          //操作一级部门
          this.loadTree(this.firstNode, this.resolveFn, 'custom')
        }else {
          //操作二级部门
          //@ts-ignore
          let node = this.$refs.tree.getNode(fatherId);
          node.loaded = false;
          node.expand();
        }
      },
      updateStation: function (list:any, map:any) {
        this.$emit('updateStation', 'stationSelectList', list, 'stationCommonMap', map);
      }
    },
  })
</script>

<style scoped lang="less">
  @import "left.less";
</style>