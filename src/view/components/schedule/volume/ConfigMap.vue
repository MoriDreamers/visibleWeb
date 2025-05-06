<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useItem } from '../../../../store/index.js'
import { storeToRefs } from 'pinia'
import { getConfigMapListApi as getList } from '../../../../api/configmap.js'
import OtoD from '../../OtoD.vue'

const formRef = ref()
const props = defineProps({
  volumeConfig: {
    type: Object,
    default: () => ({})
  },
  method: {
    type: String,
    default: 'add'
  }
})

const useItemer = useItem()

const data = reactive({
  newVolumeConfig: {
    name: '',
    configMap: {
      name: '',
      defaultMode: 420,
      items: [],
      optional: true
    }
  },
  items: []
})

const rules = {
  name: [{ required: true, message: '请输入Volume名称', trigger: 'blur' }],
  'configMap.name': [{ required: true, message: '请选择要使用的ConfigMap', trigger: 'blur' }],
  configMap: {
    items: {
      key: [{ required: true, message: '请输入configMap的key', trigger: 'blur' }],
      path: [{ required: true, message: '请输入configMap的路径', trigger: 'blur' }]
    }
  }
}

const submitItem = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (useItemer.item.spec.template.spec.volumes === undefined) {
        useItemer.item.spec.template.spec.volumes = []
      }
      for (let v of useItemer.item.spec.template.spec.volumes) {
        if (v.name === data.newVolumeConfig.name) {
          ElMessage.error('Volume名称重复，请修改名称！')
          return
        }
      }
      const newVolume = JSON.parse(JSON.stringify(data.newVolumeConfig))
      useItemer.item.spec.template.spec.volumes.push(newVolume)
      ElMessage.success('保存成功！')
      closeDiaglog()
    } else {
      ElMessage.error('请检查输入项！')
    }
  })
}

onMounted(() => {
  if (props.method === 'update') {
    data.newVolumeConfig = props.volumeConfig  // 不做深拷贝，引用传递
  }
})


const closeDiaglog = inject('closeDiaglog')

const handleVisibleChange = (nowStatus) => {
  if (nowStatus) {
    const putdata = {
      clusterId: useItemer.clusterId,
      namespace: useItemer.namespace
    }
    getList(putdata).then(res => {
      data.items = res.data.items
    })
  }
}

const activeName = ref('first')

const addItem = () => {
  const newItem = {
    key: '',
    path: '',
    mode: null
  }
  data.newVolumeConfig.configMap.items.unshift(newItem)
}
</script>

<template>
  <el-form ref="formRef" :model="data.newVolumeConfig" :rules="rules">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础配置" name="first">
        <el-form-item label="Volume名称" prop="name">
          <el-input v-model.trim="data.newVolumeConfig.name" placeholder="请输入Volume名称" />
        </el-form-item>

        <el-form-item label="ConfigMap" prop="configMap.name">
          <el-select v-model="data.newVolumeConfig.configMap.name" placeholder="选择ConfigMap" @visible-change="handleVisibleChange">
            <el-option v-for="item in data.items" :key="item.metadata.name" :label="item.metadata.name" :value="item.metadata.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="默认权限" prop="configMap.defaultMode">
          <el-input v-model.trim="data.newVolumeConfig.configMap.defaultMode" placeholder="请输入默认权限" />
        </el-form-item>

        <el-form-item label="限制KEY存在" prop="configMap.optional">
          <el-switch v-model="data.newVolumeConfig.configMap.optional" />
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="挂载路径" name="items">
        <el-table :data="data.newVolumeConfig.configMap.items" style="width: 100%">
          <el-table-column label="key">
            <template #default="scope">
              <el-form-item
                :prop="'configMap.items.' + scope.$index + '.key'"
                :rules="rules.configMap.items.key"
              >
                <el-input v-model.trim="scope.row.key" placeholder="请输入KEY名"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="path">
            <template #default="scope">
              <el-form-item
                :prop="'configMap.items.' + scope.$index + '.path'"
                :rules="rules.configMap.items.path"
              >
                <el-input v-model.trim="scope.row.path" placeholder="请输入相对路径！！！" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="权限">
            <template #default="scope">
              <el-form-item>
                <OtoD v-model:data="scope.row.mode" placeholder="请输入权限_八进制或十进制" ></OtoD>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column>
            <template #header>
              <el-button link type="primary" @click="addItem">添加</el-button>
            </template>
            <template #default="scope">
                <el-button link type="danger" @click="data.newVolumeConfig.configMap.items.splice(scope.$index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-top: 20px">
      <el-button v-if="method === 'add'" type="primary" @click="submitItem">添加</el-button>
    </div>
  </el-form>
</template>

<style scoped>
</style>
