//封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
import request from "./index.js";
import { apiUrl } from '../config/index.js';

//命名空间
export const getDeploymentListApi = (clusterId,namespace) => {
    console.log("请求获取deployment列表");
    return request(apiUrl.getDeploymentListApi, {"clusterId":clusterId,"namespace":namespace}, "get",2000);
}
export const deleteDeploymentApi = (clusterId,name,namespace) => { 
    console.log("请求删除的Deployment ID",name,namespace);
    return request(apiUrl.deleteDeploymentApi, {clusterId,name,namespace}, "post",2000);
}
export const getDeploymentApi = (data) => { 
    console.log("请求获取的Deployment ID",data);
    return request(apiUrl.getDeploymentApi, data, "get",2000);
}
export const addDeploymentApi = (data) => { 
    console.log("请求添加的Deployment配置",data);
    return request(apiUrl.addDeploymentApi, data, "post",2000);
}

export const updateDeploymentApi = (data) => { 
    console.log("请求更新的Deployment配置",data);
    return request(apiUrl.updataDeploymentApi, data, "post",2000);
}

