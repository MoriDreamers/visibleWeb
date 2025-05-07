<script setup>
import StringAndNumberSupport from './../../../StringAndNumberSupport.vue'
import StringToList from './../../../StringToList.vue'
const props = defineProps({
    probeConfig: {
        type: Object,
    }
})

</script>

<template>
    <el-row :gutter="24" justify="center">
        <el-col :span="12">
            <el-form-item label="* 键入探测端口号" prop="">
                <el-input-number :min="1" :controls="false" :max="65535" v-model="props.probeConfig.grpc.port" placeholder="请输入端口号"></el-input-number>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="* 键入探测主机" prop="">
                <el-input v-model="props.probeConfig.grpc.service" placeholder="请输入探测的Service"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<style scoped>

</style>

