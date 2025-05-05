<script setup>
import { ref, reactive,inject } from 'vue'
import { ElMessage } from 'element-plus'
import { useItem } from '../../../../store/index.js'
import { storeToRefs } from 'pinia';
import StringAndNumberSupport from './../../StringAndNumberSupport.vue';
import { onMounted } from 'vue';



const formRef = ref()
const props = defineProps({
    volumeConfig: {
        type: Object,
        default: {}
    },method:{
        type:String,
        default:'add'
    } 
})

const useItemer = useItem()

//挂载前赋值过去配置，再次修改按照组件还是实时绑定到全局变量。所以不用修改
onMounted(() => {
    if (props.method === 'update') {
        //如果不做深拷贝，它是通过引用传递的，这俩会指向一个对象，也就是说修改其中一个会影响另一个
        //具体来说 父组件通过全局变量读入一个row，传给子组件
        //子组件读取row并且绑定到data.newVolumeConfig
        //这俩实际上还是一个对象 所以修改data.newVolumeConfig会影响到父组件的row
        //这是不做深拷贝的引用传递导致的，但同时也提供了修改全局变量的可能
        data.newVolumeConfig = props.volumeConfig
    }
})

const data = reactive({
    newVolumeConfig: {
        name: "",
        emptyDir: {
            sizeLimit: 0 ,
            type: "",
        },
    },
    typeList: [
        { label: "默认", value: "" },
        { label: "内存类型", value: "Memory" },    ]
})


const rules = {
  name: [
    { required: true, message: '请输入Volume名称', trigger: 'blur' },
  ],
}

const submitItem = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            console.log('提交数据：', data.newVolumeConfig)
            if (useItemer.item.spec.template.spec.volumes === undefined){
                useItemer.item.spec.template.spec.volumes = []
            }
            for (let i = 0; i < useItemer.item.spec.template.spec.volumes.length; i++) {
                if (useItemer.item.spec.template.spec.volumes[i].name === data.newVolumeConfig.name) {
                    //名称重复是不被允许的
                    ElMessage.error('Volume名称重复，请修改名称！')
                    return
                }
            }
            //深拷贝修复传入响应式对象问题
            const newVolume = JSON.parse(JSON.stringify(data.newVolumeConfig))
            useItemer.item.spec.template.spec.volumes.push(newVolume)
            ElMessage.success('保存成功！')
            closeDiaglog()
        } else {
            ElMessage.error('请检查输入项！')
        }
    })
}

//订阅关闭弹窗的数据
const closeDiaglog = inject('closeDiaglog')


</script>

<template>
    <el-form 
        ref="formRef"
        :model="data.newVolumeConfig"
        :rules="rules"
    >
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="Volume名称" prop="name">
                    <el-input v-model.trim="data.newVolumeConfig.name" placeholder="请输入Deployment名称"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="限制大小" prop="emptyDir.path">
                    <StringAndNumberSupport  v-model="data.newVolumeConfig.emptyDir.sizeLimit" placeholder="请输入限制大小"></StringAndNumberSupport>
                </el-form-item>
            </el-col>
        </el-row>


        <el-form-item label="* 挂载类型" prop="emptyDir.type">
                <el-select
                v-model="data.newVolumeConfig.emptyDir.type"
                placeholder="选择挂载类型"
            >
                <el-option
                    v-for="s in data.typeList"
                    :key="s.value"
                    :label="s.label"
                    :value="s.value"
                />
            </el-select>
        </el-form-item>

        <div>
            <el-button v-if="method === 'add'" type="primary" @click="submitItem">添加</el-button>
        </div>
    </el-form>
</template>

<style scoped> 
</style>
