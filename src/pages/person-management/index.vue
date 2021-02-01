<template>
  <div id="person-management-container">
    <Left
        ref="left"
        @initTableAndSelectList="initTableAndSelectList"
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
          <div><SvgIcon name="batchImport" color="#fff" @click="toggleBatchImportPersonVisible(true)"/></div>
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
          @initTableAndSelectListAndTree="initTableAndSelectListAndTree"
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
        @initTableAndSelectListAndTree="initTableAndSelectListAndTree"
    />

    <BatchImportDialog
      :depart-select-list="departSelectList"
      :batch-import-person-visible="batchImportPersonVisible"
      @close="toggleBatchImportPersonVisible"
      @initTableAndSelectListAndTree="initTableAndSelectListAndTree"
      @toggleFailVisible="toggleFailVisible"
    />

    <el-dialog
        title="导入失败人员提示"
        :visible.sync="failVisible"
        custom-class="fail-dialog-container"
        width="500px"
    >
      <div
          v-for="(item, index) in failList"
          :key="index"
          class="error-text"
      >
        {{index+1}}：{{item}}
      </div>
    </el-dialog>
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
  import BatchImportDialog from './component/batch-import-dialog.vue';
  import Left from './component/left.vue';
  import { getDepartSelectList } from '@/request/common';

  export default Vue.extend({
    components:{
      SearchForm,
      SearchInput,
      NormalPersonList,
      AddOrUpdatePersonDialog,
      SetStationDialog,
      Left,
      SvgIcon,
      BatchImportDialog,
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
        departSelectList:[],
        departCommonMap:new Map(),
        stationSelectList:[],
        stationCommonMap:new Map(),
        batchImportPersonVisible:false,
        failList:[],
        failVisible:false,
      }
    },
    methods: {
      setData: function (key1:string, value1:any, key2:string, value2:any ) {
        this.$data[key1] = value1;
        this.$data[key2] = value2;
      },
      searchTable: function (data?:object) {
        //@ts-ignore
        this.$refs.childTable.loadTable(data);
      },
      initTableAndSelectList: function () {
        this.searchTable();
        this.initDepartSelectList();
      },
      initTableAndSelectListAndTree: function() {
        this.initTableAndSelectList();
        this.initTree();
      },
      initTree: function () {
        //@ts-ignore
        this.$refs.left.customRefreshTree();
      },
      initDepartSelectList: function () {

        getDepartSelectList().then((res:any)=>{
          if (!res.data) return;
          let map = new Map();
          let list : any = [];

          res.data.list.forEach((item:any)=>{
            list.push({value:item.departId, label:item.departName})
            map.set(item.departId, item.departName);
          })

          this.departSelectList = list;
          this.departCommonMap = map;
        })

      },
      toggleBatchImportPersonVisible: function (visible = false) {
        this.batchImportPersonVisible = visible;
      },
      toggleFailVisible: function (visible:boolean, list = []) {
        this.failVisible = visible;
        this.failList = list;
      }
    },
    mounted(): void {
      this.initDepartSelectList();
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>