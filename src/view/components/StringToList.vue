<script setup>
import { onMounted,ref, defineProps, defineEmits } from 'vue';

//为了实现字符串转数组，并实现双向绑定
let inputData = ref()

const props = defineProps({
    width:{
        type: String,
        default: '100%'
    },
    data:{
        type: Array,
    },
    placeholder:{
        type: String,
        default: '输入你的数据'
    }
})

const emits = defineEmits(['update:data'])
const inputChange = () => {
  //String转List 并且回调
  emits('update:data', inputData.value.split('\n'))
}

onMounted(() => {
  //先把数据转换
  if (props.data){
    inputData.value = props.data.join('\r\n')
  }
})

</script>

<template>
    <el-input
      type="textarea"
      v-model="inputData"
      :placeholder="props.placeholder"
      :style="{ width: props.width }"
      @change="inputChange"
    />
  </template>
  

<style scoped>

</style>