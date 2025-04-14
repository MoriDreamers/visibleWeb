<script setup>
import { computed } from 'vue';

const props = defineProps({
    item:{
      type:Object
    },
  })

const getNodeRole = computed(() => {
  const labels = props.item.metadata.labels
  for (const key in labels) {
    if (key === "node-role.kubernetes.io/master") {
      return "主节点"
    } else if (key === "node-role.kubernetes.io/worker") {
      return "工作节点"
    } else if (key === "node-role.kubernetes.io/control-plane") {
      return "控制节点"
    }
  }
  return "未知"
})


</script>

<template>
    <el-descriptions :column="3" border size=large>
        <el-descriptions-item
          label="主机名"
          label-align="right"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
        >
          {{props.item.metadata.name}}
        </el-descriptions-item>

        <el-descriptions-item label="IP" label-align="right" align="center">
          {{props.item.status.addresses[0].address}}
        </el-descriptions-item>

        <el-descriptions-item label="状态" label-align="right" align="center">
            <span v-if="props.item.status.conditions[props.item.status.conditions.length-1].status === 'True'" style="color:green">{{props.item.status.conditions[props.item.status.conditions.length-1].reason}}</span>
            <span v-else style="color:red">{{props.item.status.conditions[props.item.status.conditions.length-1].reason}}</span>
        </el-descriptions-item>

        <el-descriptions-item label="角色" label-align="right" align="center">
          <el-tag size="large">{{ getNodeRole }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="操作系统" label-align="right" align="center">
          {{ props.item.status.nodeInfo.osImage }}
        </el-descriptions-item>
        
        <el-descriptions-item label="内核版本" label-align="right" align="center">
          {{ props.item.status.nodeInfo.kernelVersion }}
        </el-descriptions-item>

        <el-descriptions-item label="硬件信息" label-align="right" align="center">
          {{ props.item.status.capacity.cpu }} CPU
          {{ props.item.status.capacity.memory }} 
        </el-descriptions-item>

        <el-descriptions-item label="Runtime" label-align="right" align="center">
          {{ props.item.status.nodeInfo.containerRuntimeVersion }}
        </el-descriptions-item>

        <el-descriptions-item label="版本信息" label-align="right" align="center">
            <span>kubelet: {{ props.item.status.nodeInfo.kubeletVersion }}</span>
            <span style="margin-left: 10px;">kube-proxy: {{ props.item.status.nodeInfo.kubeProxyVersion }}</span>
          </el-descriptions-item>

      </el-descriptions>

</template>

<style scoped>

</style>