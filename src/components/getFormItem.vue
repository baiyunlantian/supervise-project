<template>
  <el-input
      v-if="item.type === 'input' || item.type === 'textarea' || item.type === 'number'"
      v-model="formData[item.key]"
      :type="item.type === 'input' ? 'text' : item.type"
      :show-password="item.showPassword || false"
      :class="item.className"
  />

  <el-select
      v-else-if="item.type === 'select'"
      v-model="formData[item.key]"
      :clearable="!item.multiple"
      :class="item.className"
      :multiple="item.multiple"
      @change="options=>selectChange(options, item.key)"
      @remove-tag="option=>selectRemoveTag(option, item.key)"
  >
    <el-option
        v-for="(option, index) in item.options"
        :key="index"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
    />
  </el-select>
  <el-date-picker
      v-else-if="item.type === 'datetimerange' || item.type === 'datetime' || item.type === 'date' || item.type === 'daterange'"
      v-model="formData[item.key]"
      :type="item.type"
      :format="item.format || 'yyyy-MM-dd'"
      :class="item.className"
      :start-placeholder="item.startPlaceholder"
      :end-placeholder="item.endPlaceholder"
      range-separator="—"
      clearable
  />
  <el-radio-group
      v-else-if="item.type === 'radio'"
      v-model="formData[item.key]"
      :class="item.className"
  >
    <el-radio v-for="(option,index) in item.options" :label="option.value" :key="index">{{option.label}}</el-radio>
  </el-radio-group>



</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    props:{
      item:{
        type:Object,
        required:true,
      },
      formData:{
        type:Object,
        required:true,
      }
    },
    methods:{
      selectChange: function (option:any, key:string) {
        this.$emit('selectChange', option, key);
      },
      selectRemoveTag: function (option:any, key:string) {
        this.$emit('selectRemoveTag', option, key);
      }
    },
  })
</script>

<style scoped>

</style>