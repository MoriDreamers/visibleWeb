//封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
import request from "./index.js";
import { apiUrl } from '../config/index.js';

//命名空间
export const getNameSpaceListApi = () => {
    console.log("请求获取命名空间列表");
    return request(apiUrl.getNameSpaceListApi, {}, "get",2000);
}

export const deleteNameSpaceApi = (id) => { 
    console.log("请求删除的命名空间ID",id);
    return request(apiUrl.deleteNameSpaceApi, {id}, "get",2000);
}

export const getNameSpaceApi = (id) => { 
    console.log("请求获取的命名空间ID",id);
    return request(apiUrl.getNameSpaceApi, {id}, "get",2000);
}

export const addNameSpaceApi = (data) => { 
    console.log("请求添加的命名空间配置",data);
    return request(apiUrl.addNameSpaceApi, data, "post",2000);
}

export const updateNameSpaceApi = (data) => { 
    console.log("请求更新的命名空间配置",data);
    return request(apiUrl.updateNameSpaceApi, data, "post",2000);
}
