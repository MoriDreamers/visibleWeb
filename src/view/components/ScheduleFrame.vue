<script setup>
//这是调度资源的模板
import { ref } from 'vue'
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
import { addDeploymentApi } from '../../api/deployment';
import { useItem } from '../../store/index.js'
import { objToYaml } from '../../utils/utils.js';
import { storeToRefs } from 'pinia';
import scheduleConfig from './schedule/scheduleConfig.vue';
import volume from './schedule/Volume.vue';
import CodeMirror from '../components/CodeMirror.vue';

const props = defineProps({
    resourseType: {
        type: String,
        default: "Deployment"
    },
    method: {
        type: String,
        default: "create"
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
    autoCreateService:false,
    options:{
        controllerAnnoList:[

        ],
        controllerLabelList:[],
        podAnnoList:[],
        podLabelList:[],
        nodeSelectorList:[],
    },
})


const namespaceRollback =(clusterId,namespace) =>{
    data.clusterId = clusterId;
    data.namespace = namespace;
    getRegistrySecret();
}

const itemRef = ref("null")

//获取私有镜像仓库的secret方法
const getRegistrySecret = () => {
    const getSecretListParam ={
        clusterId: data.clusterId,
        namespace: data.namespace,
        labelSelector: "",
        fieldSelector: "type=kubernetes.io/dockerconfigjson"
    }

    getSecretListApi(getSecretListParam).then((res) => {
        //需要的是 {name: "", name:"",...}
        //因为在deployment中的pullsecret字段的格式是对象组成的数组{name: "", name:"",...}
        data.registryList = [];//先清空
        res.data.items.forEach(item => {
            data.registryList.push({
                name: item.metadata.name,
            })
        })
/*         console.log("获取到的私有仓库的secret", data.registryList); */
    });

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

const { registryList,dnsPolicyList ,autoCreateService,options} = toRefs(data);

//把ITEM作为pinia的全局状态管理
const {item} = storeToRefs(useItem())


//提交创建
const submitItem = () => {
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

}

//查看YAML
const yamlItem = ref("")
const showDetailDialog = ref(false)
const detailYaml = () => {
    
//把一些选择框的数据进行处理我们暂时写在了submit里面 后续需要优化
submitItem()
    console.log("查看YAML", useItemer.item)
    const itemCopy = JSON.parse(JSON.stringify(item.value)); // 要加 .value
    const yamlData = objToYaml(itemCopy);
    yamlItem.value = yamlData; // 正确赋值方式
    showDetailDialog.value = true;
}


</script>

<template>
    <el-dialog destroy-on-close v-model="showDetailDialog" :title="'Deployment详情'" width=50% >
        <CodeMirror
        v-model="yamlItem"
        >
        </CodeMirror>
    </el-dialog>

    <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
        <div>
          <span style="font-weight: bold;color:#000000c9;font-size: 16px;">创建Deployment</span>
        </div>
        <div>
            <el-button type="primary" @click="detailYaml">YAML</el-button>
            <el-button type="default" @click="submitItem">{{props.method === 'create'? '创建' : '更新'}}</el-button>
        </div>
    </div>

    <div class="main">
        <!--  资源表单 -->
        <el-form
        v-model="item"
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
                        <ClusterAndNamespaceSelector @namespaceChangedRollback="namespaceRollback"></ClusterAndNamespaceSelector>
                    </div>
                </div>
                <div class="basic-body">
                    <!-- 第一行 -->
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="名称" prop="item.metadata.name">
                                <el-input v-model.trim="item.metadata.name" placeholder="请输入Deployment名称"></el-input>
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
                        <el-col :span="12">
                            <el-form-item label="更新方式" prop="spec.strategy" >
                                <el-radio-group v-model="autoCreateLabel">
                                    <el-radio value="true" size="large">自动生成</el-radio>
                                    <el-radio value="false" size="large">手动配置</el-radio>
                                  </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="自动添加Service" prop="" >
                                <el-switch
                                v-model="autoCreateService"
                                active-text="启用"
                                inactive-text="禁用"
                                >
                                </el-switch>
                            </el-form-item>
                        </el-col>
                      </el-row>
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
                            <el-tab-pane label="POD标签" name="podLabel">
                                <Table :list="options.podLabelList"></Table>
                            </el-tab-pane>
                          </el-tabs>
                    </el-card>
                </div>
            </el-tab-pane>

            <el-tab-pane label="调度配置" name="schedule">
                <scheduleConfig :list="options.nodeSelectorList"></scheduleConfig>
            </el-tab-pane>

            <el-tab-pane label="存储卷配置" name="volume">
                <volume></volume>
            </el-tab-pane>

            <el-tab-pane label="容器配置" name="container">container</el-tab-pane>

            <el-tab-pane label="初始化容器" name="initContainer">initContainer</el-tab-pane>
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