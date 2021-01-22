<template>
  <div id="set-voice-container">
    <div class="btn-container">
      <GoBackBtn />
    </div>
    <div class="fontBlackAndBold">实时播报语音设置</div>

    <div class="normal-voice-content bgcAndShadow">
      <div class="operate-btn">
        <SvgIcon
            name="edit"
            @click="handleChangeInputDisabled('realtimeVoice',false)"
            v-if="disableInputs.realtimeVoice"
        />
        <template v-else>
          <i class="el-icon-success" @click="handleUpdateNormalVoice('realtimeVoice')"/>
          <SvgIcon
              name="goBack"
              color="rgb(136, 136, 136)"
              @click="handleCancelUpdateVoice('realtimeVoice',true)"
          />
        </template>
      </div>

      <el-form
          ref="form"
          class="form-container"
          :disabled="disableInputs.realtimeVoice"
          :model="voiceFormData"
      >
        <el-form-item label="播报内容：" prop="realtimeVoice">
          <el-input v-model="voiceFormData.realtimeVoice" @input="value=>checkValidRealtime(value,'realtimeVoice')"/>
          <span class="compute-num">{{voiceFormData.realtimeVoice ? voiceFormData.realtimeVoice.length : 0}}/20</span>
          <div class="error-text" :style="{visibility: exceptionValidate.realtimeVoice === true ? 'hidden' : 'visible'}">超出最大限制</div>
        </el-form-item>

        <el-form-item
            v-for="(item, index) in items"
            :key="index"
            :label="item.label"
            :prop="item.key"
        >
          <el-input v-model="voiceFormData[item.key]" :type="item.type" @input="(value)=>checkValidRealtime(value,item.key)"/>
          <div class="error-text" :style="{visibility: exceptionValidate[item.key] === true ? 'hidden' : 'visible'}">超出最大限制</div>
        </el-form-item>

      </el-form>
    </div>

    <div class="exception-voice-content bgcAndShadow">
      <div class="title fontBlackAndBold">异常语音播报内容设置</div>

      <div class="exception-voice-list">
        <div
            class="item bgcAndShadow"
            v-for="(item,index) in exceptionFormItems"
            :key="index"
        >
          <div class="operate-btn">
            <SvgIcon
              name="edit"
              @click="handleChangeInputDisabled(item.key,false)"
              v-if="disableInputs[item.key]"
            />
            <template v-else>
              <SvgIcon
                  name="voiceUpdate"
                  color="rgb(0, 204, 51)"
                  @click="handleUpdateNormalVoice(item.key)"
              />
              <SvgIcon
                  name="goBack"
                  color="rgb(136, 136, 136)"
                  @click="handleCancelUpdateVoice(item.key,true)"
              />
            </template>
          </div>

          <div class="content">
            <div class="label">
              <div class="img">
                <SvgIcon :name="item.key.slice(0, item.key.length - 5)"/>
              </div>
              <div class="text">{{item.label}}</div>
            </div>

            <el-input
                v-model="voiceFormData[item.key]"
                @input="value=>handleComputeCount(item.key,value)"
                :disabled="disableInputs[item.key]"
            />
            <div class="tip">
              <div class="error-text" :style="{visibility: exceptionValidate[item.key] === true ? 'hidden' : 'visible'}">超出最大限制</div>
              <div class="count">{{voiceFormData[item.key] ? voiceFormData[item.key].length : 0}}/20</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import GoBackBtn from '@/components/goBackBtn.vue';
  import Form from '@/components/form/index.vue';
  import SvgIcon from '@/components/svgIcon.vue';
  import { getVoiceInfo, updateVoiceInfo } from "@/request/equipment";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
      SvgIcon,
    },
    data() {
      return {
        items:[
          {key:'realtimeVoiceCount', label:'播报次数',type:'number'},
          {key:'realtimeVoiceIntervalTime', label:'间隔时间',type:'number'},
        ],
        rules:{
          realtimeVoice:[{max:20, message: '超出最大限制', trigger: 'change'}],
        },
        //传给后台的值
        voiceFormData:{
          realtimeVoice:'',
          realtimeVoiceCount:0,
          realtimeVoiceIntervalTime:0
        },
        //仅用来展示
        baseVoiceFormData:{},
        disableInputs:{
          realtimeVoice:true,
          faceVoice:true,
          helmetVoice:true,
          refectiveVestVoice:true,
          regionVoice:true,
          fireVoice:true,
          motionlessVoice:true,
          climbHeightVoice:true,
          tumbleVoice:true,
        },
        exceptionFormItems:[
          {key:'faceVoice',label:'人脸识别预警',},
          {key:'helmetVoice',label:'安全帽预警',},
          {key:'refectiveVestVoice',label:'反光衣预警',},
          {key:'regionVoice',label:'作业区域预警',},
          {key:'fireVoice',label:'火灾预警',},
          {key:'motionlessVoice',label:'静止预警',},
          {key:'climbHeightVoice',label:'登高预警',},
          {key:'tumbleVoice',label:'跌倒预警',},
        ],
        exceptionValidate:{
          realtimeVoice:true,
          realtimeVoiceCount:true,
          realtimeVoiceIntervalTime:true,
          faceVoice:true,
          helmetVoice:true,
          refectiveVestVoice:true,
          regionVoice:true,
          fireVoice:true,
          motionlessVoice:true,
          climbHeightVoice:true,
          tumbleVoice:true,
        },
      }
    },
    methods: {
      //切换对应input的禁用状态
      handleChangeInputDisabled: function (key:string, value:boolean) {
        this.$set(this.disableInputs,key,value)
      },
      handleUpdateNormalVoice: function (key:string) {
        let flag = true;
        Object.keys(this.exceptionValidate).forEach(key=>{
          //@ts-ignore
          if (!this.exceptionValidate[key]){
            flag = false;
            return;
          }
        })

        if (!flag) return;

        let data : any = JSON.parse(JSON.stringify(this.baseVoiceFormData));

        if (key === 'realtimeVoice'){
          const {realtimeVoice, realtimeVoiceCount, realtimeVoiceIntervalTime} = this.voiceFormData;
          data.realtimeVoice = realtimeVoice;
          data.realtimeVoiceCount = realtimeVoiceCount;
          data.realtimeVoiceIntervalTime = realtimeVoiceIntervalTime;
        }
        //@ts-ignore
        data[key] = this.voiceFormData[key];
        data.realtimeVoiceCount = String(data.realtimeVoiceCount);
        data.realtimeVoiceIntervalTime = String(data.realtimeVoiceIntervalTime);

        updateVoiceInfo(data).then(res=>{
          showMessageAfterRequest(res.data, '更新成功', '更新失败');

          if (res.data) {
            this.handleChangeInputDisabled(key, true);
            this.initVoiceInfo();
          }
        })

      },
      //点击更新语音  取消按钮
      handleCancelUpdateVoice: function (disabledInputKey:string, disabledInputValue:boolean) {

        this.handleChangeInputDisabled(disabledInputKey, disabledInputValue);

        //@ts-ignore    重置对应input的value
        this.$set(this.voiceFormData,disabledInputKey,this.baseVoiceFormData[disabledInputKey]);

        if (disabledInputKey === 'realtimeVoice'){
          //@ts-ignore
          this.$set(this.voiceFormData,'realtimeVoiceCount',this.baseVoiceFormData.realtimeVoiceCount);
          //@ts-ignore
          this.$set(this.voiceFormData,'realtimeVoiceIntervalTime',this.baseVoiceFormData.realtimeVoiceIntervalTime);
        }
      },
      //计算异常语音内容长度
      handleComputeCount: function (key:string, value:string) {
        value && value.length > 20 ? this.$set(this.exceptionValidate,key,false) : this.$set(this.exceptionValidate,key,true);
      },
      initVoiceInfo: function () {
        getVoiceInfo().then(res=>{
          if (!res.data) return;
          this.voiceFormData = res.data;
          this.baseVoiceFormData = JSON.parse(JSON.stringify(res.data));
        })
      },
      checkValidRealtime: function (value:string, key:string) {
        if (!value) return;

        let flag = true;
        if(key === 'realtimeVoiceCount'){
          flag = Number(value) > 30 ? false : true;
        }else if (key === 'realtimeVoiceIntervalTime'){
          flag = Number(value) > 3600 ? false : true;
        }else if (key === 'realtimeVoice'){
          flag = value.length > 20 ? false : true;
        }

        this.$set(this.exceptionValidate, key, flag);
      }
    },
    mounted(): void {
      this.initVoiceInfo();
    }
  })
</script>

<style scoped lang="less">
  @import "set-voice.less";
</style>