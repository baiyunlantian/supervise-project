<template>
  <div id="header-container">
    <div class="title">
      <img :src="require('@/assets/vtouch.png')" alt="logo" />
      <div class="text">工程监督智能服务平台</div>
    </div>
    <div class="left">
      <div class="account-balance">
        <div>账户余额：</div>
        <router-link to="/cost-management">{{flowBalance}}</router-link>
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

  export default Vue.extend({
    props:['flowBalance'],
    components:{
      SvgIcon,
    },
    data(){
      return{
        logoUrl:'',
        //@ts-ignore
        balance:this.$global.flowBalance,
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
    }
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>