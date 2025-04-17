<script setup>
import { useItem } from '../../../store/index.js'
import { storeToRefs } from 'pinia';

const useItemer = useItem()
//把ITEM作为pinia的全局状态管理
const {item} = storeToRefs(useItem())

const addVolume = () => {
    console.log("addVolume")
  }
</script>

<template>
    <el-table 
    :data="item.spec.template.spec.volumes" 
    stripe 
    style="width: 100%;" 
    height="400px"
    >
      <el-table-column prop="" label="名称">
        <template #default="scope">
          <el-input  placeholder="请输入存储卷名称"  type="textarea" autosize :autosize="{ minRows: 1, maxRows: 2 }" v-model="scope.row.name">
          </el-input> 
        </template>
      </el-table-column>

      <el-table-column prop="" label="类型" >
        <template #default="scope">
            <span>待修改</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="Volume配置" >
        <template #default="scope">
            <span>配置</span>
        </template>
      </el-table-column>

      <el-table-column fixed = "right" width="100px" >
        <template #header>
          <el-button link style="font-weight: bold;color:rgb(243, 105, 71)" @click="addVolume">添加</el-button>
        </template>
        <template #default="scope" >
          <el-button link type="warning" @click="deleteTabRow(item.spec.template.spec.volumes,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>