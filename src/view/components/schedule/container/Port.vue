<script setup>

//deployment容器的端口配置
import { defineProps, defineEmits, } from 'vue';

const props = defineProps({
    ports: {
        type: Array,
        default: () => []
    }
})


const addTab = () => {
    const newPort=({
        name: '',
        containerPort: 80,
        hostPort: 0,
        protocol: 'TCP'
    })
    props.ports.unshift(newPort)
}

const deleteTab = (index) => {
    props.ports.splice(index, 1)
}
</script>

<template>
    <el-table
    :data="props.ports"
    align="center"
    >
        <el-table-column label="端口名称" >
            <template #default="scope">
                <el-input v-model.trim="scope.row.name" placeholder="请输入端口名称"></el-input>
            </template>
        </el-table-column>

        <el-table-column label="容器端口" >
            <template #default="scope">
                <el-input-number 
                    v-model="scope.row.containerPort" 
                    :min="1" 
                    :max="65535" 
                    :controls="false"
                    placeholder="请输入容器端口">
                </el-input-number>
            </template>
        </el-table-column>

        <el-table-column label="主机端口" >
            <template #default="scope">
                <el-input-number 
                    v-model="scope.row.hostPort" 
                    :min="1" 
                    :max="65535" 
                    :controls="false"
                    placeholder="请输入主机端口">
                </el-input-number>
            </template>
        </el-table-column>

        <el-table-column label="协议" >
            <template #default="scope">
                <el-select v-model="scope.row.protocol" placeholder="请选择协议">
                    <el-option label="TCP" value="TCP"></el-option>
                    <el-option label="UDP" value="UDP"></el-option>
                    <el-option label="SCTP" value="SCTP"></el-option>
                </el-select>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
            <template #header>
                <el-button link type="primary" @click="addTab">添加</el-button>
            </template>
            <template #default="scope">
                <el-button type="danger" link @click="deleteTab(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
/*
<!--把这个输入框 变成铺满页面 美观一下-->
*/
.el-input-number {
    width: 100%;
}
:deep(.el-input-number .el-input__wrapper) {
    padding-left: 8px;
}
</style>

