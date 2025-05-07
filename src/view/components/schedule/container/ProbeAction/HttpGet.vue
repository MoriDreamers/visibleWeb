<script setup>
//httpget探针模块
import { ref, reactive, watch } from 'vue'
import StringAndNumberSupport from './../../../StringAndNumberSupport.vue'
import StringToList from './../../../StringToList.vue'
const props = defineProps({
    probeConfig: {
        type: Object,
    }
})
const editHeaders = ref(false)

// 监听是否添加请求头旋钮，如果为false，则清空httpHeaders
watch(editHeaders, (val) => {
    if (!val && props.probeConfig.httpGet && props.probeConfig.httpGet.httpHeaders) {
        props.probeConfig.httpGet.httpHeaders.splice(0)
    }
})

const deleteHandler = (row) => {
    props.probeConfig.httpGet.httpHeaders.splice(row, 1)
}
const addHandler = () => {
    const newHeader = { name: '', value: '' }
    props.probeConfig.httpGet.httpHeaders.unshift(newHeader)
}

</script>

<template>
    <el-row :gutter="24" justify="center">
        <el-col :span="12">
            <el-form-item label="请求端口" prop="">
                <StringAndNumberSupport  v-model:data="props.probeConfig.httpGet.port" placeholder="请输入端口号/端口名"></StringAndNumberSupport>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="请求主机" prop="">
                <StringAndNumberSupport  v-model:data="props.probeConfig.httpGet.host" placeholder="请输入主机名/IP"></StringAndNumberSupport>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row :gutter="24" justify="center">
        <el-col :span="12">
            <el-form-item label="请求接口" prop="">
                <el-input v-model="props.probeConfig.httpGet.path" placeholder="请输入请求接口"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="请求协议" prop="">
               <el-select v-model="props.probeConfig.httpGet.scheme" placeholder="请选择请求协议">
                <el-option label="HTTP" value="http"></el-option>
                <el-option label="HTTPS" value="https"></el-option>
               </el-select>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row :gutter="24">
            <el-col :span="3">
                <el-form-item label="自定义请求头" prop="">
                  <el-switch v-model="editHeaders" ></el-switch>
                </el-form-item>
            </el-col>
            <el-col :span="21" v-if="editHeaders" style="">
                <el-form-item label="" prop="">
                    <el-table :data="props.probeConfig.httpGet.httpHeaders">
                        <el-table-column prop="name" label="请求头名称">
                            <template #default="scope">
                                <el-input v-model.trim="scope.row.name" placeholder="请输入请求头名称"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="请求头值">
                            <template #default="scope">
                                <el-input v-model.trim="scope.row.value" placeholder="请输入请求头值"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="action" label="操作">
                            <template #header>
                                <el-button text type="primary" @click="addHandler">添加</el-button>
                            </template>
                            <template #default="scope">
                                <el-button text type="warning" @click="deleteHandler(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-col>
    </el-row>
</template> 

<style scoped>

</style>

