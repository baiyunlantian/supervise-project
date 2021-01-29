<template>
  <div id="equipment-management-container">
    <div class="top">
      <div
          class="item"
          v-for="(item, index) in censusConfig"
          :key="index"
          :class="item.key"
      >
        <div class="img">
          <SvgIcon
            :name="item.iconName"
            :color="item.color"
            width="1.09375rem"
            height="1.09375rem"
          />
        </div>
        <div class="text">{{item.label}}</div>
        <div class="count">{{census[item.key]}}</div>
      </div>
    </div>

    <SearchForm
        :form-data="searchParams"
        :form-items-prop="formItemsProp"
        @search="search"
    >
      <div class="img">
        <SvgIcon
            name="intoVoicePage"
            color="#fff"
            width="1.09375rem"
            height="1.09375rem"
            @click="jump"
        />
      </div>
    </SearchForm>

    <div class="table-content">
      <div class="title fontBlackAndBold">设备列表</div>

      <Table
          ref="table"
          :table-props="tableProps"
          :expand-row-keys="expandRowKeys"
          @expandChange="expandChange"
      >
        <template v-slot:expandContent="{row}">
          <table class="expand-content">
            <tr
                class="item"
                v-for="(item,index) in cameraList"
                :key="index"
            >
              <td>{{item.name}}</td>
              <td>{{item.ip}}</td>
              <td>{{item.httpPort}}</td>
              <td>{{item.username}}</td>
              <td>{{item.password}}</td>
              <td v-if="item.enable === 1" :style="{color: 'rgb(0, 161, 76)'}">在线</td>
              <td v-else :style="{color: '#565656'}">离线</td>
              <td>{{item.remark}}</td>
            </tr>
          </table>
        </template>

        <template v-slot:status="{row}">
          <span v-if="handleJudgeBoxStatus(row) === '在线'" :style="{color: 'rgb(0, 161, 76)'}">在线</span>
          <span v-else-if="handleJudgeBoxStatus(row) === '离线'" :style="{color: '#565656'}">离线</span>
          <span v-else-if="handleJudgeBoxStatus(row) === '故障'" :style="{color: 'rgb(255, 59, 59)'}">故障</span>
          <span v-else-if="handleJudgeBoxStatus(row) === '闲置'" :style="{color: 'rgb(255, 186, 0)'}">闲置</span>
        </template>

        <template v-slot:operate="{row}">
          <SvgIcon name="edit" @click="handleClickEdit(row)"/>
          <SvgIcon name="delete" @click="handleClickDelete(row.boxId)"/>
        </template>
      </Table>
    </div>

    <Dialog
        :visible="visible"
        :initialValue="dialogData"
        @close="close"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Table from '@/components/table/index.vue';
  import SearchForm from '@/components/search-form/index.vue';
  import Dialog from './dialog.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getEquipmentCensus, deleteEquipment } from "@/request/equipment";
  import { getCameraList } from "@/request/equipment";
  import {showMessageAfterRequest} from "@/utils/common";
  import {BOX, MOCK} from "@/request/type";

  /*
  * 设备状态优先级：free(闲置) > trouble(故障) > running(运行中)
  * 1：优先判断free
  * 2：非闲置，判断trouble
  * 3：非闲置，非故障，running
  * */


  export default Vue.extend({
    components:{
      Table,
      SearchForm,
      Dialog,
      SvgIcon,
    },
    data() {
      return {
        census:{},
        searchParams:{},
        censusConfig:[
          {key:'total',label:'设备总数',iconName:'serviceTotal',color:'rgb(0, 131, 255)'},
          {key:'runningCount',label:'在线设备',iconName:'onLine',color:'rgb(0, 161, 76)'},
          {key:'stoppedCount',label:'离线设备',iconName:'offLine',color:'rgb(131, 131, 131)'},
          {key:'troubleCount',label:'故障设备',iconName:'error',color:'rgb(255, 3, 3)'},
          {key:'freeCount',label:'闲置设备',iconName:'idle',color:'rgb(255, 190, 19)'},
        ],
        formItemsProp:[
          {key:'boxName',label:'设备名称',type:'input'},
          {key:'status',label:'设备状态',type:'select',
            options:[
              {value:0,label:'在线'},
              {value:1,label:'离线'},
              {value:2,label:'故障'},
              {value:3,label:'闲置'},
            ]
          },
        ],
        tableProps:{
          url:`${BOX}/edgebox/boxList`,
          rowKey:'boxId',
          highlight:true,
          pagination:{
            pageSize:10
          },
          firstColumn:{
            show:true,
            type:'expand',
            width:100
          },
          tableColumn:[
            {prop:'name',label:'设备名称'},
            {prop:'ip',label:'IP'},
            {prop:'port',label:'端口'},
            {prop:'username',label:'账号'},
            {prop:'password',label:'密码'},
            {prop:'status',label:'状态',insertHtml:true},
            {prop:'remark',label:'备注'},
            {prop:'operate',label:'操作',insertHtml:true},
          ],
        },
        visible:false,
        dialogData:{},
        cameraList: [],
        expandRowKeys:[],
      }
    },
    methods: {
      search: function (data?:object) {
        //@ts-ignore
        this.initTable(data);
      },
      close: function (operate:string) {
        this.visible = false;

        if (operate === 'refresh'){
          this.initTable();
        }
      },
      handleClickEdit: function (row:object) {
        this.visible = true;
        this.dialogData = row;
      },
      handleClickDelete: function (boxId:number | string) {
        this.$confirm('确定该删除设备吗？')
          .then(res=>{
            deleteEquipment({boxId}).then(res=>{
              showMessageAfterRequest(res.data, '解绑成功', '解绑失败');
              res.data === true ? this.initTable() : '';
            })
          })
          .catch(e=>{
            //cancel
            console.log(e)
          })
      },
      initTable: function (data = {}) {
        let param = JSON.parse(JSON.stringify(data));
        this.cameraList.splice(0);
        this.expandRowKeys.splice(0);

        if (param.hasOwnProperty('status') === true){
          switch (param.status) {
            case 0:
              param.running = 1;
              break;
            case 1:
              param.running = 0;
              break;
            case 2:
              param.trouble = 1;
              break;
            case 3:
              param.free = 1;
              break;
            default:
              param.running = 1;
              break;
          }
          delete param.status;
        }
        //@ts-ignore
        this.$refs.table.initTable(param);
      },
      jump: function () {
        this.$router.push('/equipment-management/set-voice');
      },
      handleJudgeBoxStatus: function (boxData:any):string {
        let status = '';
        let {free, trouble, running } = boxData;

        if (free === 1){
          status = '闲置';
        }else if (free === 0 && trouble === 1){
          status = '故障';
        }else if (free === 0 && trouble === 0 && running === 0){
          status = '离线';
        }else if (free === 0 && trouble === 0 && running === 1){
          status = '在线';
        }

        return status;
      },
      expandChange: function (row:any, expand:any) {
        let {boxId} = row;

        //只能展开一行
        if (expand.length) {
          this.expandRowKeys.splice(0);
          if (row) {
            //@ts-ignore
            this.expandRowKeys.push(row.boxId)
          }
        } else {
          this.expandRowKeys.splice(0);
        }

        getCameraList({boxId}).then(res=>{
          if (res.data && res.data.length > 0) {
            this.cameraList =  res.data;
          }
        })
      },
    },
    mounted(): void {
      getEquipmentCensus().then(res=>{
        if (!res.data) return;
        let total = 0;
        Object.keys(res.data).forEach(key=>{
          total += res.data[key];
        })
        this.census = {total, ...res.data};
      })
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>