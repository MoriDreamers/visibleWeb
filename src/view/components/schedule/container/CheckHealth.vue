<script setup>
//deployment容器的健康检查模块
import { onBeforeMount } from 'vue'
import Probe from './Probe.vue'
const props = defineProps({
    container: {
        type: Object,
    }
})

onBeforeMount(() => {
    //检查字段是否完整 没有就加上
    if(!props.container.hasOwnProperty('startupProbe')){
        props.container.startupProbe = {
        }
    }
})



</script>

<template>
    <Probe probeType="StartupProbe" name="启动探针" :probe="props.container.startupProbe" @propChangeRollBack="(value) => {props.container.startupProbe = value}"/>

    <Probe probeType="LivenessProbe" name="存活探针" :probe="props.container.livenessProbe" @propChangeRollBack="(value) => {props.container.livenessProbe = value}"/>
    <Probe probeType="ReadinessProbe" name="就绪探针" :probe="props.container.readinessProbe" @propChangeRollBack="(value) => {props.container.readinessProbe = value}"/>

</template>

<style scoped>

</style>

