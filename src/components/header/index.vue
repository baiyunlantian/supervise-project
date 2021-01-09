<template>
  <div id="header-container">
    <div class="title">
      <img :src="logoUrl || require('@/assets/vtouch.png')" alt="logo" />
      <div class="text">工程监督智能服务平台</div>
    </div>
    <SvgIcon
      color="#fff"
      name="logout"
      @click="clickLogout"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { logout } from '@/request/login';

  export default Vue.extend({
    components:{
      SvgIcon,
    },
    data(){
      return{
        logoUrl:'',
      }
    },
    methods:{
      clickLogout: function () {
        logout().then(res=>{})
        sessionStorage.clear();
        this.$router.push('/login');
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