<script setup>
//这是调度资源的模板
import { onBeforeMount, readonly, ref } from 'vue'
const activeName = ref('basic') // 当前激活的tab
import ClusterAndNamespaceSelector from './ClusterAndNamespaceSelector.vue';
import StringAndNumberSupport from './StringAndNumberSupport.vue';
import { reactive } from 'vue';
import { toRefs } from 'vue';
import { getSecretListApi } from '../../api/cluster.js';
import { computed } from 'vue';
import { ElMessage, useTransitionFallthroughEmits } from 'element-plus';
import Table from './Table.vue';
import { listToObject,objectToList } from '../../utils/utils';
import { addDeploymentApi,updateDeploymentApi } from '../../api/deployment';
import { useItem } from '../../store/index.js'
import { getServiceListApi } from '../../api/service.js';
import { objToYaml } from '../../utils/utils.js';
import { storeToRefs } from 'pinia';
import scheduleConfig from './schedule/scheduleConfig.vue';
import volume from './schedule/Volume.vue';
import CodeMirror from '../components/CodeMirror.vue';
import Container from './schedule/Container.vue';
import { clusterRoutes } from '../../router/cluster.js';

//操作资源时间
const emits = defineEmits(['submit'])


const props = defineProps({
    resourseType: {
        type: String,
        default: "Deployment"
    },
    method: {
        type: String,
        default: "add"
    },
})


//拿到pinia的全局状态管理
const useItemer = useItem()

const data = reactive ({
    clusterId: '',
    namespace: '',
    item:{
        metadata:{
            name:"",
            secret: "", 
            labels:{},
            annotations:{},
        },
        spec:{
            selector:{
                matchLabels:{},
            },
            replicas:1,
            //POD的模板
            template:{
                metadata:{
                    labels:{},
                    annotations:{},
                },
                spec:{
                    imagePullSecrets:[],
                    dnsPolicy:[]
                },
            },
            strategy:{
                type:"RollingUpdate",
                rollingUpdate:{
                    maxSurge:"25%",
                    maxUnavailable:"25%"
                },
            },
        },
    },
    registryList:[],
    dnsPolicyList:[
        {
            value:"Default",
            label:"默认",
        },
        {
            value:"ClusterFirst",
            label:"集群优先",
        },        
        {
            value:"ClusterFirstWithHostNet",
            label:"集群优先，主机网络",
        },        
        {
            value:"None",
            label:"不设置",
        },
    ],
    autoCreateService:true,
    options:{
        controllerAnnoList:[

        ],
        controllerLabelList:[],
        podAnnoList:[],
        podLabelList:[],
        nodeSelectorList:[],
        serviceList:[],
    },
})


const namespaceRollback =(clusterId,namespace) =>{
    data.clusterId = clusterId;
    data.namespace = namespace;
    useItemer.namespace = namespace;
    useItemer.clusterId = clusterId;

    getRegistrySecret();
}

const itemRef = ref("null")
const getRegistrySecret = async () => {
  const getSecretListParam = {
    clusterId: data.clusterId,
    namespace: data.namespace,
    labelSelector: "",
    fieldSelector: "type=kubernetes.io/dockerconfigjson"
  };

  try {
    const res = await getSecretListApi(getSecretListParam);
    const items = res?.data?.items || [];

    data.registryList = items.map(item => ({
      name: item.metadata?.name || ""
    }));
    
    // console.log("获取到的私有仓库的secret", data.registryList);
  } catch (err) {
    console.error("获取私有镜像 secret 失败:", err);
    data.registryList = [];
  }
};


//返回更新方式
const getStrategyType = computed(()=>{
    if (props.resourseType === "Deployment"){
        return [
        {
            value:"RollingUpdate",
            label:"滚动更新",
        },
        {
            value:"Recreate",
            label:"删除后重建",
        },
    ]
    }
})

//选择后的回调调试用
const seleteChanged = () =>{
/*     console.log("选择的", useItemer.item) */
}

//把更新方式的相关处理
const strategyChanged = (info) =>{
    if (info == "Recreate") {
        delete useItemer.item.spec.strategy.rollingUpdate
    }if (info == "RollingUpdate") {
        useItemer.item.spec.strategy.rollingUpdate = {
            maxSurge:"25%",
            maxUnavailable:"25%"
        }
    }
}

//网络政策切换提示
const networkSwitchChanged = (bool) => {
    if (bool){
        ElMessage.warning("此操作会直接占用宿主机IP，请谨慎操作！");
    }

}

//是否自动生成标签？
const autoCreateLabel = ref('true')

//标签页面
const labelActiveName = ref('controllerAnno')

const { registryList,dnsPolicyList ,options} = toRefs(data);

//把ITEM作为pinia的全局状态管理
const {item} = storeToRefs(useItem())


//提交创建
const submitItem = (tag) => {
    console.log("提交创建", useItemer.item)
/*     addDeploymentApi(useItemer.item).then((res) => {
        ElMessage.success("创建成功"+res.data.message);
    }) */

//处理标签注释 list转换obj
    let controllerAnnoObj = {}
    let controllerLabelObj = {}
    let podAnnoObj = {}
    let podLabelObj = {}
    if (autoCreateLabel.value === 'false'){
         controllerAnnoObj = listToObject(data.options.controllerAnnoList)
         controllerLabelObj = listToObject(data.options.controllerLabelList)
         podAnnoObj = listToObject(data.options.podAnnoList)
         podLabelObj = listToObject(data.options.podLabelList)
    }else{
        ///默认自动生成一个标签
        const obj = {
            app: useItemer.item.metadata.name
        }
        controllerAnnoObj = obj
        controllerLabelObj = obj
        podAnnoObj = obj
        podLabelObj = obj
    }
    useItemer.item.metadata.annotations = controllerAnnoObj
    useItemer.item.metadata.labels = controllerLabelObj
    useItemer.item.spec.template.metadata.annotations = podAnnoObj
    useItemer.item.spec.template.metadata.labels = podLabelObj
    useItemer.item.spec.selector.matchLabels = podLabelObj
//处理调度配置
    useItemer.item.spec.template.spec.nodeSelector = listToObject(data.options.nodeSelectorList)
    //处理自动添加Service
    if (data.autoCreateService && props.resourseType == "StatefulSet"){
        useItemer.item.spec.serviceName = useItemer.item.metadata.name
    }
    submitHandler(tag)
}

/*
        //查看YAML
        const yamlItem = ref("")
        const showDetailDialog = ref(false)
        const detailYaml = () => {
            
        //把一些选择框的数据进行处理我们暂时写在了submit里面 后续需要优化submitItem()

            console.log("查看YAML!!", useItemer.item)
            const itemCopy = JSON.parse(JSON.stringify(item.value)); // 要加 .value
            const yamlData = objToYaml(itemCopy);
            yamlItem.value = yamlData; // 正确赋值方式
            showDetailDialog.value = true;
        }
*/

const submitHandler = (tag) => {
    itemRef.value.validate((valid) => {
        if(valid){
            //如果成功了就调用emits
            emits('submit', tag,data.autoCreateService)
        } else {
            ElMessage({
                type:'warning',
                message:'请检查输入内容'
            })
        }
    })
}

const initItemStructure = () => {
    // 确保spec.template.spec存在
    if (!data.item.spec.template.spec) {
        data.item.spec.template.spec = {
            containers: [],
            imagePullSecrets: [],
            dnsPolicy: []
        };
    }
    
    // 确保containers数组存在且至少有一个容器
    if (!data.item.spec.template.spec.containers || data.item.spec.template.spec.containers.length === 0) {
        data.item.spec.template.spec.containers = [{
            name: '',
            image: '',
            resources: {
                requests: {
                    memory: '',
                    cpu: ''
                },
                limits: {
                    memory: '',
                    cpu: ''
                }
            }
        }];
    }
    
    // 确保每个容器都有resources对象
    data.item.spec.template.spec.containers.forEach(container => {
        if (!container.resources) {
            container.resources = {
                requests: {
                    memory: '',
                    cpu: ''
                },
                limits: {
                    memory: '',
                    cpu: ''
                }
            };
        }
    });
}

//查询service列表
const serviceChanged  = () => {
    console.log("serviceChanged", data.autoCreateService)
            if(data.autoCreateService){return}
    useItemer.item.spec.serviceName = ""
        const getServiceListParam = {
            clusterId: data.clusterId,
            namespace: data.namespace,
            labelSelector: "",
            fieldSelector: ""
        }
        getServiceListApi(getServiceListParam).then((res) => {
            console.log("获取到的service列表", res.data.items)
            res.data.items.forEach(item => {
                //如果service的clusterIP为None，则添加到serviceList中
                if (item.spec.clusterIP == "None"){
                    data.options.serviceList.push(item)
                }
            })
        })

}

onBeforeMount(() => {
    initItemStructure();
    if(props.method !== 'add'){
        autoCreateLabel.value = 'false'
        // 确保metadata和template.metadata存在
        if (!useItemer.item.metadata) {
            useItemer.item.metadata = {
                labels: {},
                annotations: {}
            };
        }
        if (!useItemer.item.spec.template.metadata) {
            useItemer.item.spec.template.metadata = {
                labels: {},
                annotations: {}
            };
        }
        // 把当前存在的label转成list
        console.log("当前的标签配置：", useItemer.item.metadata.labels)
        data.options.controllerAnnoList = objectToList(useItemer.item.metadata.annotations || {})
        data.options.controllerLabelList = objectToList(useItemer.item.metadata.labels || {})
        data.options.podAnnoList = objectToList(useItemer.item.spec.template.metadata.annotations || {})
        data.options.podLabelList = objectToList(useItemer.item.spec.template.metadata.labels || {})
    }
})
</script>

<template>
<!--    
    //查看YAML
    <el-dialog destroy-on-close v-model="showDetailDialog" :title="'Deployment详情'" width=50% >
        <CodeMirror
        v-model="yamlItem"
        >
        </CodeMirror>
    </el-dialog>
-->

    <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
        <div>
          <span style="font-weight: bold;color:#000000c9;font-size: 16px;">{{props.method === 'add'? '创建' : '更新'}}Deployment</span>
        </div>
        <div>
            <el-button type="primary" @click="submitItem('yaml')">YAML</el-button>
            <el-button type="default" @click="submitItem()">{{props.method === 'add'? '创建' : '更新'}}</el-button>
        </div>
    </div>

    <div class="main">
        <!--  资源表单 原本是v-model="item" 现在改成:model="item"-->
        <el-form
        :model="item"
        ref = "itemRef"
        >
        <!-- 外层的TABS -->
        <el-tabs class="demo-tabs" v-model="activeName">
            <el-tab-pane label="基本配置" name="basic">
                <div class="basic-header">
                    <!-- 显示文字说明的排版版本 
                    <div>
                        <span style="color:#727272c9;">请选择集群和命名空间: </span>
                    </div> 
                    <div>
                        <ClusterAndNamespaceSelector @namespaceChangedRollback="namespaceRollback"></ClusterAndNamespaceSelector>
                    </div>-->
                    
                    <div style="display: flex;justify-content: space-between;width: 100%">
                        <ClusterAndNamespaceSelector @namespaceChangedRollback="namespaceRollback" :clusterReadOnly="props.method == 'update'" :namespaceReadOnly="props.method == 'update'"></ClusterAndNamespaceSelector>
                    </div>
                </div>
                <div class="basic-body">
                    <!-- 第一行 -->
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="名称" prop="item.metadata.name" >
                                <el-input :disabled="props.method == 'update'" v-model.trim="item.metadata.name" placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="副本数量" prop="spec.replicas" >
                                <el-input-number v-model="item.spec.replicas" :min="0" ></el-input-number>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="6">
                            <el-form-item label="仓库密钥" prop="" >
                                <el-select
                                v-model="item.spec.template.spec.imagePullSecrets"
                                placeholder="选择绑定对象"
                                @change="seleteChanged"
                                multiple
                                collapse-tags
                              >
                                <el-option 
                                  v-for="s in registryList"
                                  :key="s.name"
                                  :label="s.name"
                                  :value="s"
                                />
                              </el-select>
                            </el-form-item>
                        </el-col>


                        <el-col :span="6">
                            <el-form-item label="网络政策" prop="" >
                                <el-select
                                    v-model="item.spec.template.spec.dnsPolicy"
                                    placeholder="选择网络政策"
                                    @change="seleteChanged"
                                >
                                    <el-option
                                    v-for="s in dnsPolicyList"
                                    :key="s.value"
                                    :label="s.label"
                                    :value="s.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                      </el-row>


                    <!-- 第二行 -->
                      <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="更新方式" prop="spec.strategy" >
                                <el-select
                                v-model="item.spec.strategy.type"
                                placeholder="选择更新方式"
                                @change="strategyChanged"
                              >
                                <el-option 
                                  v-for="s in getStrategyType"
                                  :key="s.value"
                                  :label="s.label"
                                  :value="s.value"
                                />
                              </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="最大不可用" prop="" v-if="item.spec.strategy.type === 'RollingUpdate'">
                                <!-- <el-input v-model="item.spec.strategy.rollingUpdate.maxUnavailable" :min="0"></el-input> -->
                                <StringAndNumberSupport  v-model:data="item.spec.strategy.rollingUpdate.maxUnavailable" placeholder="请输入最大不可用"></StringAndNumberSupport>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="可超出最大值" prop="" v-if="item.spec.strategy.type === 'RollingUpdate'">
                                <!-- <el-input v-model="item.spec.strategy.rollingUpdate.maxSurge" :min="0" ></el-input> -->
                                <StringAndNumberSupport  v-model:data="item.spec.strategy.rollingUpdate.maxSurge" placeholder="请输入可超出最大值"></StringAndNumberSupport>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="使用宿主网络" prop="" >
                                <el-switch
                                v-model="item.spec.template.spec.hostNetwork"
                                active-text="启用"
                                inactive-text="禁用"
                                @change="networkSwitchChanged"
                                
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                      </el-row>


                    <!-- 第三行 -->
                      <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="更新方式" prop="spec.strategy" v-if="props.method !== 'update'">
                                <el-radio-group v-model="autoCreateLabel">
                                    <el-radio value="true" size="large">自动生成</el-radio>
                                    <el-radio value="false" size="large">手动配置</el-radio>
                                  </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" v-if="props.method !== 'update'" >
                           <!-- 自动添加Service
                            <el-form-item label="自动添加Service" prop="" v-if="props.resourseType == 'Deployment' || props.resourseType == 'DaemonSet'">
                                <el-switch
                                v-model="data.autoCreateService"
                                active-text="启用"
                                inactive-text="禁用"
                                >
                                </el-switch>
                            </el-form-item>
 -->
                            
                            <el-form-item label="绑定Service" prop="" v-if="props.resourseType == 'StatefulSet'">
                                <el-radio-group v-model="data.autoCreateService" @change="serviceChanged">
                                    <el-radio :value="true" size="large">自动添加Service</el-radio>
                                    <el-radio :value="false" size="large">手动绑定Service</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="!data.autoCreateService && props.resourseType == 'StatefulSet'">
                            <el-form-item label="* Service列表" prop="" >
                                <el-select v-model="item.spec.serviceName" placeholder="请选择Service">
                                    <el-option v-for="s in data.options.serviceList" :key="s.metadata.name" :label="s.metadata.name" :value="s.metadata.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                      </el-row>
<!--
                      <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="最小内存" prop="item.resources.requests.memory" v-if="data.item.spec.template.spec.containers && data.item.spec.template.spec.containers[0].resources">
                                <el-input v-model="data.item.spec.template.spec.containers[0].resources.requests.memory" placeholder="请输入最小内存"></el-input>
                            </el-form-item>
                        </el-col>
                      </el-row>
-->
                </div>

                <!-- 这里是标签选择页面 -->

                <div>
                    <el-card v-if="autoCreateLabel === 'false'" shadow="hover">
                          <el-tabs tab-position="left" style="height: 200px" v-model="labelActiveName">
                            <el-tab-pane label="控制器注释" name="controllerAnno">
                                <Table :list="options.controllerAnnoList"></Table>
                            </el-tab-pane>
                            <el-tab-pane label="控制器标签" name="controllerLabel">
                                <Table :list="options.controllerLabelList"></Table>
                            </el-tab-pane>
                            <el-tab-pane label="POD注释" name="podAnno">
                                <Table :list="options.podAnnoList"></Table>
                            </el-tab-pane>
                            <el-tab-pane label="POD标签" name="podLabel" :readonly="props.method == 'update'">
                                <Table :list="options.podLabelList"></Table>
                            </el-tab-pane>
                          </el-tabs>
                    </el-card>
                </div>
            </el-tab-pane>

            <el-tab-pane label="调度配置" name="schedule">
                <scheduleConfig :list="options.nodeSelectorList"></scheduleConfig>
            </el-tab-pane>

            <el-tab-pane label="存储卷配置" name="volume" >
                <volume></volume>
            </el-tab-pane>

            <el-tab-pane label="容器配置" name="container">
                <Container></Container>
            </el-tab-pane>

            <el-tab-pane label="初始化容器" name="initContainer">                
                <Container containerType="init"></Container>
            </el-tab-pane>
          </el-tabs>
        </el-form>

    </div>
</template>

<style scoped>
.basic-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}
</style>