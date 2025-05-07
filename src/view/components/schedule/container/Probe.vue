<script setup>
//deployment容器的健康检查模块
import { ref, reactive,markRaw } from 'vue';
import Exec from './ProbeAction/Exec.vue'
import TcpSocket from './ProbeAction/TcpSocket.vue'
import HttpGet from './ProbeAction/HttpGet.vue'
import Grpc from './ProbeAction/Grpc.vue'

const props = defineProps({
    name: {
        type: String,
        default: '开启探针（StartupProbe）'
    },
    probeType: {
        type: String,
        default: 'StartupProbe'
    },
    probe: {
        type: Object,
        default: () => ({})
    }
})

const probeBasicConfig = reactive({
        initialDelaySeconds: 15,
        periodSeconds: 10,
        timeoutSeconds: 2,
        successThreshold: 1,
        failureThreshold: 3,
    })

const data = reactive({

    options: {
        probeConfig:{
            exec:{
                command:[],
            },
            httpGet:{
                path:'/',
                port:8080,
                host:'',
                scheme:'HTTP',
                httpHeaders:[],
            },
            tcpSocket:{
                port:8080,
                host:'',//int OR string
            },
            grpc:{
                port:8080,
                service:'',
            },
        },
        selectType: "close",
        probeHandlerTypeList: [
            { value: 'exec', label: '执行命令' },
            { value: 'httpGet', label: 'HTTP请求' },
            { value: 'tcpSocket', label: 'TCP连接' },
            { value: 'grpc', label: 'gRPC' },
            { value: 'close', label: '不使用探针' },
        ],
        probeActionComponentList: {
            exec: markRaw(Exec),
            httpGet: markRaw(HttpGet),
            tcpSocket: markRaw(TcpSocket),
            grpc: markRaw(Grpc),
        }
    }
})

const emits = defineEmits(['propChangeRollBack'])

const changeProbeHandlerType = () => {
    console.log('当前选择的探针类型（调试用）：',data.options.selectType)
    //清空当前配置
    //VUE3的特性 不能直接用这个 要使用响应式更新的reflect！！！ probeBasicConfig = {}
    Reflect.deleteProperty(probeBasicConfig, 'exec')
    Reflect.deleteProperty(probeBasicConfig, 'httpGet')
    Reflect.deleteProperty(probeBasicConfig, 'tcpSocket')
    Reflect.deleteProperty(probeBasicConfig, 'grpc')
    //按照不同组件类型，选择不同的配置
    //close则清空当前配置 其他的就把组合后的配置文件返回给父组件
    if (data.options.selectType === 'close') {
        emits('propChangeRollBack', {})
    }else {
        probeBasicConfig[data.options.selectType] = data.options.probeConfig[data.options.selectType]
        emits('propChangeRollBack', probeBasicConfig)
    }
}
</script>

<template>
    <div class="probe-container">
        <div style="display: flex;justify-content: space-between;align-items: center;margin: 10px 0;">
            <span style="font-size: 14px;font-weight: bold">{{ props.name }}</span>
            <span style="width: 200px;"> 
                <el-select 
                    v-model="data.options.selectType" 
                    placeholder="请选择探针类型" 
                    style="width: 100%;"
                    @change="changeProbeHandlerType"
                >
                    <el-option v-for="item in data.options.probeHandlerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </span>
        </div>
        <div v-if="data.options.selectType !== 'close'" class="probe-settings">
            <el-form :model="probeBasicConfig">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="延迟时间">
                            <el-input-number v-model="probeBasicConfig.initialDelaySeconds" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检查周期">
                            <el-input-number v-model="probeBasicConfig.periodSeconds" :min="1" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="超时时间">
                            <el-input-number v-model="probeBasicConfig.timeoutSeconds" :min="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成功阈值">
                            <el-input-number v-model="probeBasicConfig.successThreshold" :min="1" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="失败阈值">
                            <el-input-number v-model="probeBasicConfig.failureThreshold" :min="1" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <component :probe-config="probeBasicConfig" v-if="data.options.selectType !== 'close'" :is="data.options.probeActionComponentList[data.options.selectType]" />
        <hr class="divider"/>
    </div>
</template>

<style scoped>
.probe-container {
    padding: 10px;
}

.probe-settings {
    margin: 15px 0;
}

:deep(.el-select) {
    width: 100%;
}

:deep(.el-input__wrapper) {
    padding: 0 8px;
}

:deep(.el-input__inner) {
    height: 32px;
    line-height: 32px;
}

:deep(.el-select .el-input__wrapper) {
    padding: 0 8px;
}

.divider {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 10px 0;
}

:deep(.el-form-item) {
    margin-bottom: 15px;
}

:deep(.el-input-number) {
    width: 100%;
}
</style>

