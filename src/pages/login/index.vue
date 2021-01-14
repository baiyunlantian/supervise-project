<template>
  <div class="login-container">
    <div class="content">

      <el-form
          ref="form"
          class="form-container"
          :model="loginData"
          :rules="rules"
          show-message
          :inline-message="false"
          hide-required-asterisk
      >
        <el-form-item label="" prop="username">
          <el-input
              v-model="loginData.username"
              type="text"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user-solid"
          />
        </el-form-item>

        <el-form-item label="" prop="password">
          <el-input
              v-model="loginData.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onOk" :disabled="disabled" :loading="disabled">登录</el-button>
        </el-form-item>
      </el-form>
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
        rules:{
          username:[
            { required: true, message: '请输入账号', trigger: 'blur'},
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur'},
          ],
        },
        loginData:{
          username:'',
          password:''
        },
        disabled:false,
      }
    },
    methods:{
      onOk: function() {
        //@ts-ignore
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.disabled = true;
            login(this.loginData).then((res:any)=>{
              this.disabled = false;
              if (!res.data) return;
              const {companyCode, url, uuid, token} = res.data;
              sessionStorage.setItem('token',token);
              sessionStorage.setItem('url',url);
              sessionStorage.setItem('companyCode',companyCode);
              sessionStorage.setItem('uuid',uuid);
              this.$router.push('/');
            }).catch(e=>{
              this.disabled = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    beforeRouteLeave (to, from, next) {
      const token = window.sessionStorage.getItem('token');
      if (token === null || token == undefined || token === '' || token === 'null' || token === 'undefined' || token === '') {
        next(false);
      } else {
        next();
      }
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>