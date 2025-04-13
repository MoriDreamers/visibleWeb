//封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
import request from "./index.js";
import { apiUrl } from '../config/index.js';

//集群
export const getClusterListApi = () => {
    console.log("请求获取集群列表");
    return request(apiUrl.getClusterListApi, {}, "get",2000);
}

export const deleteClusterApi = (id) => { 
    console.log("请求删除的集群ID",id);
    return request(apiUrl.deleteClusterApi, {"clusterId":id}, "get",2000);
}

export const getClusterApi = (id) => { 
    console.log("请求获取的集群ID",id);
    return request(apiUrl.getClusterApi, {"clusterId":id}, "get",2000);
}

export const addClusterApi = (data) => { 
    console.log("请求添加的集群配置",data);
    return request(apiUrl.addClusterApi, data, "post",2000);
}

export const updateClusterApi = (data) => { 
    console.log("请求更新的集群配置",data);
    return request(apiUrl.updateClusterApi, data, "post",2000);
}
//用户
export const getUserLogoutApi = () => { 
    console.log("请求用户登出");
    return request(apiUrl.userLogout, {}, "get",2000);
}

//节点
export const getNodeListApi = (clusterId) => {
    console.log("请求获取节点列表");
    return request(apiUrl.getNodeListApi, {"clusterId":clusterId}, "get",2000);
}


export const updateNodeListApi = (clusterId,name,item) => { 
    console.log("更新节点",name);
    return request(apiUrl.updateNodeListApi,{clusterId,name,item}, "post",2000);
}
