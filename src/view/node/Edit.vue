<script setup>
  import { toRefs,reactive,ref,onMounted } from 'vue';
  import { ElMessage,ElNotification } from 'element-plus'
  import { updateNodeListApi } from '../../api/cluster.js';
  import { objectToList,deleteTabRow,listToObject } from '../../utils/utils.js';

  //！！！！接下来包括表格内的数据都几乎和const定义的变量进行了双向绑定，也就是说这些变量的值会实时跟着表格里的值变化，不用去关心逻辑

  const waringBox = () => {
    ElNotification({
    title: '请检查输入的数据！',
    message: '校验不通过',
    type: 'warning',
  })
};


//这个问题非常典型，因为在表格里用了 itemForm.spec.taints，但在组件加载的时候，它还没被onmouted初始化出来，所以 Vue 会报错
//在这里一定义好字段一开始读取的时候就不会出问题了
const data = reactive({
    itemForm:{
        spec:{
          taints:[]
        },
    },
    labelList:[],
    clusterId:{},
    taintOptinos:[
    {
      label: '禁止调度',
      value: 'NoSchedule'
    },
    {
      label: '驱逐',
      value: 'NoExecute'

    },
    {
      label: '宽容',
      value: 'PreferNoSchedule'
    }
  ]
  })

/*     defineProps → ​​先说要啥​​（避免乱给数据）
    onMounted → ​​等页面加载完再用​​（避免数据还没到就操作）
    就像收快递：​​先说要盒子，等送到了再拆 */
  const props = defineProps({
    itemForm:{
      type:Object
    },
    clusterId:{
    type:String,
    }
  })

  const emits = defineEmits(['refresh'])

//itemFormRef 被用来引用 <el-form> 组件。这样做是为了能够在 JavaScript 中访问和操作这个表单组件
  const itemFormRef = ref()

  const loading = ref(false)



const submitForm = () => {
    //lablelist转对象
    const labelsObject = listToObject(data.labelList)
    data.itemForm.metadata.labels = labelsObject
    loading.value = true;
    console.log("提交的数据",data.itemForm)
    updateNodeListApi(props.clusterId,data.itemForm.metadata.name,data.itemForm).then((Response) => {
      ElMessage({
        type: 'success',
        message: Response.message,
      });
      loading.value = false;
      emits('refresh',props.clusterId); 
    });
};

onMounted(() => {
  //最早的时候把父组件传的参数给绑定到这个组件的data.itemForm
  data.itemForm = JSON.parse(JSON.stringify(props.itemForm))
  //对象转list
  data.labelList = objectToList(data.itemForm.metadata.labels)

  console.log("对象转换后的结果",data.labelList) 
  console.log("污点",data.itemForm.spec.taints)
})

const {itemForm,labelList,taintOptinos} = toRefs(data)

</script>

<template>
 
  <el-form 
    label-width="140px"    
    ref="itemFormRef" 
    :model="itemForm" 
    >
    <div>
      <el-tabs >
        <el-tab-pane label="标签配置">
          <el-table :data="labelList" stripe style="width: 100%;" >
            <el-table-column prop="key" label="KEY">
              <template #default="scope">
                <el-input placeholder="请输入KEY" type="textarea" autosize :autosize="{ minRows: 1, maxRows: 2 }" v-model="scope.row.key">
                </el-input> 
              </template>
            </el-table-column>

            <el-table-column prop="value" label="VALUE" >
              <template #default="scope">
                <el-input placeholder="请输入VALUE" v-model="scope.row.value">
                </el-input> 
              </template>
            </el-table-column>

            <el-table-column fixed = "right" width="100px" >
              <template #header>
                <el-button link style="font-weight: bold;color:rgb(243, 105, 71)" @click="labelList.unshift({key:'',value:''})">添加</el-button>
              </template>
              <template #default="scope" >
                <el-button link type="warning" @click="deleteTabRow(labelList,scope.$index)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="污点配置" >
          <el-table  stripe style="width: 100%;" :data="itemForm.spec.taints">
            <el-table-column  prop="key" label="KEY">
              <template #default="scope">
                <el-input placeholder="请输入KEY"  v-model="scope.row.key">
                </el-input> 
              </template>
            </el-table-column>

            <el-table-column prop="value" label="VALUE" >
              <template #default="scope">
                <el-input placeholder="请输入VALUE" v-model="scope.row.value">
                </el-input> 
              </template>
            </el-table-column>

            <el-table-column prop="effect" label="EFFECT" >
              <template #default="scope">
                <el-select
                v-model="scope.row.effect"
                placeholder="Select"
              >
            <!--  options用一个循环生成所有的选项，选择选项时候会与value匹配并绑定到row.effect上 -->
                <el-option
                  v-for="item in taintOptinos"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              </template>
            </el-table-column>

            <el-table-column fixed = "right" width="100px" >
              <template #header>
                <el-button link style="font-weight: bold;color:rgb(243, 105, 71)" @click="itemForm.spec.taints.unshift({key:'',value:'',effect:''})">添加</el-button>
              </template>
              <template #default="scope" >
                <el-button link type="warning" @click="deleteTabRow(itemForm.spec.taints,scope.$index)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </div>
        <span style="display: block; margin-top:20px;" class="btn">

            <el-button @click="submitForm()" type="primary">
               更新 
            </el-button>
        </span>

    </el-form>
</template>

<style scoped>


.form-item{
    width: 400px;
    margin: 20px auto;
}
.cluster-info {
    flex-direction: row;
}

</style scoped>