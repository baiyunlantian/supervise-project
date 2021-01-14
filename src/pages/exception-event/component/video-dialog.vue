<template>
  <el-dialog
      :visible="visible"
      :show-close="false"
      custom-class="video-dialog"
      width="800px"
      append-to-body
  >
    <template slot="title">
      <i class="el-icon-close" @click="close"/>
    </template>

    <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
    />
  </el-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:['visible','videoUrl'],
    data() {
      return {
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
          autoplay: false, // 如果为true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 是否视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              type: "video/mp4", // 类型
              src:this.$props.videoUrl,
            },
            {
              type:"video/webm", // 可以播放，用ogg也可打开
              src:this.$props.videoUrl,
            },
            {
              type:"video/ogg",    // 可以播放，用webm也可打开
              src:this.$props.videoUrl,
            },
            {
              type:"video/3gp",    // 可以播放
              src:this.$props.videoUrl,
            }
          ],
          poster: '', // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: false, // 当前时间和持续时间的分隔符
            durationDisplay: false, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true, // 是否显示全屏按钮
            progressControl: false, // 进度条
          }
        }
      }
    },
    methods: {
      close: function () {
        //@ts-ignore
        this.$refs.videoPlayer.player.src(this.$props.videoUrl)
        this.$emit('close');
      }
    },
    mounted(): void {
    }
  })
</script>

<style scoped lang="less">
  @import "video-dialog.less";
</style>