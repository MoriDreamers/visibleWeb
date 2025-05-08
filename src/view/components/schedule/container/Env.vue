<script setup>

//deployment容器的端口配置
import { defineProps, defineEmits,ref,markRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useItem } from './../../../../store/index.js'
import ConfigMap from './EnvFrom/ConfigMap.vue'
import Secret from './EnvFrom/Secret.vue'

const envFromComponent = {
    configMap: markRaw(ConfigMap),
    secret: markRaw(Secret),
}
const { item } = storeToRefs(useItem())
const props = defineProps({
    env: {
        type: Array,
        default: () => []
    },
    envFrom: {
        type: Array,
        default: () => []
    },
})


const addTab = () => {
    const newEnv=({
        name: '',
        value: '',
    })
    if(!props.env){
        props.env = []
    }
    props.env.unshift(newEnv)
}

const activeName = ref('env')

const deleteTab = (index) => {
    props.env.splice(index, 1)
}

const addTabFrom = () => {
    showDialog.value = true

}

const deleteTabFrom = (index) => {
    props.envFrom.splice(index, 1)
}   

const showDialog = ref(false)
const envFromType = ref('configMaps')
</script>

<template>
    <el-tabs v-model="activeName" class="demo-tabs" >
        <el-tab-pane label="手动配置" name="env">
            <el-table :data="props.env" align="center">
                <el-table-column label="变量名" prop="name" >
                    <template #default="scope">
                        <el-input v-model="scope.row.name" />
                    </template>
                </el-table-column>
                <el-table-column label="变量值" prop="value" >
                    <template #default="scope">
                        <el-input v-model="scope.row.value" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #header>
                        <el-button text type="primary" @click="addTab">添加</el-button>
                    </template>
                    <template #default="scope">
                        <el-button text type="danger" @click="deleteTab(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="批量生成" name="envfrom" >
            <el-table :data="props.envFrom" align="center" >
                <el-table-column label="变量前缀" prop="" >
                    <template #default="scope">
                        <el-input v-model="scope.row.prefix" />
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="type" >
                    <template #default="scope">
                       <span>{{scope.row.secretRef?'secret':'configMap'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="变量来源" prop="config" >
                    <template #default="scope">
                        <span v-if="scope.row.configMapRef?.name">{{ scope.row.configMapRef.name }}</span>
                        <span v-if="scope.row.secretRef?.name">{{ scope.row.secretRef.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #header>
                        <el-button text type="primary" @click="addTabFrom">添加</el-button>
                    </template>
                    <template #default="scope">
                        <el-button text type="danger" @click="deleteTabFrom(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-dialog v-model="showDialog" title="通过Secret/ConfigMap生成环境变量" width="40%" destroy-on-close>
            <div style="margin-bottom: 13px;">
                <el-radio-group v-model="envFromType">
                    <el-radio label="secret" value="secret">Secret</el-radio>
                    <el-radio label="configMap" value="configMap">ConfigMap</el-radio>
                </el-radio-group>
            </div>
            <div>
                <component :is="envFromComponent[envFromType]" :envFrom="props.envFrom" @close="()=>{showDialog=false}" />
            </div>
            <div>
            </div>
        </el-dialog>
      </el-tabs>
</template>

<style scoped>

</style>

