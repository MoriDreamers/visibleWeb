<script setup>
import { ref } from 'vue';
import { useItem } from '../../../store/index.js'
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { markRaw } from 'vue';
import HostPath from './volume/HostPath.vue'
import EmptyDir from './volume/EmptyDir.vue'
import Nfs from './volume/Nfs.vue' 
import ConfigMap from './volume/ConfigMap.vue'
import Secret from './volume/Secret.vue'
import PersistentVolumeClaim from './volume/PersistentVolumeClaim.vue'
import { provide } from 'vue';
import { computed } from 'vue';

const deleteTabRow = (list, index) => {
  list.splice(index, 1)
}


const useItemer = useItem()
//把ITEM作为pinia的全局状态管理
const {item} = storeToRefs(useItem())
const data = reactive({
  volumeTypeComponts:{ 
    //我们使用markrow功能来设置组件不需要响应式，这样不影响性能
    hostPath:markRaw(HostPath),
    emptyDir:markRaw(EmptyDir),
    nfs:markRaw(Nfs),
    configMap:markRaw(ConfigMap),
    secret:markRaw(Secret),
    persistentVolumeClaim:markRaw(PersistentVolumeClaim),
  },
  volumeType:['hostPath','emptyDir','nfs','configMap','secret','persistentVolumeClaim']
})
let voulmeType = ref('hostPath')

//添加功能
const addVolume = () => {
    console.log("addVolume")
    showAddvolume.value = true
  }

let showAddvolume = ref(false)

//利用发布和订阅功能来关闭弹窗
const closeDiaglog = () => {
  showAddvolume.value = false
}
//发布功能
provide('closeDiaglog', closeDiaglog)

//计算存储类型
const getVolumeType = computed(() => (volumeItem) => {
  const keyList = Object.keys(volumeItem)
  return keyList[1]
})


</script>

<template>
    <el-table 
    :data="item.spec.template.spec.volumes" 
    stripe 
    style="width: 100%;" 
    height="400px"
    >
      <el-table-column prop="" label="名称" width="200px">
        <template #default="scope">
          <el-input  placeholder="请输入存储卷名称"  type="textarea" autosize :autosize="{ minRows: 1, maxRows: 2 }" v-model="scope.row.name">
<!--           绑定的是这个行的内容 但实际上走的是响应式的全局变量 也就是可以实时修改！ -->
          </el-input> 
        </template>
      </el-table-column>

      <el-table-column prop="" label="存储类型" width="100px">
        <template #default="scope">
            <span>{{ getVolumeType(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="Volume配置" >
        <template #default="scope">
          <component 
          :is="data.volumeTypeComponts[ getVolumeType(scope.row)]" 
          method="update"

          :volumeConfig="scope.row"
          />
          <span>参数核对： {{ scope.row }}</span>
          
        </template>
      </el-table-column>

      <el-table-column fixed = "right" width="100px" >
        <template #header>
          <el-button link style="font-weight: bold;color:rgb(243, 105, 71)" @click="addVolume">添加</el-button>
        </template>
        <template #default="scope" >
          <el-button link type="warning" @click="deleteTabRow(item.spec.template.spec.volumes, scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加控件 -->
    <!-- 关闭时销毁对话框 destroy-on-close -->
    <el-dialog
    v-model="showAddvolume"
    title="添加Volume"
    destroy-on-close 
    >
      <div style="margin-bottom: 14px;">
        <el-select v-model="voulmeType">
          <el-option 
          v-for="item in data.volumeType"
          :key="item"
          :label="item"
          :value="item"
          ></el-option>

        </el-select>
      </div>

      <div>
        <!-- 动态组件绑定 ：is“”【】 ， “”为组件名，【】为组件参数 传入什么就根据什么渲染 -->
        <component :is="data.volumeTypeComponts[voulmeType]" />
      </div>
    </el-dialog>
</template>