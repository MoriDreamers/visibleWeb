<script setup>
import { reactive,ref,markRaw } from 'vue';
//import { getUserListApi,getUserDeleteApi } from '../../api/user';
import { getClusterListApi as getListApi,deleteClusterApi as deleteApi,getClusterApi as getApi} from '../../api/cluster.js';
import { toRefs } from 'vue';
import { onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox, scrollbarProps } from 'element-plus';
import { CircleCheck,Check, Close } from '@element-plus/icons-vue'
import AddUser from './Add.vue';


const defaultMethod = ref("add")

//自定义加载动画，专门留空的几行用于定义动画

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
        `
        
const loading = ref(true)

const data = reactive({
    items:[],
    itemForm:{
      id:"",
      displayName:"",
      city:"",
      district:"",
      kubeconfig:"",
    },
})
const getListItem = () => {
  loading.value = true;
  getListApi()
        .then((Response) => {
            data.items = Response.data.items;
        })
        .catch((error) => {
            console.error("加载失败:", error);
            ElMessage.error("加载数据失败");
        })
        .finally(() => {
            loading.value = false; // 确保无论如何都会关闭加载
        });
}
//把items从data中解构出来
const {items,itemForm} = toRefs(data)
//生命周期的知识点，onBeforeMount是vue3.0新增的生命周期，在组件挂载之前执行
onBeforeMount(()=>{getListItem()})

const deleteItem = (info) => {
    //console.log("当前数据",info)
    ElMessageBox.confirm(
    '正在尝试删除集群'+info.id+'，是否继续？',
    '请注意',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      icon: markRaw(CircleCheck),
    }
  )  .then(() => {
    loading.value = true;
    deleteApi(info.id).then((Response)=>{
        //调试用：console.log(Response.data.items);
      ElMessage({
        type:'success',
        message:Response.message,
      })
      getListItem() //这里面包含了 loading.value = false;
    })

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消操作',
      })
    })
    
}

const addUserDiag = ref(false)
//添加
const addItem = () =>{
  defaultMethod.value = "add"
  addUserDiag.value = true
  data.itemForm = {}
}
//修改
const edit = (id) =>{
  addUserDiag.value = true
  //获取需要修改的ID集群详情
  defaultMethod.value = "modify"
  getApi(id).then((Response)=>{
    data.itemForm = Response.data.item
    })
    .catch(()=>{
    return
    })
    
  console.log("修改的ID",id)
}

const closeDiag = () => {
  addUserDiag.value = false
  getListItem()
}
</script>

<template>

    <div class="mb-4" style="text-align: left;">
        <el-button @click= "addItem" :text="true" style="  text-shadow: #00000069 1px 1px 1px;">添加集群</el-button>
      </div>
      
    <el-table 
    stripe  
    :data="items" 
    style="width: 100%" 
    v-loading="loading"  

    element-loading-text="一二三睦头人..."
    :element-loading-svg="svg"
    class="custom-loading-svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
   >

      <el-table-column fixed prop="id" label="集群唯一ID" width="150" >
              <template #default="scope">
                <RouterLink v-if="scope.row.clusterStatus === 'Active'" :to="{path:'/cluster/detail',query:{'clusterId':scope.row.id}}">
                  {{ scope.row.id }}
                </RouterLink>
                <span v-else style="color: red;">{{ scope.row.id }}</span>
              </template>
            </el-table-column>

        <el-table-column prop="displayName" label="集群昵称" width="150" /> 

        <el-table-column prop="	" label="集群位置" width="230">
            <template #default="scope">
                  {{ scope.row.city }} - {{ scope.row.district }}
              </template>
        </el-table-column>

        <el-table-column sortable prop="" label="状态" width="80" >
          <template #default="scope">
              <el-icon v-if="scope.row.clusterStatus === 'Active'" color="green"><Check /></el-icon>
              <el-icon v-if="scope.row.clusterStatus === 'Inactive'" color="red"><Close /></el-icon>
          </template>
        </el-table-column>   

        <el-table-column align="center" sortable prop="clusterVersion" label="集群版本" width="120" />

        <el-table-column fixed="right"  align="center" label="Operations" min-width="103">
          <template #default="scope">
            <el-button :disabled="scope.row.clusterStatus !== 'Active'" link type="warning" size="small" @click="edit(scope.row.id)">编辑</el-button>
            <el-button @click="deleteItem(scope.row)" link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog destroy-on-close v-model="addUserDiag" title="集群操作" width="500" >
          <AddUser :itemForm="itemForm" :method="defaultMethod" @refresh="closeDiag" ></AddUser>
      </el-dialog>

</template>

<style scoped>


</style>