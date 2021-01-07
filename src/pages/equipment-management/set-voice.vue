<template>
  <div id="set-voice-container">
    <div class="btn-container">
      <GoBackBtn />
    </div>
    <div class="fontBlackAndBold">实时播报语音设置</div>

    <div class="normal-voice-content bgcAndShadow">
      <div class="operate-btn">
        <i class="el-icon-edit-outline" v-if="disableInputs.normal" @click="handleChangeInputDisabled('normal',false)"/>
        <template v-else>
          <i class="el-icon-success" @click="handleUpdateNormalVoice('normal')"/>
          <i class="el-icon-error" @click="handleCancelUpdateVoice('normal',true)"/>
        </template>
      </div>

      <Form
          ref="form"
          :disabled="disableInputs.normal"
          :form-data="voiceFormData"
          :form-props="normalFormProps"
      >
        <el-form-item label="播报内容：" prop="normal" slot="before">
          <el-input v-model="voiceFormData.normal"/>
          <span class="compute-num">{{voiceFormData.normal ? voiceFormData.normal.length : 0}}/30</span>
        </el-form-item>
      </Form>
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
            <i class="el-icon-edit-outline" v-if="disableInputs[item.key]" @click="handleChangeInputDisabled(item.key,false)"/>
            <template v-else>
              <i class="el-icon-success" @click="handleUpdateNormalVoice(item.key)"/>
              <i class="el-icon-error" @click="handleCancelUpdateVoice(item.key,true)"/>
            </template>
          </div>

          <div class="content">
            <div class="label">
              <div class="img"><img :src="item.img" alt="***"/></div>
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
  import { getVoiceInfo, updateVoiceInfo } from "@/request/equipment";
  import {showMessageAfterRequest} from "@/utils/common";

  export default Vue.extend({
    components:{
      GoBackBtn,
      Form,
    },
    data() {
      return {
        normalFormProps:{
          items:[
            {key:'count', label:'播报次数',type:'number'},
            {key:'time', label:'间隔时间',type:'number'},
          ],
          rules:{
            normal:[{max:30, message: '超出最大限制', trigger: 'change'}],
          },
          showMessage:true,
          hiddenFooter:true,
        },
        //传给后台的值
        voiceFormData:{
          normal:'',
          count:0,
          time:0
        },
        //仅用来展示
        baseVoiceFormData:{},
        disableInputs:{
          normal:true,
          face:true,
          safeHat:true,
          reflectiveClothing:true,
          workArea:true,
          fire:true,
          stop:true,
          climb:true,
          fall:true,
        },
        exceptionFormItems:[
          {key:'face',label:'人脸识别预警',img:require('@/assets/menu/equipment-active.png')},
          {key:'safeHat',label:'安全帽预警',img:require('@/assets/menu/exception-active.png')},
          {key:'reflectiveClothing',label:'反光衣预警',img:require('@/assets/menu/monitor-active.png')},
          {key:'workArea',label:'作业区域预警',img:require('@/assets/menu/person-active.png')},
          {key:'fire',label:'火灾预警',img:require('@/assets/menu/schedule-active.png')},
          {key:'stop',label:'静止预警',img:require('@/assets/menu/equipment-active.png')},
          {key:'climb',label:'登高预警',img:require('@/assets/menu/exception-active.png')},
          {key:'fall',label:'跌倒预警',img:require('@/assets/menu/monitor-active.png')},
        ],
        exceptionValidate:{
          face:true,
          safeHat:true,
          reflectiveClothing:true,
          workArea:true,
          fire:true,
          stop:true,
          climb:true,
          fall:true,
        },
      }
    },
    methods: {
      //切换对应input的禁用状态
      handleChangeInputDisabled: function (key:string, value:boolean) {
        this.$set(this.disableInputs,key,value)
      },
      handleUpdateNormalVoice: function (key:string) {
        let data : any = {};

        if (key === 'normal'){
          //@ts-ignore   校验实时播报内容长度
          this.$refs.form.validate((valid)=>{
            const {normal, count, time} = this.voiceFormData;
            data = {normal, count, time};
          })
        }else {
          //@ts-ignore  校验异常语音内容长度
          if (this.exceptionValidate[key] === false){
            return;
          }

          //@ts-ignore
          data[key] = this.voiceFormData[key]
        }

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

        if (disabledInputKey === 'normal'){
          //@ts-ignore
          this.$set(this.voiceFormData,'count',this.baseVoiceFormData.count);
          //@ts-ignore
          this.$set(this.voiceFormData,'time',this.baseVoiceFormData.time);
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