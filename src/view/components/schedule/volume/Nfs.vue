<script setup>
import { ref, reactive,inject } from 'vue'
import { ElMessage } from 'element-plus'
import { useItem } from '../../../../store/index.js'
import { storeToRefs } from 'pinia';
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


const data = reactive({
    newVolumeConfig: {
        name: "",
        nfs: {
            server:"",
            path: "",
            readonly: false,
        },
    },
})


const rules = {
  name: [
    { required: true, message: '请输入Volume名称', trigger: 'blur' },
  ],
  'nfs.path': [
    { required: true, message: '请输入nfs路径', trigger: 'blur' },
    { pattern: /^\/.*/, message: '路径必须以 / 开头', trigger: 'blur' },
  ],
  'nfs.server': [
    { required: true, message: '请输入NFS地址', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._-]+$/, message: 'NFS地址只能包含字母、数字、点、下划线、减号', trigger: 'blur' },
  ]
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

//订阅关闭弹窗的数据
const closeDiaglog = inject('closeDiaglog')


</script>

<template>
    <el-form 
        ref="formRef"
        :model="data.newVolumeConfig"
        :rules="rules"
    >

                <el-form-item label="Volume名称" prop="name">
                    <el-input v-model.trim="data.newVolumeConfig.name" placeholder="请输入Volume名称"></el-input>
                </el-form-item>



                <el-form-item label="NFS路径" prop="nfs.path">
                    <el-input v-model.trim="data.newVolumeConfig.nfs.path" placeholder="输入的内容必须以 / 开头"/>
                  </el-form-item>
                  
                  <el-form-item label="NFS地址" prop="nfs.server">
                    <el-input v-model.trim="data.newVolumeConfig.nfs.server" placeholder="输入的内容只能包含字母、数字、点、下划线、减号" />
                  </el-form-item>

                  <el-form-item label="只读模式" prop="nfs.readOnly">
                    <el-switch v-model="data.newVolumeConfig.nfs.readonly"></el-switch>
                  </el-form-item>
                  


        <div>
            <el-button v-if="method === 'add'" type="primary" @click="submitItem">添加</el-button>
        </div>
    </el-form>
</template>

<style scoped> 
</style>
