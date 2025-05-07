<script setup>
//exec探针模块
import StringToList from './../../../StringToList.vue'
const props = defineProps({
    probeConfig: {
        type: Object,
    }
})

</script>

<template>
    <el-row :gutter="24" justify="center">
        <el-col :span="24">
            <el-form-item label="* 键入探针检查命令" prop="">
                <StringToList v-model:data="props.probeConfig.exec.command" placeholder="请输入检查命令，以回车分隔"></StringToList>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<style scoped>

</style>

