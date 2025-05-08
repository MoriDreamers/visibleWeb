<script setup>
import { onMounted, reactive,toRefs } from 'vue';
import { getClusterListApi} from '../../api/cluster.js';
import { getNameSpaceListApi} from '../../api/namespace.js';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps({
    showNamespace: {
        type: Boolean,
        default: true
    },
    clusterReadOnly: {
        type: Boolean,
    },
    namespaceReadOnly: {
        type: Boolean,
    },
})


const data = reactive({
    clusterList: [],
    namespaceList: [],
    clusterId: "",
    namespace: ""
})

// 处理当集群和namespace产生变化后的事件
const emits = defineEmits(['clusterChangedRollback', 'namespaceChangedRollback'])
// 定义namespace发生变化后调用的函数
const namespaceChangedRollbackHandler = () => {
    emits('namespaceChangedRollback', data.clusterId, data.namespace)
} 
const clusterChangedRollbackHandler = () => {
    emits('clusterChangedRollback', data.clusterId)
} 

// 查询集群
const getNamespaceList = async () => {
    await getNameSpaceListApi(data.clusterId).then((response) => {
        const items = response?.data?.items || []
        console.log("集群和命名空间选择组件查询到:", items)
        data.namespaceList = items
    }).catch((err) => {
        console.error("获取 namespace 失败", err)
        data.namespaceList = []
    })
    
    const curNamespace = route.query.namespace
    data.namespace = curNamespace ? curNamespace : "default"

    // 回调函数
    namespaceChangedRollbackHandler()
}


// 异转同
const getClusterList = async() => {
    await getClusterListApi().then(
        (response) => {
            data.clusterList = response.data.items
        }
    )
}   

const clusterChanged = () => {
    // 查询namespace
    if (props.showNamespace) {
        getNamespaceList()
    } else {
        clusterChangedRollbackHandler()
    }
}

const namespaceChanged = () => {
    namespaceChangedRollbackHandler()
}

onMounted(async() => {
    await getClusterList()
    const defaultClusterSelected = data.clusterList[0].id
    // 获取当前请求是否携带了集群ID的参数
    const curClusterId = route.query.clusterId
    data.clusterId = curClusterId?curClusterId:defaultClusterSelected
    clusterChanged()

    
})

const { clusterReadOnly, namespaceReadOnly, } = toRefs(props)
const {clusterId,clusterList,namespace,namespaceList} = toRefs(data)

</script>

<template>
    <el-select v-model="clusterId" placeholder="选择集群" @change="clusterChanged">
        <el-option
            v-for="item in clusterList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
            :disabled="item.status == 'InActive' || clusterReadOnly"
        />
    </el-select>
    
    <el-select filterable style="margin-left: 20px;" v-if="props.showNamespace" v-model="namespace" placeholder="选择namespace" @change="namespaceChanged()">
        <el-option v-for="items in namespaceList"
        :key="items.metadata.name"
        :label="items.metadata.name"
        :value="items.metadata.name"
        :disabled="namespaceReadOnly"
        />
    </el-select>

</template>


