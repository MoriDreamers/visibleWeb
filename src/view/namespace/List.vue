<script setup>
import { reactive,ref } from 'vue';
import { getClusterListApi} from '../../api/cluster.js';
import { getNameSpaceListApi as getListApi,addNameSpaceApi as addItemApi ,deleteNameSpaceApi as deleteItemApi} from '../../api/namespace.js';
import { ElMessage, } from 'element-plus'
import { toRefs } from 'vue';
import { onBeforeMount } from 'vue';
import { Check, Close } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
/* import Edit from './Edit.vue';
import Detail from './Detail.vue'; */
import List  from '../components/List.vue'
import ClusterAndNamespaceSelector  from '../components/ClusterAndNamespaceSelector.vue'
//getListItem（clusterId）方法用于获取指定集群的节点列表
//getClusterList方法用于获取集群列表


        


const value1 = ref(false)

const editDialog = ref(false)

const detailDialog = ref(false)

const route = useRoute()

const data = reactive({
    items: [],
    clusterList: [],
    clusterId: "",
    editItem: {},
    editName: "",
    deleteItem: {},
    deleteName: "",
})

const getListItem = (clusterId) => {

    getListApi(clusterId).then((Response)=>{
        //调试用：console.log(Response.data.items);
        data.items = Response.data.items;
        //我们查询的指定集群的node列表放到了data.items中，然后绑定到表格上最后渲染出来

    })
}
 
// 新增命名空间弹窗
const createDialog = ref(false)
const submitCreate = () => {

  console.log("提交创建：",data.editName)
  addItemApi(data.clusterId,data.editName).then((Response)=>{
    ElMessage({
              type:'success',
              message:Response.message,
            })
    })  
    createDialog.value = false
    getListItem(data.clusterId)

}
const crate = () => {
  createDialog.value = true
}
//删除命名空间弹窗

const deleteDialog = ref(false)

const deleteHandle = (row) => {
  console.log("删除ns",row)
  deleteDialog.value = true
  data.deleteItem = row
  data.deleteName = row.metadata.name

}

const submitDelete = () => {
  console.log("提交删除：",data.deleteName)
  deleteItemApi(data.clusterId,data.deleteName).then((Response)=>{
    ElMessage({
              type:'success',
              message:Response.message+" 请等待几秒",
            })
    })  
    deleteDialog.value = false
    getListItem(data.clusterId)
    setTimeout(() => {
    getListItem(data.clusterId)
  }, 2000)
  setTimeout(() => {
    getListItem(data.clusterId)
  }, 6000)
}
/* const edit = (row) =>{
    console.log("编辑NS：",row)
    data.editItem = row
    data.editName = row.metadata.name
    editDialog.value = true
}

const detail = (row) =>{
    console.log("查看NS详情：",row)
    data.detailItem = row
    data.detailName = row.metadata.name
    detailDialog.value = true
} */

/* 搜索功能
const search = ref("")

const filterTableData = computed(() =>
  data.items.filter(
    (item) =>
      !search.value ||
      item.metadata.name.toLowerCase().includes(search.value.toLowerCase()) || 
      item.status.addresses[0].address.toLowerCase().includes(search.value.toLowerCase()) 
  )
)
 */
// 异步转成同步
const getClusterList = async() => {
    await getClusterListApi().then(
        (res) => {
            data.clusterList = res.data.items
        }

    )

  }
onBeforeMount(async()=>{
    // 1、查询集群列表
    // 2、如果没有指定则使用默认值进行获取集群列表
    // 3、如果指定了集群，就直接查询当前集群的节点列表
    // 4、切换了集群之后应重新获取集群的列表
    // 5、集群不可用，则不可选

    await getClusterList()
    const defaultClusterSelected = data.clusterList[0].id
    // 获取当前请求是否携带了集群ID的参数
    const nowClusterId = route.query.clusterId
    data.clusterId = nowClusterId ? nowClusterId : defaultClusterSelected

    getListItem(data.clusterId)
    //调试用 console.log("data内容：",data)
})

//解构参数以便于使用
const { clusterId, clusterList, editItem, editName,detailItem,detailName,deleteName } = toRefs(data)

</script>

<template>

  
  <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
    <span class="btn01" style="font-weight: bold;color:#000000c9;font-size: 16px;" @click= "crate" >添加命名空间</span>
        <div style="width: 150px;">
            <el-select v-model="clusterId" placeholder="选择集群" @change="getListItem(clusterId)">
                <el-option v-for="item in clusterList"
                :key="item.id"
                :label="item.id"
                :value="item.id"
                :disabled="item.status == 'InActive'"
                />
            </el-select>
          </div>
       <!-- 搜索功能 <el-input v-model="search" size="small" placeholder="搜索" style="width: 200px;margin-left:20px;height:32px;"  /> -->
    </div>
    <el-table 
    stripe  
    :data="data.items" 
    style="width: 100%" 

   >
      
      <el-table-column fixed prop="" label="名称" width="150" >
              <template #default="scope">
                <!-- <el-button link type="primary" @click="detail(scope.row)">{{ scope.row.metadata.name }}</el-button> -->
                <span>{{ scope.row.metadata.name }}</span>
              </template>
            </el-table-column>

        <el-table-column prop="metadata.creationTimestamp" label="创建时间" width="200" sortable /> 

        <el-table-column align="center" sortable prop="" label="状态" width="80" >
          <template #default="scope">
            <el-icon v-if="scope.row.status.phase === 'Active'" color="green"><Check /></el-icon>
              <el-icon v-else color="red"><Close /></el-icon>
          </template>
        </el-table-column>   

        <el-table-column fixed="right" align="center" label="Operations" min-width="103">
          <template #default="scope">
            <!-- row传递时包含完整的对象信息，即后端返回的list对应的list[row],的对象信息，包括metadata、status等，可以直接使用，不需要再次请求API -->
            <el-button :disabled="scope.row.clusterStatus == ''" link type="danger"  @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

     <!--  表格点击行 → 设置 data.editItem → 传递给子组件的 itemForm -->

<!--       <el-dialog destroy-on-close v-model="editDialog" :title="'正在编辑集群:  ' + clusterId +'    &    节点:  ' + editName" width=70% >
          <Edit :itemForm="editItem" :clusterId="data.clusterId" @refresh="getListItem(clusterId)" ></Edit>
      </el-dialog>

      <el-dialog destroy-on-close v-model="detailDialog" :title="'集群:  ' + clusterId +'    &    节点:  ' + detailName" width=70% >
        <Detail :item="detailItem" ></Detail>
    </el-dialog>
 -->
    <el-dialog destroy-on-close v-model="createDialog" :title="'添加命名空间'" width=900px >
      <el-input placeholder="请输入命名空间名称" v-model="editName"></el-input>
      <List title="测试">
        <template #headerOptins>
          <ClusterAndNamespaceSelector @namespaceChangedRollback="getListItem(clusterId)"></ClusterAndNamespaceSelector>
        </template>
      </List>
      <el-button type="primary" @click="submitCreate" style="margin-top: 10px;">创建</el-button>
  </el-dialog>

  <el-dialog destroy-on-close v-model="deleteDialog" :title="'⚠ 高危操作'" width=400px >
    <el-input placeholder="请确认要删除的命名空间名称" v-model="deleteName"></el-input>
    <el-button type="primary" @click="submitDelete" style="margin-top: 10px;" >确认删除</el-button>
</el-dialog>

</template>

<style scoped>

.btn01 {
  position: relative;
  display: inline-block;
  color: black;
  animation: fadeFlash 1.2s infinite alternate ease-in-out;
}

@keyframes fadeFlash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.btn01::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.1s ease;
}

.btn01:hover::after {
  width: 100%;
}
</style>