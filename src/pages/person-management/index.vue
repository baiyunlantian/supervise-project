<template>
  <div id="person-management-container">
    <div class="left">
      <div class="top">
        <div class="fontBlackAndBold">人员组织架构</div>
        <div class="operate-btn">
          <div class="add-group cursor" @click="setStationDialogVisible = true">
            <img :src="require('@/assets/person/set-station.png')"/>
          </div>
          <div class="add-group cursor" @click="handleClickAddOrUpdateDepart('add')">
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
            node-key="departId"
        >
          <template v-slot="{ node, data }" class="group">
            <div class="custom-tree-node">
              <div class="img">
                <img v-if="data.type === 1" :src="data.url || require('@/assets/mission-person.jpg')" alt=""/>
                <span v-else-if="data.type === 0 && node.expanded === true">-</span>
                <span v-else-if="data.type === 0 && node.expanded === false">+</span>
              </div>
              <div class="label" :class="{active:node.expanded === true}">
                <span>{{data.label}}</span>
                <div class="operate-btn" v-if="node.expanded === true">
                  <i class="el-icon-edit" @click="handleClickAddOrUpdateDepart('edit',data)"/>
                  <i class="el-icon-folder-add" @click="handleClickAddOrUpdateDepart('add', data)"/>
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
            @search="searchTable"
        />
        <div class="operate-btn">
          <div>
            <el-upload
                class="upload-demo"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :show-file-list="false"
                @on-success="batchImportSuccess"
                @on-error="batchImportError"
                :limit="1"
                :name="batchImportOptions.name"
                :action="batchImportOptions.action"
                :data="batchImportOptions.data"
                :headers="batchImportOptions.headers"
            >
              <img :src="require('@/assets/person/batch-import.png')" />
            </el-upload>
          </div>
          <div>
            <img :src="require('@/assets/person/adduser.png')" @click="toggleDialog('personInfo',{}, 'personDialogVisible', true)"/>
          </div>
        </div>
      </div>

      <NormalPersonList @toggleDialog="toggleDialog" :searchParams="searchParams" ref="childTable"/>
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

    <AddOrUpdatePersonDialog :person-info="personInfo" :visible="personDialogVisible" @close="toggleDialog" @initTable="searchTable"/>

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

  import { batchImportPerson,} from '@/request/person';
  import {
    getDepartmentTreeList,
    updateDepart,
    addDepart,
  } from "@/request/department";

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
          departId:'departId',
          fatherId:'fatherId',
        },
        formItemsProp:[
          { key: 'name', label:'姓名', type:'input'},
          { key: 'ipNum', label:'身份证号', type:'input'},
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
        batchImportOptions:{
          action:"/mock/person/personBatchInsert",
          name:'file',
          data:{
            companyCode:'1',
          },
          headers: {
            token: sessionStorage.getItem('token'),
          },
        },
        currentNode:'',
      }
    },
    methods: {
      handleGetTreeSelectList: function (resolve:Function, fatherId?:string) {
        console.log('handleGetTreeSelectList',fatherId);
        let data = {
          fatherId:fatherId ? fatherId : sessionStorage.getItem('companyCode') || '123456',
        }

        getDepartmentTreeList(data).then(res=>{
          if (!res.data) return;
          console.log(res.data);

          const { departList, personList } = res.data;
          let list : any = [];

          departList.forEach((item:any)=>{
            list.push({
              fatherId:item.fatherId,
              departId:item.departId,
              name:item.departName,
              label:`${item.departName}（${item.num}人）`,
              leaf: false,
              type:0
            });
          });

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

          resolve(list);
        }).catch(e=>{
          resolve([]);
        })
      },
      loadTree: function (node:any, resolve:Function) {
        console.log('loadTree',node);
        //@ts-ignore
        this.node = node;
        if (node.level === 0) {
          this.handleGetTreeSelectList(resolve);
        }else {
          this.handleGetTreeSelectList(resolve, node.data.fatherId);
        }
      },
      toggleDialog: function (key1:string, value1:any, key2:string, value2:any ) {
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      handleClickAddOrUpdateDepart: function (type:string, data = {}) {
        this.addOrEditText = type;
        this.department = data;
        this.addOrEditDialogVisible = true;
      },
      addOrUpdateDepart: function (name:string, id:string) {
        console.log(id);
        let data: any = {
          departName:name
        };

        let handleFn: Function;
        let text: string;
        if (this.addOrEditText === 'add') {
          handleFn = addDepart;
          text = '新增';
          //@ts-ignore
          data.fatherId = id;
        }else {
          handleFn = updateDepart;
          text = '更新';
          //@ts-ignore
          data.departId = id;
        }

        handleFn(data).then((res:any)=>{
          if (res.data){
            this.$message({
              type:'success',
              message:text+'部门成功'
            });
            this.$emit('initTable');
          }else {
            this.$message({
              type:'error',
              message:text+'部门失败'
            });
          }
        })

        console.log('this.currentNode',this.currentNode)
        //@ts-ignore
        let node = this.$refs.tree.getNode(this.department);
        console.log(node);
        node.loaded = false;
        node.expand();
        //@ts-ignore
        this.addOrEditDialogVisible = false;
      },
      searchTable: function (data?:object) {
        //@ts-ignore
        this.$refs.childTable.initTable({...data, ...this.searchParams,});
      },
      batchImportSuccess: function (res:any) {
        /*
         * failList: list[String]  失败列表
         * successNum: Number  成功数量
         * **/
        let data = res.data;
        if(data.code == 200) {
          this.$message({
            type: 'success',
            message: '导入成功!'
          });
          this.searchTable();
        }
      },
      batchImportError: function () {
        this.$message({
          type: 'error',
          message: '导入失败!'
        });
      }
    },
    mounted(): void {
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>