<template>
  <div class="search-input-container">
    <el-input v-model="value" :placeholder="placeholder || '搜索'" v-on:keyup.enter.native="search"/>
    <i class="el-icon-search" @click="search"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['placeholder'],
    data(){
      return{
        value:''
      }
    },
    methods: {
      search: function () {
        this.$emit('search', this.value);
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>