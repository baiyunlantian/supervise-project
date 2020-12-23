<template>
  <el-button @click="goBack">{{text || '返回'}}</el-button>
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

</style>