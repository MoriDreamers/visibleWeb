//RT

console.log("apiUrl",import.meta.env);
//const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL =  "http://localhost:8080" //调试本地接口环境
export const apiUrl = {

    apiLogin: `${BASE_URL}/api/auth/login`,
    apiLogout: `${BASE_URL}/api/auth/logout`,
    //集群资源
    getClusterListApi : `${BASE_URL}/api/cluster/list`,
    addClusterApi : `${BASE_URL}/api/cluster/add`,
    deleteClusterApi : `${BASE_URL}/api/cluster/delete`,
    getClusterApi : `${BASE_URL}/api/cluster/get`,
    updateClusterApi:`${BASE_URL}/api/cluster/update`,
    //节点资源
    getNodeListApi : `${BASE_URL}/api/node/list`,
    updateNodeListApi : `${BASE_URL}/api/node/update`,
    //命名空间资源
    getNameSpaceListApi : `${BASE_URL}/api/namespace/list`,
    addNameSpaceApi : `${BASE_URL}/api/namespace/add`,
    deleteNameSpaceApi : `${BASE_URL}/api/namespace/delete`,
    getNameSpaceApi : `${BASE_URL}/api/namespace/get`,  
    updateNameSpaceApi:`${BASE_URL}/api/namespace/update`,
    //POD资源
    getPodListApi: `${BASE_URL}/api/pod/list`,
    getPodApi : `${BASE_URL}/api/pod/get`,
    deletePodApi : `${BASE_URL}/api/pod/delete`,
    //deployment资源
    getDeploymentListApi: `${BASE_URL}/api/deployment/list`,
    getDeploymentApi : `${BASE_URL}/api/deployment/get`,
    deleteDeploymentApi : `${BASE_URL}/api/deployment/delete`,
    updataDeploymentApi:`${BASE_URL}/api/deployment/update`,
    addDeploymentApi:`${BASE_URL}/api/deployment/add`,
    //secret资源
    getSecretListApi: `${BASE_URL}/api/secret/list`,
    getSecretApi: `${BASE_URL}/api/secret/get`,
    //persistentvolumeclaim资源
    getPersistentVolumeClaimListApi: `${BASE_URL}/api/persistentvolumeclaim/list`,
    //configmap资源
    getConfigMapListApi: `${BASE_URL}/api/configmap/list`,
    //service资源
    getServiceListApi: `${BASE_URL}/api/service/list`,
    //ingress资源
    getIngressListApi: `${BASE_URL}/api/ingress/list`,
    //secret资源
    getSecretListApi: `${BASE_URL}/api/secret/list`,
}
export const apiHeader = {
    TokenName: "Authorization",
}

