<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="video-dialog"
      width="800px"
  >

  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    data() {
      return {}
    },
    methods: {},
  })
</script>

<style scoped lang="less">
  @import "video-dialog.less";
</style>