<script setup>
  import { toRefs,reactive,ref } from 'vue';
  import {getUserAddApi,getUserModifyApi} from '../../api/user.js'
  import { ElMessage,ElNotification } from 'element-plus'
  import { onBeforeMount } from 'vue';

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
      userForm:{
        type:Object,
      },
  })

    //修改为在主组件中通过 props 接收 userForm 对象
    const data = reactive({
    userForm:{
      username:"",
      qq:"",
      address:""
    }
  })

  const emits = defineEmits(['refresh'])
//清空表单
  const clearForm = () => {
  userFormRef.value.resetFields()
}
const {userForm} = toRefs(data)
//userFormRef 被用来引用 <el-form> 组件。这样做是为了能够在 JavaScript 中访问和操作这个表单组件
const userFormRef = ref()

const loading = ref(false)
onBeforeMount(()=>{
  //这种方法会带动父组件修改 data.userForm = props.userForm
  //对象转字符串
  const jsonString = JSON.stringify(props.userForm)
  //字符串转对象 此时就是新的对象
  data.userForm = JSON.parse(jsonString)
})


const submitForm = () => {

  userFormRef.value.validate((valid) => {
    if(valid){
            loading.value = true;
        if (props.method == "add" ){
          getUserAddApi(data.userForm).then((Response) => {
          ElMessage({
              type:'success',
              message:Response.message,
            })
            loading.value = false;
            emits('refresh')
        })
        }else {
          getUserModifyApi(data.userForm).then((Response) => {
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
  username: [
    { required: true, message: '请输入用户名 ', trigger: 'blur',  },
    { min: 1, max: 20, message: '至少一个字符', trigger: 'blur' },
  ],
  qq: [
    { required: true, message: '请输入QQ', trigger: 'blur' },
    { min: 5, max: 20, message: '长度太短了！', trigger: 'blur' },
  ],
  address:[{required:false,message:'请输入地址',trigger:'blur'},]
});
</script>

<template>
  <el-form ref="userFormRef" :model="userForm" v-loading="loading" :rules="rules"> 
    <el-form-item label="姓名" label-width="60" prop="username" class="form">
      <el-input v-model="userForm.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="QQ" label-width="60" prop="qq" class="form">
      <el-input v-model="userForm.qq" autocomplete="off" />
    </el-form-item>
    <el-form-item label="地址" label-width="60" prop="address" class="form">
      <el-input v-model="userForm.address" autocomplete="off" />
      </el-form-item>
  </el-form>
  <div class="btn">
    <el-button @click="clearForm"> 
      {{ props.method == "modify"? "还原" : "清空" }}
    </el-button>
    <el-button type="primary" @click="submitForm" >
      {{ props.method == "add"? "增加" : "修改" }}
    </el-button>
  </div>
</template>

<style scoped>
  .btn {
    display: flex;
    justify-content: space-between;
  }
  .form{
    
    width: 440px;
    margin:  10 auto;
  }
</style>