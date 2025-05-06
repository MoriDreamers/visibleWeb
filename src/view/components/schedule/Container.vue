<script setup>
import { reactive,defineProps,ref } from 'vue';
import { useItem } from './../../../store/index.js'
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { toRefs } from 'vue';
import { ElMessage } from 'element-plus';

//拿到pinia的全局状态管理 
const useItemer = useItem()
const { item } = storeToRefs(useItem());
const props = defineProps({
    containerType: {
        type: String,
        default: 'contianer'
        //调用初始化模块使用参数init
    }
})

const containerNum = ref(0)
const data = reactive({
    containers:[],
    container:{
        name: `${props.containerType}${containerNum.value}`,
        image: 'nginx:latest',
    }
})

const editableTabsValue = ref(0);
const removeTab = (targetName) => {
    console.log(targetName)
    if (data.containers.length === 1 && props.containerType === 'contianer') {
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
    if (props.containerType !== 'contianer'){
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
const {containers,initContainers} = toRefs(data)

const activeName = ref('basic');

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
            :key="item.name"
            :label="item.name"
            :name="index"
            >


            <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
                <el-tab-pane label="基本配置" name="basic">
                    
                </el-tab-pane>
                <el-tab-pane label="端口配置" name="ports">
                    Config
                    </el-tab-pane>
                <el-tab-pane label="健康检查" name="healthcheck">
                    Role
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