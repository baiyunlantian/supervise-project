<template>
  <div id="person-management-container">
    <Left
        @updateDepart="initDepart"
        @updateStation="setData"
    />

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
              <SvgIcon name="batchImport" color="#fff"/>
            </el-upload>
          </div>
          <div>
            <SvgIcon
                name="addPerson"
                color="#fff"
                width="1.09375rem"
                height="1.09375rem"
                @click="setData('personInfo',{}, 'personDialogVisible', true)"
            />
          </div>
        </div>
      </div>

      <NormalPersonList
          ref="childTable"
          @toggleDialog="setData"
          @initTableAndTree="initTableAndTree"
          :searchParams="searchParams"
          :depart-common-map="departCommonMap"
          :station-common-map="stationCommonMap"
      />
    </div>

    <AddOrUpdatePersonDialog
        :person-info="personInfo"
        :visible="personDialogVisible"
        :depart-select-list="departSelectList"
        :station-select-list="stationSelectList"
        @close="setData"
        @initTableAndTree="initTableAndTree"
    />

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SearchInput from '@/components/search-input/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import NormalPersonList from './component/tableList.vue';
  import AddOrUpdatePersonDialog from './component/add-or-update-person-dialog.vue';
  import SetStationDialog from './component/set-station-dialog.vue';
  import Left from './component/left.vue';
  import { PERSON } from "@/request/type";
  import { getDepartSelectList } from '@/request/department';

  import { batchImportPerson,} from '@/request/person';

  export default Vue.extend({
    components:{
      SearchForm,
      SearchInput,
      NormalPersonList,
      AddOrUpdatePersonDialog,
      SetStationDialog,
      Left,
      SvgIcon,
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
          action:`${PERSON}/person/personBatchInsert`,
          name:'file',
          data:{
            companyCode:sessionStorage.getItem('companyCode'),
          },
          headers: {
            token: sessionStorage.getItem('token'),
          },
        },
        departSelectList:[],
        departCommonMap:new Map(),
        stationSelectList:[],
        stationCommonMap:new Map(),
      }
    },
    methods: {
      setData: function (key1:string, value1:any, key2:string, value2:any ) {
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
      },
      initTableAndTree: function () {
        this.searchTable();
        this.initTree();
      },
      initTree: function () {
        //@ts-ignore
        this.$refs.left.customRefreshTree();
      },
      initDepart: function () {
        getDepartSelectList().then((res:any)=>{
          if (!res.data) return;
          let map = new Map();

          res.data.list.forEach((item:any)=>{
            map.set(item.departId, item.departName);
          })
          this.departSelectList = res.data.list || [];
          this.departCommonMap = map;
        })
      }
    },
    mounted(): void {
      this.initDepart();
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>