<script setup>
import { onMounted,ref, defineProps, defineEmits } from 'vue';

//同时支持字符串和数字输入，并且自动转换类型
let inputData = ref()

const props = defineProps({
    width:{
        type: String,
        default: '100%'
    },
    data:{
        type: [String, Number],
    },
    placeholder:{
        type: String,
        default: '输入你的数据'
    }
})

const emits = defineEmits(['update:data'])
const inputChange = () => {
  emits('update:data', Number(inputData.value)? Number(inputData.value) : inputData.value)
}

onMounted(() => {
  inputData.value = props.data
})

</script>

<template>
    <el-input v-model="inputData" placeholder="props.placeholder" style="width:props.width" @change="inputChange"></el-input>
</template>

<style scoped>

</style>