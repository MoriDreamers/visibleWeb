<script setup>
//frame是一个调度的框架 所以创建资源我们在父组件里进行，子组件框架只需要通过emits告诉我
//我需要提交的资源是什么（data） 要做什么动作（tag） 然后我在此处进行提交
import ScheduleFrame from '../components/scheduleFrame.vue'
import { storeToRefs } from 'pinia';
import { useItem } from '../../store/index.js'
import { addDeploymentApi as addApi,updateDeploymentApi as updateApi } from '../../api/deployment';
import { ElMessage } from 'element-plus';

//拿到pinia的全局状态管理
const useItemer = useItem()

const props = defineProps({
    method: {
        type: String,
        default: 'add'
    }
})

const submit = (tag,autoCreateService) => {
    console.log("tag: ", tag)
    console.log("item: ", useItemer.item)
    useItemer.item['apiVersion'] = 'apps/v1'
    useItemer.item['kind'] = 'Deployment'
    const data = {
        clusterId: useItemer.clusterId,
        namespace: useItemer.namespace,
        item: useItemer.item,
        autoCreateService
    }
    if(props.method !== 'update'){
        addApi(data).then((Response) => {
            ElMessage({
                type:'success',
                message:Response.message,
                })
            })
    }else{
        updateApi(data).then((Response) => {
            ElMessage({
                type:'success',
                message:Response.message,
            })
        })
    }
}


</script>

<template>
    <ScheduleFrame @submit="submit"></ScheduleFrame>
</template>

<style scoped>

</style>