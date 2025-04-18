<script setup>
import { ref } from 'vue'
import TableVue from '../Table.vue';
const activeNames = ref(['nodeSelector'])
const props = defineProps({
    list:{
        type:Array,
        default:()=>[]
    },

})
</script>

<template>
<!--     <div style="margin-bottom: 15px;color: #666;line-height: 1.5;display: flex;align-items: center;" >⚠ 点击可以展开选项卡</div> -->
    <el-collapse v-model="activeNames">
        <el-collapse-item title="绑定节点 [ ⚠ 点击可以展开选项卡 ]" name="nodeSelector">
           <!--  这里相当于一个两层引用 父组件使用data下list字段里的一个数组绑定到这个组件的props 
            这个组件的props又绑定到TAB这个子组件的list字段上 
            所以修改TAB的字段就相当于修改了父组件的data里的list字段 
            又因为我们只做创建不做编辑所以不用关注deployment的元数据-->
          <TableVue :height="300" :list="props.list" key-name="节点标签KEY" value-name="节点标签VALUE"></TableVue>
        </el-collapse-item>
        <el-collapse-item title="Feedback" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their
            operations by style updates and interactive effects;
          </div>
          <div>
            Visual feedback: reflect current state by updating or rearranging
            elements of the page.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Efficiency" name="3">
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the
            users can quickly understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which helps
            the users to identify and frees them from memorizing and recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Controllability" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
      </el-collapse>
</template>

