<script setup>

import List from '../components/List.vue';
import ClusterAndNamespaceSelector from '../components/ClusterAndNamespaceSelector.vue';
import { getPodListApi as getListItem ,deletePodApi as deleteItem ,getPodApi as getItem } from '../../api/pod.js';
import { reactive,computed } from 'vue';

const data = reactive({
    items: [],
    clusterId: "",
    namespace: "",
})

// 计算pod的重启次数和容器状态
const getPodRestartCount = computed(() => (row) => {
  let restartCount = 0;
  let readyCount = 0;
  row.status.containerStatuses.forEach((item) => {
    //便利每个容器的状态，累加重启次数，且如果容器状态ready，则readyCount+1
    restartCount += item.restartCount;
    if (item.ready) {
      readyCount += 1;
    }
  });
  const containerTotal = row.status.containerStatuses.length;
  const readyStatus = `${readyCount}/${containerTotal}`;
  return [restartCount, readyStatus];
});
const deleteHandle = (row) => {
    console.log("删除",row)
    deleteItem
}
//利用回调函数查询POD列表
const getList = async () => {
    const res = await getListItem(data.clusterId, data.namespace);
    data.items = res.data.items;
    console.log(data.items);
}
const rollback = (clusterId, namespace) => {
    data.clusterId = clusterId;
    data.namespace = namespace;
    getList();
}


</script>

<template>
    <List title="管理POD">
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
                        <!-- <el-button link type="primary" @click="detail(scope.row)">{{ scope.row.metadata.name }}</el-button> -->
                        <el-button link type="primary" >{{ scope.row.metadata.name }}</el-button>
                      </template>
                </el-table-column>

                <el-table-column prop="metadata.namespace" label="命名空间" width="120" /> 
                
                <el-table-column align="center" sortable prop="" label="状态" width="100" >
                    <template #default="scope">
                        <span v-if="scope.row.status.phase === 'Running'" style="color: green;">{{ scope.row.status.phase }}</span>
                        <span v-else style="color: red;">{{ scope.row.status.phase }}</span>
                    </template>
                  </el-table-column>   

                <el-table-column prop="metadata.creationTimestamp" label="创建时间" width="180" sortable /> 
                
                <el-table-column align="center" prop="" label="重启次数" width="120" >
                    <template #default="scope">
                        <span v-if="!scope.row.metadata.deletionTimestamp">{{
                            getPodRestartCount(scope.row)[0]
                          }}</span> 
                    </template>
                  </el-table-column>   

                  <el-table-column align="center" prop="" label="容器状态" width="120" >
                    <template #default="scope">
                        <span v-if="!scope.row.metadata.deletionTimestamp">{{
                          getPodRestartCount(scope.row)[1]
                        }}</span>
                      </template>
                  </el-table-column>   

                <el-table-column prop="status.podIP" label="POD_IP" width="120"  /> 

                <el-table-column prop="spec.nodeName" label="宿主机" width="120"  /> 

                <el-table-column prop="status.hostIP" label="宿主机IP" width="120"  /> 
        
                <el-table-column fixed="right" align="center" label="Operations" min-width="103">
                  <template #default="scope">
                    <!-- row传递时包含完整的对象信息，即后端返回的list对应的list[row],的对象信息，包括metadata、status等，可以直接使用，不需要再次请求API -->
                    <el-button :disabled="scope.row.clusterStatus == ''" link type="warning" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
        
        </template>
    </List>
</template>

<style scoped>

</style>