<script setup>
import { defineProps, defineEmits,ref,markRaw,reactive, } from 'vue';
import { getSecretListApi as getList } from '../../../../../api/secret.js'
import { useItem } from '../../../../../store/index.js'
import { storeToRefs } from 'pinia'

const useItemer = useItem()
const props = defineProps({
    envFrom: {
        type: Array,
        default: () => []
    },
    method: {
        type: String,
        default: 'add'
    },
})
//自动关闭dialog
const emit = defineEmits(['close'])
const addHandler = () => {
    if(!props.envFrom){
        props.envFrom = []
    }
    props.envFrom.unshift(data.envFromItems)
    emit('close')
}
const data = reactive({
    items: [],
    envFromItems: {
        prefix: '',
        secretRef:{
            name: '',
        }
    }
})

const handleVisibleChange = (nowStatus) => {
  if (nowStatus) {
    const putdata = {
      clusterId: useItemer.clusterId,
      namespace: useItemer.namespace
    }
    getList(putdata).then(res => {
      data.items = res.data.items
    })
  }
}
const { items, } = storeToRefs(data)
</script>

<template>
    <el-form :model="data.envFromItems">
        <el-form-item label="变量前缀">
            <el-input v-model="data.envFromItems.prefix" />
        </el-form-item>
        <el-form-item label="选择Secret">
            <el-select v-model="data.envFromItems.secretRef.name" placeholder="选择secret" @visible-change="handleVisibleChange">
                <el-option v-for="item in data.items" :key="item.metadata.name" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
        </el-form-item>
    </el-form>
    <div>
        <el-button  v-if="props.method === 'add'" type="primary" @click="addHandler">添加</el-button>
    </div>
</template>

<style scoped>

</style>
