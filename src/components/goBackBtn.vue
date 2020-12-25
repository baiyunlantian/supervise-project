<template>
  <el-button @click="goBack" type="primary" class="go-back-btn">{{text || '返回'}}</el-button>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['text'],
    data() {
      return {}
    },
    methods: {
      goBack: function () {
        this.$router.back();
      }
    },
  })
</script>

<style scoped lang="less">
  .go-back-btn{
    height: 35px;
    line-height: 35px;
    padding: 0 !important;
    font-size: 18px !important;
  }
</style>