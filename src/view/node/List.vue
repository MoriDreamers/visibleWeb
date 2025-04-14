<script setup>
import { reactive,ref } from 'vue';
import { getClusterListApi, getNodeListApi as getListApi} from '../../api/cluster.js';
import { toRefs } from 'vue';
import { onBeforeMount } from 'vue';
import { Check, Close } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import Edit from './Edit.vue';
import Detail from './Detail.vue';
//getListItem（clusterId）方法用于获取指定集群的节点列表
//getClusterList方法用于获取集群列表



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

const value1 = ref(false)

const editDialog = ref(false)

const detailDialog = ref(false)

const route = useRoute()

const data = reactive({
    items: [],
    clusterList: [],
    clusterId: "",
    editItem: {},
    editNodeName: "",
    detailItem: {},
    detailNodeName: "",
})

const getListItem = (clusterId) => {
    loading.value = true
    getListApi(clusterId).then((Response)=>{
        //调试用：console.log(Response.data.items);
        data.items = Response.data.items;
        //我们查询的指定集群的node列表放到了data.items中，然后绑定到表格上最后渲染出来
        loading.value = false;
    })
}


const edit = (row) =>{
    console.log("编辑节点：",row)
    data.editItem = row
    data.editNodeName = row.metadata.name
    editDialog.value = true
}

const detail = (row) =>{
    console.log("查看节点详情：",row)
    data.detailItem = row
    data.detailNodeName = row.metadata.name
    detailDialog.value = true
}

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
const { clusterId, clusterList, editItem, editNodeName,detailItem,detailNodeName } = toRefs(data)

</script>

<template>

  
    <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
        <span style="font-weight: bold;'">节点列表</span>
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
    v-loading="loading"  

    element-loading-text="一二三睦头人..."
    :element-loading-svg="svg"
    class="custom-loading-svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
   >
      
      <el-table-column fixed prop="" label="主机名" width="150" >
              <template #default="scope">
                <el-button link type="primary" @click="detail(scope.row)">{{ scope.row.metadata.name }}</el-button>
              </template>
            </el-table-column>

        <el-table-column prop="status.addresses[0].address" label="IP" width="150" /> 

        <el-table-column prop="metadata.name" label="角色" width="150" /> 

        <el-table-column align="center" sortable prop="" label="状态" width="80" >
          <template #default="scope">
            <el-icon v-if="scope.row.status.conditions[scope.row.status.conditions.length-1].status === 'True'" color="green"><Check /></el-icon>
              <el-icon v-else color="red"><Close /></el-icon>
          </template>
        </el-table-column>   

        <el-table-column align="center" prop="" label="禁止调度" width="120" >
            <template #default="scope">
              <el-switch v-model="value1" />
            </template>
          </el-table-column>

        <el-table-column align="center" prop="" label="一键驱逐" width="120" >
            <template #default="scope">
              <el-switch v-model="value1" />
            </template>
          </el-table-column>

        <el-table-column fixed="right" align="center" label="Operations" min-width="103">
          <template #default="scope">
            <!-- row传递时包含完整的对象信息，即后端返回的list对应的list[row],的对象信息，包括metadata、status等，可以直接使用，不需要再次请求API -->
            <el-button :disabled="scope.row.clusterStatus == ''" link type="warning" size="small" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

     <!--  表格点击行 → 设置 data.editItem → 传递给子组件的 itemForm -->

      <el-dialog destroy-on-close v-model="editDialog" :title="'正在编辑集群:  ' + clusterId +'    &    节点:  ' + editNodeName" width=70% >
          <Edit :itemForm="editItem" :clusterId="data.clusterId" @refresh="getListItem(clusterId)" ></Edit>
      </el-dialog>

      <el-dialog destroy-on-close v-model="detailDialog" :title="'集群:  ' + clusterId +'    &    节点:  ' + detailNodeName" width=70% >
        <Detail :item="detailItem" ></Detail>
    </el-dialog>
</template>

<style scoped>


</style>