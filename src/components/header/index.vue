<template>
  <div id="header-container">
    <div>工程监督智能服务平台</div>
    <SvgIcon
      color="#fff"
      name="logout"
      @click="logout"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';

  export default Vue.extend({
    components:{
      SvgIcon,
    },
    methods:{
      logout: function () {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>