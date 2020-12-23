<template>
  <div id="person-management-container">
    <div class="left">
      <div class="top">
        <SearchInput placeholder="搜索部门和人" @search="search"/>
        <div class="add-group">
          <img :src="require('@/assets/person/add-group.png')"/>
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
                  <i class="el-icon-edit" @click="addOrEdit('edit',data)"/>
                  <i class="el-icon-folder-add" @click="addOrEdit('add')"/>
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
            <img :src="require('@/assets/person/adduser.png')"/>
          </div>
        </div>
      </div>

      <NormalPersonList />
    </div>

    <DeleteDialog
        :personId="department"
        :visible="deleteDialogVisible"
        @close="toggleDialog"
        title="删除部门"
        main-text="确认删除部门吗？"
        sub-text="删除后部门内的人员同时被删除，请谨慎操作！"
    />

    <AddOrEditDepartmentDialog
        :department="department"
        :visible="addOrEditDialogVisible"
        @close="toggleDialog"
        :title="addOrEditText === 'add' ? '添加部门' : '修改部门'"
        :ok-text="addOrEditText === 'add' ? '添加' : '修改'"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchInput from '@/components/search-input/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import NormalPersonList from './normal-person.vue';
  import NotActivePersonList from './not-active-person.vue';
  import DeleteDialog from './component/delete-dialog.vue';
  import AddOrEditDepartmentDialog from './component/add-or-edit-department-dialog.vue';


  import {
    getPersonDepartmentList,
    getChildTreeById,
  } from '@/request/project-control';

  export default Vue.extend({
    components:{
      SearchForm,
      SearchInput,
      NormalPersonList,
      NotActivePersonList,
      DeleteDialog,
      AddOrEditDepartmentDialog
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
      operateGroup: function (id:number | string, type:string) {
        console.log(id)
        console.log(type)
      },
      toggleDialog: function (key1:any, value1:any, key2:any, value2:any ) {
        //@ts-ignore
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      addOrEdit: function (type:string, data = {}) {
        this.addOrEditText = type;
        this.department = data;
        this.addOrEditDialogVisible = true;
      }
    },
    mounted(): void {
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>