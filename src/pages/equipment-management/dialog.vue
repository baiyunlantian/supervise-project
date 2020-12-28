<template>
  <el-dialog
    title="修改设备信息"
    width="500px"
    :visible="visible"
    custom-class="edit-dialog-container"
    :show-close="false"
  >
    <Form
        :form-data="data"
        :form-props="formProps"
    />

    <template v-slot:footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Form from '@/components/form/index.vue';

  export default Vue.extend({
    props:['visible','initialValue'],
    components:{
      Form,
    },
    data() {
      return {
        formProps: {
          items:[
            {key:'name',label:'设备名称',type:'input'},
            {key:'ip',label:'IP',type:'input',},
            {key:'port',label:'端口',type:'input'},
            {key:'account',label:'账号',type:'input'},
            {key:'password',label:'密码',type:'input',},
            {key:'status',label:'状态',type:'select',
              options:[
                {value:0,label:'在线'},
                {value:1,label:'离线'},
                {value:2,label:'故障'},
                {value:3,label:'闲置'},
              ]
            },
            {key:'remark',label:'备注',type:'input'},
          ],
          rules:{
            name:[{ required: true, message: '请输入设备名称', trigger: 'blur'},],
            ip:[{ required: true, message: '请输入IP', trigger: 'blur'},],
            port:[{ required: true, message: '请输入端口号', trigger: 'blur'},],
            account:[{ required: true, message: '请输入账号', trigger: 'blur'},],
            password:[{ required: true, message: '请输入密码', trigger: 'blur'},],
            status:[{ required: true, message: '请选择设备状态', trigger: 'blur'},],
          },
          hiddenFooter:true,
        },
        data:{},
      }
    },
    methods: {
      close: function (operate = '') {
        console.log('close');
        this.$emit('close',operate);
      },
      submit: function () {
        console.log(this.data);
        this.close('refresh');
      }
    },
    watch:{
      initialValue:{
        handler: function (newVal:object, oldVal:object) {
          this.data = JSON.parse(JSON.stringify(newVal));
        },
        deep:true
      },
    },
  })
</script>

<style scoped lang="less">
  @import "dialog.less";
</style>