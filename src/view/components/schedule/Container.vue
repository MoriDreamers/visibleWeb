<script setup>
import { reactive,defineProps,ref } from 'vue';
import { useItem } from './../../../store/index.js'
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import StringToList from './../StringToList.vue'
import Port from './container/Port.vue'
import CheckHealth from './container/CheckHealth.vue'

//拿到pinia的全局状态管理 
const useItemer = useItem()
const { item } = storeToRefs(useItem());
const props = defineProps({
    containerType: {
        type: String,
        default: 'container'
        //调用初始化模块使用参数init

    }
})

const containerNum = ref(0)
const data = reactive({
    containers:[],
    container:{
        name: `${props.containerType}${containerNum.value}`,
        image: '',
        tty: false,
        workingDir: '',
        // 镜像下载策略
        imagePullPolicy:"IfNotPresent",
        resources:{
            limits:{},
            requests:{},
        },
        ports:[],
    },
    options:{
        imagePullPolicyList:[
            { value: 'IfNotPresent', label: '未找到就拉取' },
            { value: 'Always', label: '总是' },
            { value: 'Never', label: '从不' },
        ]
    }
})

const editableTabsValue = ref(0);
const removeTab = (targetName) => {
    console.log(targetName)
    if (data.containers.length === 1 && props.containerType === 'container') {
        ElMessage({
    showClose: true,
    message: '请至少保留一个容器！！',
    type: 'warning',
    });
        return;
    }else if (targetName == editableTabsValue.value) {
    editableTabsValue.value = 0;
    }else if (targetName < editableTabsValue.value) {
    editableTabsValue.value = editableTabsValue.value - 1;
    }
    //从data中删除容器数据
    data.containers.splice(targetName, 1);
};


onBeforeMount(() => {
    if (props.containerType !== 'container'){
        data.containers = useItemer.item.spec.template.spec.initContainers
    }else{
        data.containers = useItemer.item.spec.template.spec.containers
    }
        containerNum.value = data.containers.length
              if (data.containers.length === 0){
                addTab()
        }
})

const addTab = () => {
    //增加容器 逻辑是：复制当前容器，并修改名称
    containerNum.value = containerNum.value + 1
    const containerName = `${props.containerType}${containerNum.value}`
    const newContainer = JSON.parse(JSON.stringify(data.container))
    newContainer.name = containerName
    data.containers.push(newContainer)
    //焦点聚焦 命名是按照顺序的+1+1+1 就算删除了还是按照最后一个加1命名 为了解决这个问题
    // 这里设置了默认焦点在data的containers的最后一个索引
    editableTabsValue.value = data.containers.length - 1
}
const {containers, options} = toRefs(data)

const activeName = ref('basic');

const seleteChanged = (value) => {
    console.log('镜像下载策略已更改为:', value)
}

</script>

<template>

    <div style="display: flex;justify-content: flex-start;margin-bottom: 13px;">
        <el-button size="small" @click="addTab(editableTabsValue)" >
          点击此处添加新的{{props.containerType}}
        </el-button>
      </div>

    <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
        closable
        @tab-remove="removeTab"
        >
        <el-tab-pane
            v-for="(item, index) in containers"
            :key="index"
            :label="item.name"
            :name="index"
            >


            <el-tabs v-model="activeName" tab-position="left">
                <el-tab-pane label="基本配置" name="basic">
                  <div>
                    <el-row :gutter="20" justify="space-between">
                        <el-col :span="8">
                            <!-- 因为实际上rlus检测的是item表单这个，所以要使用required 就需要这样写
                            prop="('spec.template.spec.containers.'+index+'.name')"
                            -->
                            <el-form-item label="容器名称" prop="item.name" >
                                <el-input v-model.trim="item.name" placeholder="请输入容器名称"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="是否绑定终端（创建一个终端让容器不会自动关闭）" prop="item.tty" >
                                <el-switch v-model="item.tty" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用"></el-switch>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="8">
                            <el-form-item label="自定义工作目录" prop="item.workingDir" >
                                <el-input v-model.trim="item.workingDir"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" justify="space-between">
                        <el-col :span="16">
                            <el-form-item label="镜像地址" prop="item.image" >
                                <el-input v-model.trim="item.image" placeholder="请输入镜像地址"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="镜像下载策略" prop="item.imagePullPolicy" >
                                <el-select
                                    v-model="item.imagePullPolicy"
                                    placeholder="选择镜像下载"
                                    @change="seleteChanged"
                                >
                                    <el-option
                                    v-for="s in options.imagePullPolicyList"
                                    :key="s.value"
                                    :label="s.label"
                                    :value="s.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" justify="space-between">
                        <el-col :span="12">
                            <el-form-item label="启动命令" prop="item.command">
                                <StringToList v-model:data="item.command" placeholder="请输入启动命令，以回车分隔（EnteyPoint）"></StringToList>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="启动参数" prop="item.args" >
                                <StringToList v-model:data="item.args" placeholder="请输入启动参数，以回车分隔（CMD）"></StringToList>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" justify="space-between">
                        <el-col :span="6">
                            <el-form-item label="最小内存" prop="item.resources.requests.memory">
                                <el-input v-model.trim="item.resources.requests.memory" placeholder="格式：1024m"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="最大内存" prop="item.resources.limits.memory" >
                                <el-input v-model.trim="item.resources.limits.memory" placeholder="格式：2048m"></el-input>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="6">
                            <el-form-item label="最小CPU" prop="item.resources.requests.cpu" >
                                <el-input v-model.trim="item.resources.requests.cpu" placeholder="格式：100m"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="最大CPU" prop="item.resourse.limits.cpu" >
                                <el-input v-model.trim="item.resources.limits.cpu" placeholder="格式：1000m (1核)"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="端口配置" name="ports">
                    <Port :ports="item.ports"> </Port>
                    </el-tab-pane>
                <el-tab-pane label="健康检查" name="healthcheck">
                    <CheckHealth :container="item"></CheckHealth>
                </el-tab-pane>
                <el-tab-pane label="环境变量" name="env">
                    Task
                </el-tab-pane>
                <el-tab-pane label="存储配置" name="volume">
                    Task
                </el-tab-pane>
                <el-tab-pane label="生命周期" name="life">
                    Task
                </el-tab-pane>
              </el-tabs>

        </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>