<script setup>
//frame是一个调度的框架 所以创建资源我们在父组件里进行，子组件框架只需要通过emits告诉我
//我需要提交的资源是什么（data） 要做什么动作（tag） 然后我在此处进行提交
import ScheduleFrame from '../components/scheduleFrame.vue'
import { storeToRefs } from 'pinia';
import { useItem } from '../../store/index.js'
import { addDeploymentApi as addApi,updateDeploymentApi as updateApi } from '../../api/deployment.js';
import { ElMessage } from 'element-plus';
import ViewYMAL from '../components/ViewYMAL.vue';
import { objToYaml } from '../../utils/utils.js';
import {  ref, computed } from 'vue';




//拿到pinia的全局状态管理
const useItemer = useItem()

const props = defineProps({
    method: {
        type: String,
        default: 'add'
    }
})

const showDetailDialog = ref(false)
const yamlItem = ref('')


const itemtemp = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: useItemer.item.metadata,
            spec: useItemer.item.spec,
        };



const submit = (tag,autoCreateService) => {
    console.log("tag: ", tag)
    console.log("item: ", useItemer.item)

    if(tag === 'yaml'){
        delete useItemer.item.metadata.managedFields;
        //补充client-go省略的数据
        yamlItem.value = objToYaml(itemtemp)
        showDetailDialog.value = true
        return
    }else{
        const Postdata = {
            clusterId: useItemer.clusterId,
            namespace: useItemer.namespace,
            item: useItemer.item,
            autoCreateService
        }

    if(props.method !== 'update'){
        addApi(Postdata).then((Response) => {
            ElMessage({
                type:'success',
                message:Response.message,
                })
            })
    }else{
        updateApi(Postdata).then((Response) => {
            ElMessage({
                type:'success',
                message:Response.message,
            })
        })
    }
}
}

const {clusterId,namespace,} = storeToRefs(useItemer)


</script>

<template>
    <ScheduleFrame @submit="submit" :method="props.method"></ScheduleFrame>
    <ViewYMAL :clusterId="clusterId" :namespace="namespace" :showDetailDialog="showDetailDialog" :yamlContent="yamlItem" 
    @before-close="(value)=>{showDetailDialog = value}"
    />
</template>

<style scoped>

</style>