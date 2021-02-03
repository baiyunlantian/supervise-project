<template>
  <div id="header-container">
    <div class="title">
      <img :src="require('@/assets/vtouch.png')" alt="logo" />
      <div class="text">工程监督智能服务平台</div>
    </div>
    <div class="left">
      <div class="account-balance">
        <div>账户余额：</div>
        <router-link to="/cost-management">{{balance}}</router-link>
      </div>
      <SvgIcon
          color="#fff"
          name="logout"
          @click="clickLogout"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { logout } from '@/request/login';
  import {getFlowAlert} from "@/request";

  export default Vue.extend({
    components:{
      SvgIcon,
    },
    data(){
      return{
        logoUrl:'',
        balance:0,
      }
    },
    methods:{
      clickLogout: function () {
        logout().then(res=>{
          sessionStorage.clear();
          this.$router.push('/login');
        }).catch(e=>{
          sessionStorage.clear();
          this.$router.push('/login');
        })
      }
    },
    mounted(): void {
      this.logoUrl = sessionStorage.getItem('url') || '';

      getFlowAlert().then(res=>{
        if (!res.data) return
        let {flowBalance} = res.data;
        this.balance = flowBalance && flowBalance/100 || 0;
      })
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>