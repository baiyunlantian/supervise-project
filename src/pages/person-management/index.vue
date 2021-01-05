<template>
  <div id="person-management-container">
    <Left />

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

    <AddOrUpdatePersonDialog :person-info="personInfo" :visible="personDialogVisible" @close="toggleDialog" @initTable="searchTable"/>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchInput from '@/components/search-input/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import NormalPersonList from './component/tableList.vue';
  import AddOrUpdatePersonDialog from './component/add-or-update-person-dialog.vue';
  import SetStationDialog from './component/set-station-dialog.vue';
  import Left from './component/left.vue';

  import { batchImportPerson,} from '@/request/person';

  export default Vue.extend({
    components:{
      SearchForm,
      SearchInput,
      NormalPersonList,
      AddOrUpdatePersonDialog,
      SetStationDialog,
      Left,
    },
    data() {
      return {
        formItemsProp:[
          { key: 'name', label:'姓名', type:'input'},
          { key: 'ipNum', label:'身份证号', type:'input'},
          { key: 'phone', label:'手机号', type:'input'},
          { key: 'code', label:'工号', type:'input'},
        ],
        searchParams:{},
        personDialogVisible:false,
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
      }
    },
    methods: {
      toggleDialog: function (key1:string, value1:any, key2:string, value2:any ) {
        this.$data[key1] = value1;
        this.$data[key2] = value2;
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