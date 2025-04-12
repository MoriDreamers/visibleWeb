<script setup>
  import { toRefs,reactive,ref } from 'vue';
  import { ElMessage,ElNotification } from 'element-plus'
  import { watch } from 'vue';
import { addClusterApi, updateClusterApi } from '../../api/cluster';

  const waringBox = () => {
    ElNotification({
    title: '请检查输入的数据！',
    message: '校验不通过',
    type: 'warning',
  })
};

  const props = defineProps({
    method:{
      type:String,
      default: "add"
    },
    itemForm:{
      id:"",
      displayName:"",
      city:"",
      district:"",
      kubeconfig:"",  
    },
  })

    //修改为在主组件中通过 props 接收 itemForm 对象
  const data = reactive({
      itemForm:{
      id:"",
      displayName:"",
      city:"",
      district:"",
      kubeconfig:"",
    },
  })

  const emits = defineEmits(['refresh'])
//清空表单
  const clearForm = () => {
  itemFormRef.value.resetFields()
}
const {itemForm} = toRefs(data)
//itemFormRef 被用来引用 <el-form> 组件。这样做是为了能够在 JavaScript 中访问和操作这个表单组件
const itemFormRef = ref()

const loading = ref(false)


//父级组件通过 props 接收 itemForm 对象，并赋值给 data.itemForm，利用watch监听 props.itemForm 的变化，同步到 data.itemForm 中
watch(() => props.itemForm, (newVal) => {
  Object.assign(data.itemForm, newVal)
}, { immediate: true })

const submitForm = () => {

  itemFormRef.value.validate((valid) => {
    if(valid){
            loading.value = true;
        if (props.method == "add" ){
          addClusterApi(data.itemForm).then((Response) => {
          ElMessage({
              type:'success',
              message:Response.message,
            })
            loading.value = false;
            emits('refresh')
        })
        }else {
          updateClusterApi(data.itemForm).then((Response) => {
          ElMessage({
              type:'success',
              message:Response.message,
            })
            loading.value = false;
            emits('refresh')
        })
        }
    } else{
      waringBox()
    }
  })
 
}

const rules = reactive({
  id: [
    { required: true, message: '请输入集群ID', trigger: 'blur' },
  ],
  displayName: [
    { required: true, message: '请输入集群名', trigger: 'blur' },
  ],
  city: [
    { required: false, message: '请输入城市位置', trigger: 'blur' },
  ],
  kubeconfig: [
    { required: true, message: '请输入kubeconfig', trigger: 'blur' },
  ],
})
</script>

<template>
 
  <el-form label-width="140px"  :rules="rules" ref="itemFormRef" :model="itemForm" >
    <div class="cluster-info">
    <div>
        <el-form-item class="form-item" prop="id" label="集群唯一的ID" required >
         <el-input placeholder="请输入集群ID" v-model="itemForm.id" autocomplete="off" :disabled="props.method=='modify'" />
        </el-form-item>
        <el-form-item class="form-item" prop="displayName" label="集群自定义名" required>
            <el-input  placeholder="请输入集群名称" v-model="itemForm.displayName" autocomplete="off" />
        </el-form-item>
        <el-form-item class="form-item" label="集群所在位置">
            <el-col :span="12">
                <el-form-item  prop="city">
                    <el-input placeholder="城市" v-model="itemForm.city" autocomplete="off" />
                </el-form-item>
            </el-col>
            <el-col :span="2" >-</el-col>
            <el-col :span="10">
                <el-form-item  prop="district">
                    <el-input placeholder="区" v-model="itemForm.district" autocomplete="off" />
                </el-form-item>
            </el-col>
        </el-form-item>
    </div>
    <div>
        <el-form-item class="form-item" prop="kubeconfig"  style="width:400px;" label-width="40px">
            <el-input placeholder="请输入kubeconfig"  type="textarea" :rows="10" v-model="itemForm.kubeconfig" autocomplete="off" />
        </el-form-item>
        <span style="display: block; margin-top:20px;" class="btn">
            <el-button @click="clearForm()">清空</el-button>
            <el-button @click="submitForm()" type="primary">
            {{ props.method=="add"?"添加":"更新" }}
            </el-button>
        </span>
    </div>

</div>
    </el-form>
</template>

<style scoped>


.form-item{
    width: 400px;
    margin: 20px auto;
}
.cluster-info {
    flex-direction: row;
}

</style>