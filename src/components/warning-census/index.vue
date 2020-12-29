<template>
  <div id="warning-census-container">
    <div
        class="item"
        v-for="(item, index) in censusConfig"
        :key="index"
        :class="data[item.key] === 0 ? 'normal' : 'active'"
    >
      <div class="img">
        <img :src="data[item.key] !== 0 ? item.normal : item.active" alt="***"/>
      </div>
      <div class="text">
        <div class="label">{{item.label}}</div>
        <div class="count">{{data[item.key]}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['data'],
    data() {
      return {
        censusConfig:[
          { key:'face',label:'人脸识别预警',
            normal:require('@/assets/menu/equipment.png'),
            active:require('@/assets/menu/equipment-active.png'),
          },
          { key:'safeHat',label:'安全帽预警',
            normal:require('@/assets/menu/exception.png'),
            active:require('@/assets/menu/exception-active.png'),
          },
          { key:'workArea',label:'作业区域预警',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
          { key:'clothes',label:'反光衣预警',
            normal:require('@/assets/menu/person.png'),
            active:require('@/assets/menu/person-active.png'),
          },
          { key:'climb',label:'登高预警',
            normal:require('@/assets/menu/schedule.png'),
            active:require('@/assets/menu/schedule-active.png'),
          },
          { key:'stop',label:'静止预警',
            normal:require('@/assets/menu/equipment.png'),
            active:require('@/assets/menu/equipment-active.png'),
          },
          { key:'fire',label:'火灾预警',
            normal:require('@/assets/menu/exception.png'),
            active:require('@/assets/menu/exception-active.png'),
          },
          { key:'fall',label:'跌倒预警',
            normal:require('@/assets/menu/monitor.png'),
            active:require('@/assets/menu/monitor-active.png'),
          },
        ],
      }
    },
  })
</script>

<style scoped lang="less">
  @import "index.less";
</style>