<template>
  <el-form
      ref="form"
      class="form-container"
      :model="formData"
      :disabled="disabled"
      :rules="formProps.rules"
      :label-width="formProps.labelWidth || 'auto'"
      :show-message="formProps.showMessage || true"
      :inline-message="formProps.inlineMessage || false"
      :label-position="formData.labelPosition || 'left'"
      :hide-required-asterisk="formProps.hideRequiredAsterisk || false"
  >
    <!--    自定义插入内容--插入位置--前  -->
    <slot name="before"/>

    <el-form-item
        v-for="(item, index) in formProps.items"
        :key="index"
        :label="item.label"
        :prop="item.key"
        :label-width="item.width"
    >
      <GetFormItem
          :formData="formData"
          :item="item"
          @selectChange="selectChange"
      />
    </el-form-item>

    <!--  自定义插入内容--插入位置--后  -->
    <slot></slot>

    <el-form-item v-if="!formProps.hiddenFooter">
      <el-button :class="formProps.okBtnClass" type="primary" @click="onOk">{{formProps.onOkText || '确认'}}</el-button>
      <el-button :class="formProps.cancelBtnClass" v-if="formProps.onCancelText" @click="onCancel">{{formProps.onCancelText}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import Vue, {PropType} from 'vue';
  import getFormItem from "@/components/getFormItem.vue";

  interface FORM_ITEM_PROPS {
    key:string,
    label:string,
    type:string
  }

  interface FORM_PROPS {
    items: Array<FORM_ITEM_PROPS>,
    rules?: Array<Object>,
    onOkText?: string,
    okBtnClass?: string,
    onCancelText?: string,
    cancelBtnClass?: string,
    showMessage?: boolean,
    inlineMessage?: boolean,
    hideRequiredAsterisk?: boolean,
    hiddenFooter?: boolean,
    labelPosition?: 'left' | 'top' | 'right',
    labelWidth?: string,
  }

  export default Vue.extend({
    props:{
      formProps:{
        type: Object as PropType<FORM_PROPS>,
        required: true,
      },
      formData:{
        type: Object,
        required: true,
      },
      disabled:{
        type: Boolean,
        required: false,
      },
    },
    components:{
      'GetFormItem':getFormItem,
    },
    methods:{
      onOk: function () {
        this.$emit('onOk', this.$props.formData);
      },
      onCancel: function () {
        this.$emit('onCancel');
      },
      validate: function (callback:Function) {
        //@ts-ignore
        this.$refs.form.validate((valid) => {
          if (valid) {
            callback(valid);
          } else {
            return false;
          }
        });
      },
      selectChange: function (option:any) {
        this.$emit('selectChange', option);
      }
    },
  })
</script>

<style>
  @import "index.less";
</style>