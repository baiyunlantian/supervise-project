<template>
  <div id="warning-census-container">
    <div
        class="item"
        v-for="(item, index) in censusConfig"
        :key="index"
        :class="data[item.key] === 0 ? 'normal' : 'active'"
    >
      <div class="img">
        <SvgIcon
          :name="item.key"
          :color="data[item.key] === 0 ? colors[1] : colors[0]"
        />
      </div>
      <div class="label">{{item.label}}</div>
      <div class="count">{{data[item.key]}}</div>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';

  export default Vue.extend({
    components:{SvgIcon},
    props:['data'],
    data() {
      return {
        censusConfig:[
          { key:'face',label:'人脸识别预警',},
          { key:'safeHat',label:'安全帽预警',},
          { key:'workArea',label:'人员入侵预警',},
          { key:'reflectiveClothing',label:'反光衣预警',},
          { key:'climb',label:'高空作业安全带预警',},
          { key:'stop',label:'静止预警',},
          { key:'fire',label:'火灾预警',},
          { key:'fall',label:'跌倒预警',},
        ],
        colors:['#fff','rgb(102, 102, 102)'],
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>