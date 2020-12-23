<template>
  <div class="login-container">
    <div class="login-content">
      <h2 class="title">施工全过程监管平台</h2>
      <Form
          :form-props="formProps"
          :form-data="loginData"
          ref="childForm"
          onOkText="登录"
          @onOk="onOk"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import router from '@/router'
  import Form from '@/components/form/index.vue';
  import {login} from "@/request/login";


  export default Vue.extend({
    components:{
      Form,
    },
    data(){
      return{
        formProps:{
          items:[
            { key: 'username', label: '账号', type: 'input',},
            { key: 'password', label: '密码', type: 'input', showPassword: true},
          ],
          rules:{
            username:[
              { required: true, message: '请输入账号', trigger: 'blur'},
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur'},
            ],
          },
          onOkText:'登录',
          hideRequiredAsterisk:true,
        },
        loginData:{},
      }
    },
    methods:{
      doLogin: function (data:any) {
        login(data).then((res:any)=>{
          if (!res.data || !res.data.token) return;
          sessionStorage.setItem('token',res.data.token);
          this.$router.push('/');
        });
      },
      onOk: function (value:any) {
        // @ts-ignore
        this.$refs['childForm'].$refs['form'].validate((valid:boolean)=>{
          if (valid) {
            this.doLogin(value);
          } else {
            return false;
          }
        });
      }
    },
    beforeRouteEnter (to, from, next) {
      window.sessionStorage.removeItem('token');
      next();
    },
    // beforeRouteLeave (to, from, next) {
    //   const token = window.sessionStorage.getItem('token');
    //   if (token === null || token == undefined || token === '' || token === 'null' || token === 'undefined' || token === '') {
    //     next(false);
    //   } else {
    //     next();
    //   }
    // }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>