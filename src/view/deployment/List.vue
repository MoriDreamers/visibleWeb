<script setup>

import List from '../components/List.vue';
import ClusterAndNamespaceSelector from '../components/ClusterAndNamespaceSelector.vue';
import { getDeploymentListApi as getListItem ,deleteDeploymentApi as deleteItem ,getDeploymentApi as getItem,addDeploymentApi as addItem,updateDeploymentApi as updateItem } from '../../api/deployment.js';
import { reactive,computed,ref } from 'vue';
import { ElMessage, ElMessageBox, } from 'element-plus';
import CodeMirror from '../components/CodeMirror.vue';
import { toRefs } from 'vue';
import { objToYaml } from '../../utils/utils.js';
import ViewYMAL from '../components/ViewYMAL.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const data = reactive({
    items: [],
    clusterId: "",
    namespace: "",
    showItem: "",
    yamlItem: "",
})

const deleteHandle = (row) => {
    ElMessageBox.confirm(
    '正在尝试删除Deployment'+row.metadata.name+'，是否继续？',
    '请注意',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )  .then(() => {
    deleteItem(data.clusterId,row.metadata.name,row.metadata.namespace).then((Response)=>{
      ElMessage({
        type:'success',
        message:Response.message,
      })
      getList() 
    })
  })
}

const editHandle = (name) => {
    ElMessageBox.confirm(
    '正在尝试编辑Deployment: '+name+'，是否继续？',
    '请注意',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
      router.push({
      path: '/deployment/edit',
      query: {
        name: name,
        clusterId: data.clusterId,
        namespace: data.namespace
      }
    })
  })
}

//利用回调函数查询Deployment列表
const getList = async () => {
  try {
    const res = await getListItem(data.clusterId, data.namespace);
    data.items = res?.data?.items || [];
    console.log('Deployment list:', data.items);
  } catch (error) {
    data.items = [];
    console.error('获取Deployment列表失败:', error);
  }
}

const rollback = (clusterId, namespace) => {
    data.clusterId = clusterId;
    data.namespace = namespace;
    getList();
}

//展示详情
const showDetailDialog = ref(false);

const detail = (row) => {
  const item = JSON.parse(JSON.stringify(row));
  console.log(item);
  delete item.metadata.managedFields;
  //补充client-go省略的数据
  const itemtemp = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: item.metadata,
    spec: item.spec,
  };
  const yamlData = objToYaml(itemtemp);
  data.yamlItem = yamlData;
  showDetailDialog.value = true;
}

const {yamlItem} = toRefs(data);
</script>

<template>
    <List title="管理Deployment">
        <template #headerOptins>
            <ClusterAndNamespaceSelector @namespaceChangedRollback="rollback"></ClusterAndNamespaceSelector>
        </template>
        <template #main>
            <el-table 
            stripe  
            :data="data.items" 
            style="width: 100%" 
        
           >
              
              <el-table-column fixed prop="" label="名称" width="270" >
                      <template #default="scope">
                        <el-button link type="primary" @click="detail(scope.row)">{{ scope.row.metadata.name }}</el-button>
                        <!-- <el-button link type="primary" >{{ scope.row.metadata.name }}</el-button> -->
                      </template>
                </el-table-column>

                
                <el-table-column align="center" sortable prop="" label="状态" width="100" >
<!--                     <template #default="scope">
                        <span v-if="scope.row.status.phase === 'Running'" style="color: green;">{{ scope.row.status.phase }}</span>
                        <span v-else style="color: red;">{{ scope.row.status.phase }}</span>
                    </template> -->1/1
                </el-table-column>                  

                <el-table-column align="center" prop="" label="副本" width="70" >
                    <template #default="scope">
                        <el-input placeholder="请输入" v-model="scope.row.spec.replicas">{{ scope.row.spec.replicas }}</el-input>
                      </template>
                </el-table-column>   

                <el-table-column prop="metadata.creationTimestamp" label="创建时间" width="180" sortable /> 

                <el-table-column align="center" prop="" label="禁止调度" width="180" >
                    <template #default="scope">
                       <el-switch v-model="scope.row.spec.paused"></el-switch>
                      </template>
                </el-table-column>   

                <el-table-column prop="" label="暂停更新" width="120"  /> 

                <el-table-column prop="spec.nodeName" label="宿主机" width="120"  /> 

                <el-table-column prop="status.hostIP" label="宿主机IP" width="120"  /> 

                
                <el-table-column prop="metadata.namespace" label="命名空间" width="120" /> 

                <el-table-column fixed="right" align="center" label="Operations" min-width="140">
                  <template #default="scope">
                    <!-- row传递时包含完整的对象信息，即后端返回的list对应的list[row],的对象信息，包括metadata、status等，可以直接使用，不需要再次请求API -->
                    <el-button  :disabled="scope.row.metadata.deletionTimestamp" link type="danger"  @click="deleteHandle(scope.row)">删除</el-button>
                    <el-button  :disabled="scope.row.metadata.deletionTimestamp" link type="primary"  @click="editHandle(scope.row.metadata.name)">编辑</el-button>
                    <el-button  :disabled="scope.row.metadata.deletionTimestamp" link type="info"  @click="(scope.row)">日志</el-button>
                  </template>
                </el-table-column>
              </el-table>
        
        </template>
    </List>

<!--<el-dialog destroy-on-close v-model="showDetailDialog" :title="'Deployment详情'" width=50% >
      <CodeMirror
      v-model="yamlItem"
      >
      </CodeMirror>
  </el-dialog>
-->    

  <ViewYMAL :clusterId="data.clusterId" :namespace="data.namespace" :showDetailDialog="showDetailDialog" :yamlContent="yamlItem" 
  @before-close="(value)=>{showDetailDialog = value}"
  />
</template>

<style scoped>

</style>