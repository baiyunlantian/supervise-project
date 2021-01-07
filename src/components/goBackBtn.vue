<template>
  <div class="go-back-btn" @click="goBack">
    <SvgIcon
      name="goBack"
      color="#fff"
      height="1.09375rem"
    />
    <div class="text">{{text || '返回'}}</div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import SvgIcon from '@/components/svgIcon.vue';

  export default Vue.extend({
    props:['text'],
    components:{
      SvgIcon,
    },
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
    background-color: #0372f8;
    width: 2.8125rem;
    height: 1.09375rem;
    padding: 0 !important;
    font-size: 0.5625rem !important;
    display: inline-block;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    .text{
      letter-spacing: 0.15625rem;
      display: inline-block;
      position: relative;
      top: -0.3125rem;
    }
  }
</style>