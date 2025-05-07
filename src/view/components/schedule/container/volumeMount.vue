<script setup>

//deployment容器的端口配置
import { defineProps, defineEmits, } from 'vue';
import { storeToRefs } from 'pinia';
import { useItem } from './../../../../store/index.js'
const { item } = storeToRefs(useItem())
const props = defineProps({
    volumeMounts: {
        type: Array,
        default: () => []
    }
})


const addTab = () => {
    const newMount=({
        name: '',
        mountPath: '',
        subPath: '',
        readonly: false
    })
    props.volumeMounts.unshift(newMount)
}

const deleteTab = (index) => {
    props.volumeMounts.splice(index, 1)
}
</script>

<template>
    <el-table
    :data="props.volumeMounts"
    align="center"
    >
        <el-table-column label="volume名称" >
            <template #default="scope">
                <el-select 
                v-model="scope.row.name" 
                placeholder="请选择volume名称"
                >
                    <el-option
                    v-for="volume in item.spec.template.spec.volumes"
                    :key="volume.name"
                    :label="volume.name"
                    :value="volume.name"
                    >
                    </el-option>

                </el-select>
            </template>
        </el-table-column>

        <el-table-column label="挂载路径" >
            <template #default="scope">
                <el-input 
                    v-model="scope.row.mountPath" 
                    placeholder="请输入挂载路径">
                </el-input>
            </template>
        </el-table-column>

        <el-table-column label="挂载子路径" >
            <template #default="scope">
                <el-input 
                    v-model="scope.row.subPath" 
                    placeholder="（可选）请输入挂载子路径">
                </el-input>
            </template>
        </el-table-column>

        <el-table-column label="只读挂载" >
            <template #default="scope">
                <el-switch v-model="scope.row.readonly" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
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

