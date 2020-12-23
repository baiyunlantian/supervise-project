<template>
  <el-form
      id="search-form-container"
      :model="formData"
      label-position="left"
      inline
  >
    <el-form-item
        v-for="(item, index) in formItemsProp"
        :key="index"
        :label="item.label"
    >
      <GetFormItem :formData="formData" :item="item"/>
    </el-form-item>
    <el-form-item class="search-form-operate">
      <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import Vue from "vue";
  import getFormItem from "@/components/getFormItem.vue";

  export default Vue.extend({
    props:{
      formItemsProp:{
        type: Array,
        required: true,
      },
      formData:{
        type:Object,
        required:true,
      }
    },
    components:{
      'GetFormItem':getFormItem,
    },

    methods:{
      search():void{
        let searchParams = JSON.parse(JSON.stringify(this.$props.formData));

        Object.keys(searchParams).forEach(key=>{
          switch (searchParams[key]) {
            case '':
              delete searchParams[key];
              break;
            case ' ':
              delete searchParams[key];
              break;
            case null:
              delete searchParams[key];
              break;
            case undefined:
              delete searchParams[key];
              break;
            default:
              break;
          }
        });
        this.$emit('search', searchParams);
      },
    },

    mounted(): void {
    }
  })
</script>

<style lang="less">
  @import "index.less";
</style>