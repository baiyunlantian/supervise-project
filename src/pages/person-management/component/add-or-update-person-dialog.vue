<template>
  <el-dialog
      :title="formData.id ? '修改人员' : '添加人员'"
      :visible="visible"
      :show-close="false"
      custom-class="add-or-update-person-dialog-container"
      width="600px"
  >
    <div class="body">
      <div class="upload-container">
        <div class="img-container">
          <img v-if="personInfo.url || imgUrl" :src="personInfo.url || imgUrl" alt=""/>
          <img class="master" v-else :src="require('@/assets/personMaster.png')" alt=""/>
        </div>
        <el-upload
            action="#"
            class="custom-upload-container"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="getFile"
        >
          <span>*上传图片</span>
        </el-upload>
        <div class="upload-des">（请上传正面人脸照片）</div>
      </div>

      <Form
          :form-data="formData"
          :form-props="formProps"
          ref="form"
      />
      <div class="remark-item">
        <div class="label">备注</div>
        <el-input v-model="formData.remark" @input="value=>checkRemarkLength(value)"/>
        <div class="tip" v-show="!remarkValid">最大长度不能超过30个字</div>
      </div>

    </div>

    <template slot="footer">
      <el-button type="primary" @click="submit">{{formData.id ? '修改' : '添加'}}</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Form from '@/components/form/index.vue';
  import { addPerson, updatePerson } from '@/request/person';
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    props:['visible','personInfo', 'stationSelectList', 'departSelectList'],
    components:{
      Form,
    },
    data() {
      return {
        formProps:{
          items:[
            {key:'name',label:'姓名',type:'input'},
            {key:'sex',label:'性别',type:'radio',
              options:[
                {value:1,label:'男'},
                {value:0,label:'女'},
              ]
            },
            {key:'ipNum',label:'身份证号',type:'input'},
            {key:'phone',label:'手机号',type:'input'},
            {key:'departId',label:'部门',type:'select', options:[]},
            {key:'station',label:'岗位',type:'select', options:[]},
            {key:'code',label:'工号',type:'input'},
          ],
          rules:{
            name:[{ min: 1, max: 10,message: '最大长度为10个字',trigger: 'blur'},],
            ipNum:[{ min: 16, max: 18, message: '请输入16-18位的身份证号', trigger: 'blur' }],
            phone:[
              { required: true, message: '请输入手机号', trigger: 'blur'},
              { min: 11, max: 11,message: '请输入11位数的手机号',trigger: 'blur'}
            ],
            departId:[{ required: true, message: '请选择部门', trigger: 'blur'},],
            code:{ max: 12,message: '最大长度为12个字',trigger: 'blur'}
          },
          hiddenFooter:true,
          inlineMessage:false,
          showMessage:true,
        },
        formData:{
          remark:''
        },
        imgUrl:'',
        imgFile:'',
        remarkValid:true,
      }
    },
    methods: {
      close: function () {
        this.imgUrl = '';
        this.imgFile = '';
        this.$emit('close','personDialogVisible', false, 'personInfo',{})
      },
      submit: function() {
        if (!this.remarkValid) return;
        //@ts-ignore
        this.$refs.form.validate((valid) => {
          let formData = new FormData();
          formData.append('companyCode',sessionStorage.getItem('companyCode') || '');

          Object.keys(this.formData).forEach(key=>{
            //@ts-ignore
            if (this.formData[key] || this.formData[key] == 0){
              //@ts-ignore    如果手机号码没有修改，不需要穿给后台
              if (key === 'phone' && this.$props.personInfo.phone === this.formData.phone) return;
              //@ts-ignore
              formData.append(key,this.formData[key]);
            }
          })

          if (this.imgFile){
            formData.append('file',this.imgFile);
          }

          let handleFn : Function = addPerson;
          let text : string = '新增';

          if (this.$props.personInfo.personId) {
            handleFn = updatePerson;
            text = '更新';
          }

          handleFn(formData).then((res:any)=>{
            showMessageAfterRequest(res.data, text+'人员成功', res.msg || text+'人员失败');
            res.data === true ? this.$emit('initTableAndSelectListAndTree') : '';
            this.close();
          })
        });
      },
      getFile: function (file:any, fileList:any) {
        this.imgFile = file.raw;
        this.getBase64(file.raw).then((base64:any) => {
          this.imgUrl = base64;
        });
      },
      getBase64 : function(file:any) {
        return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          let imgResult:any;
          reader.readAsDataURL(file);
          reader.onload = function() {
            imgResult = reader.result;
          };
          reader.onerror = function(error) {
            reject(error);
          };
          reader.onloadend = function() {
            resolve(imgResult);
          };
        });
      },
      checkRemarkLength: function (value:string) {
        if (value && value.length > 30){
          this.remarkValid = false;
        }else {
          this.remarkValid = true;
        }
      }
    },
    watch:{
      personInfo:{
        handler: function (newVal, oldVal) {
          this.formData = JSON.parse(JSON.stringify(newVal));
        },
        deep:true,
      },
      stationSelectList: {
        handler: function (newVal, oldVal) {
          //@ts-ignore
          let items = JSON.parse(JSON.stringify(this.formProps.items));

          items.forEach((item:any)=>{
            if (item.key === 'station'){
              item.options = newVal;
            }
          })

          this.$set(this.formProps, 'items', items);
        },
        deep:true,
      },
      departSelectList: {
        handler: function (newVal, oldVal) {
          //@ts-ignore
          let items = JSON.parse(JSON.stringify(this.formProps.items));

          items.forEach((item:any)=>{
            if (item.key === 'departId'){
              item.options = newVal;
            }
          })

          this.$set(this.formProps, 'items', items);
        },
        deep:true,
      },
    },
  })
</script>

<style scoped lang="less">
  @import "add-or-update-person-dialog.less";
</style>