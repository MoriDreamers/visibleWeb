<script setup>

import { onUpdated, reactive,ref, computed } from 'vue';
import CodeMirror from './CodeMirror.vue';



const props = defineProps({
  clusterId: {
    type: String,
  },
  namespace: {
    type: String,
  },
  showDetailDialog: {
    type: Boolean,
    default: false,
  },
  yamlContent: {
    type: String,

  }
})

const yamlData = ref("");
let visible = computed({
  get: () => props.showDetailDialog,
  set: (value) => {
    emits('beforeClose', value);
  }
})


const emits = defineEmits(['beforeClose'])


onUpdated(() => { yamlData.value = props.yamlContent })

</script>

<template>


    <el-dialog destroy-on-close v-model="visible" :title="'YAML详情'" width=50% >
      <CodeMirror
      v-model="yamlData"
      >
      </CodeMirror>
<!--       <el-button type="primary" @click="" style="margin-top: 10px;" >确认</el-button> -->
  </el-dialog>
</template>

<style scoped>

</style>