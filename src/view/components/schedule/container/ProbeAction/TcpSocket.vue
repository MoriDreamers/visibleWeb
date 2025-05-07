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
                <StringAndNumberSupport  v-model:data="props.probeConfig.tcpSocket.port" placeholder="请输入端口号/端口名"></StringAndNumberSupport>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="键入探测主机（可选）" prop="">
                <StringAndNumberSupport  v-model:data="props.probeConfig.tcpSocket.host" placeholder="请输入主机名/IP"></StringAndNumberSupport>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<style scoped>

</style>

