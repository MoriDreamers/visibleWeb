//RT

console.log("apiUrl",import.meta.env);
//const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL =  "http://localhost:8080" //调试本地接口环境
export const apiUrl = {

    apiLogin: `${BASE_URL}/api/auth/login`,
    apiLogout: "",
    userGetList: `${BASE_URL}/api/test/userlist`,
    userDelete:"https://apifoxmock.com/m1/5997652-5686155-default/api/user/delete",
    userAdd:"http://127.0.0.1:4523/m2/5997652-5686155-default/269645616",
    userModify:"http://127.0.0.1:4523/m2/5997652-5686155-default/270111859?apifoxApiId=270111859",
    userLogout:"http://127.0.0.1:4523/m1/5997652-5686155-default/api/user/delete",
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
    updateNameSpaceApi:`${BASE_URL}/api/namespace/update`    
    

}

export const apiHeader = {
    TokenName: "Authorization",
}

