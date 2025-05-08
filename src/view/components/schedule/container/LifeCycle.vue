<script setup>
import { defineProps, watchEffect } from 'vue'
import StringToList from './../../StringToList.vue'

const props = defineProps({
  lifecycle: {
    type: Object,
    default: () => ({})
  }
})

// 保证结构完整，防止 undefined 报错
watchEffect(() => {
  if (!props.lifecycle.postStart) props.lifecycle.postStart = { exec: { command: [] } }
  if (!props.lifecycle.postStart.exec) props.lifecycle.postStart.exec = { command: [] }
  if (!props.lifecycle.preStop) props.lifecycle.preStop = { exec: { command: [] } }
  if (!props.lifecycle.preStop.exec) props.lifecycle.preStop.exec = { command: [] }
})
</script>

<template>
  <el-form :model="props.lifecycle">
    <el-form-item label="postStart（启动后执行）">
      <StringToList v-model:data="props.lifecycle.postStart.exec.command" placeholder="每行一条命令，容器启动后自动执行"></StringToList>
    </el-form-item>
    <el-form-item label="preStop（终止前执行）">
      <StringToList v-model:data="props.lifecycle.preStop.exec.command" placeholder="每行一条命令，容器终止前自动执行"></StringToList>
    </el-form-item>
  </el-form>
</template>

<style scoped>
</style>
