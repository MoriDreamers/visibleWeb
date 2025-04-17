<script setup>
import { defineProps } from 'vue'
import { deleteTabRow } from '../../utils/utils'

// props 一次性定义完
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  keyName: {
    type: String,
    default: 'key',
  },
  valueName: {
    type: String,
    default: 'value',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})
</script>


<template>
        <el-table 
        :data="props.list" 
        stripe 
        style="width: 100%;" 
        height="400px"
        >
          <el-table-column prop="key" :label="props.keyName">
            <template #default="scope">
              <el-input :readonly="props.readOnly" placeholder="请输入KEY"  type="textarea" autosize :autosize="{ minRows: 1, maxRows: 2 }" v-model="scope.row.key">
              </el-input> 
            </template>
          </el-table-column>

          <el-table-column prop="value" :label="props.valueName" >
            <template #default="scope">
              <el-input :readonly="props.readOnly" placeholder="请输入VALUE" v-model="scope.row.value">
              </el-input> 
            </template>
          </el-table-column>

          <el-table-column fixed = "right" width="100px" >
            <template #header>
              <el-button link style="font-weight: bold;color:rgb(243, 105, 71)" @click="props.list.unshift({key:'',value:''})">添加</el-button>
            </template>
            <template #default="scope" >
              <el-button link :disabled="props.readOnly" type="warning" @click="deleteTabRow(props.list,scope.$index)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
</template>