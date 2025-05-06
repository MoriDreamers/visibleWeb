<script setup>
import { onMounted,ref, defineProps, defineEmits } from 'vue';

// 这个组件可以把八进制的数字转换成十进制的数字!!!
let inputData = ref()

const props = defineProps({
    width:{
        type: String,
        default: '100%'
    },
    data:{
        type: null,
    },
    placeholder:{
        type: String,
        default: '输入你的数据',
    }
})

const emits = defineEmits(['update:data'])
const inputChange = (newValue) => {
    if (newValue.indexOf(0) == 0){
        newValue = parseInt (newValue,8)
    }
    emits('update:data', Number(newValue)?Number(newValue):420)
}

const input = (value) => {
    emits('update:data', value)
}

onMounted(() => {
  inputData.value = props.data
})

</script>

<template>
    <!--使用一个双向绑定和input事件来实现数据双向绑定-->
    <el-input :model-value="data"       :placeholder="props.placeholder"
    :style="{ width: props.width }" @input="input" style="width:props.width" @change="inputChange"></el-input>
</template>

<style scoped>

</style>