<script setup>
  import { toRefs,reactive,ref } from 'vue';
  import { ElMessage,ElNotification } from 'element-plus'
  import { watch } from 'vue';
  import { updateNodeListApi } from '../../api/cluster.js';

  const waringBox = () => {
    ElNotification({
    title: '请检查输入的数据！',
    message: '校验不通过',
    type: 'warning',
  })
};


    //修改为在主组件中通过 props 接收 itemForm 对象
  const data = reactive({
      itemForm:{
    }
  })

  const props = defineProps({
    itemForm:{
      type:Object
    }
  })

  const emits = defineEmits(['refresh'])

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
    loading.value = true;
    updateNodeListApi(data.itemForm).then((Response) => {
      ElMessage({
        type: 'success',
        message: Response.message,
      });
      loading.value = false;
      emits('refresh');
    });
  });
};
</script>

<template>
 
  <el-form 
    label-width="140px"    
    ref="itemFormRef" 
    :model="itemForm" 
    >

        <span style="display: block; margin-top:20px;" class="btn">

            <el-button @click="submitForm()" type="primary">
               更新 
            </el-button>
        </span>

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

</style scoped>