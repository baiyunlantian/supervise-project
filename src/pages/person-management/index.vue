<template>
  <div id="person-management-container">
    <div class="left">
      <div class="top">
        <div class="fontBlackAndBold">人员组织架构</div>
        <div class="operate-btn">
          <div class="add-group cursor" @click="setStationDialogVisible = true">
            <img :src="require('@/assets/person/set-station.png')"/>
          </div>
          <div class="add-group cursor" @click="handleAddOrUpdateDepart('add')">
            <img :src="require('@/assets/person/add-group.png')"/>
          </div>
        </div>
      </div>

      <div class="project-tree">

        <el-tree
            ref="tree"
            :props="defaultProps"
            :load="loadTree"
            :expand-on-click-node="false"
            lazy
            node-key="id"
        >
          <template v-slot="{ node, data }" class="group">
            <div class="custom-tree-node">
              <div class="img">
                <img v-if="data.type === 1" :src="require('@/assets/mission-person.jpg')" alt=""/>
                <span v-else-if="data.type === 0 && node.expanded === true">-</span>
                <span v-else-if="data.type === 0 && node.expanded === false">+</span>
              </div>
              <div class="label" :class="{active:node.expanded === true}">
                <span>{{data.label}}</span>
                <div class="operate-btn" v-if="node.expanded === true">
                  <i class="el-icon-edit" @click="handleAddOrUpdateDepart('edit',data)"/>
                  <i class="el-icon-folder-add" @click="handleAddOrUpdateDepart('add')"/>
                  <i class="el-icon-delete" @click="toggleDialog('department',data, 'deleteDialogVisible', true)"/>
                </div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <div class="right">
      <div class="top">
        <SearchForm
            :form-items-prop="formItemsProp"
            :form-data="searchParams"
        />
        <div class="operate-btn">
          <div>
            <img :src="require('@/assets/person/batch-import.png')"/>
          </div>
          <div>
            <img :src="require('@/assets/person/adduser.png')" @click="toggleDialog('personInfo',{}, 'personDialogVisible', true)"/>
          </div>
        </div>
      </div>

      <NormalPersonList @toggleDialog="toggleDialog"/>
    </div>

    <DeleteDialog
        :id="department.id"
        :visible="deleteDialogVisible"
        @close="toggleDialog"
        title="删除部门"
        main-text="确认删除部门吗？"
        sub-text="删除后部门内的人员同时被删除，请谨慎操作！"
    />

    <AddOrEditDepartmentDialog
        :department="department"
        :visible="addOrEditDialogVisible"
        :title="addOrEditText === 'add' ? '添加部门' : '修改部门'"
        :ok-text="addOrEditText === 'add' ? '添加' : '修改'"
        @close="toggleDialog"
        @submit="addOrUpdateDepart"
    />

    <AddOrUpdatePersonDialog :person-info="personInfo" :visible="personDialogVisible" @close="toggleDialog" />

    <SetStationDialog :visible="setStationDialogVisible" @close="toggleDialog"/>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchInput from '@/components/search-input/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import NormalPersonList from './normal-person.vue';
  import DeleteDialog from './component/delete-dialog.vue';
  import AddOrEditDepartmentDialog from './component/add-or-edit-department-dialog.vue';
  import AddOrUpdatePersonDialog from './component/add-or-update-person-dialog.vue';
  import SetStationDialog from './component/set-station-dialog.vue';


  import {
    getPersonDepartmentList,
    getChildTreeById,
  } from '@/request/project-control';

  export default Vue.extend({
    components:{
      SearchForm,
      SearchInput,
      NormalPersonList,
      DeleteDialog,
      AddOrEditDepartmentDialog,
      AddOrUpdatePersonDialog,
      SetStationDialog,
    },
    data() {
      return {
        defaultProps: {
          children: 'zones',
          label: 'label',
          isLeaf: 'leaf',
          id:'id',
          parentId:'parentId',
        },
        formItemsProp:[
          { key: 'name', label:'姓名', type:'input'},
          { key: 'ipCard', label:'身份证号', type:'input'},
          { key: 'phone', label:'手机号', type:'input'},
          { key: 'code', label:'工号', type:'input'},
        ],
        searchParams:{},
        deleteDialogVisible:false,
        department:{},
        addOrEditText:'add',
        addOrEditDialogVisible:false,
        personDialogVisible:false,
        setStationDialogVisible: false,
        personInfo:{},
      }
    },
    methods: {
      search: function (value:string) {
        console.log(value);
      },
      handleGetChildTree: function (id:string | number, resolve:Function) {
        if (!id) return;
        getChildTreeById({id}).then(res=>{
          let list = res.data.list.map((item:any)=>{
            return{
              id:item.id,
              type:item.type,
              name:item.name,
              label:item.type === 0 ? `${item.name}（${item.personCount}人）` : item.name,
              leaf: item.type === 0 ? false : true,
            }
          });
          resolve(list);
        }).catch(e=>{
          resolve([]);
        });
      },
      handleGetFirstTree: function (resolve:Function) {
        getPersonDepartmentList().then(res=>{
          let list = res.data.list.map((item:any)=>{
            return {
              id:item.id,
              name:item.name,
              label:`${item.name}（${item.personCount}人）`,
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
      toggleDialog: function (key1:any, value1:any, key2:any, value2:any ) {
        //@ts-ignore
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      handleAddOrUpdateDepart: function (type:string, data = {}) {
        this.addOrEditText = type;
        this.department = data;
        this.addOrEditDialogVisible = true;
      },
      addOrUpdateDepart: function (name:string, id:string) {
        console.log(name)
        console.log(id)
        this.addOrEditDialogVisible = false;
      },
    },
    mounted(): void {
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>