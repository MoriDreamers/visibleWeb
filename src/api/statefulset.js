    //封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
    import request from "./index.js";
    import { apiUrl } from '../config/index.js';

    //命名空间
    export const getStatefulSetListApi = (clusterId,namespace) => {
        console.log("请求获取statefulset列表");
        return request(apiUrl.getStatefulSetListApi, {"clusterId":clusterId,"namespace":namespace}, "get",2000);
    }
    export const deleteStatefulSetApi = (clusterId,name,namespace) => { 
        console.log("请求删除的StatefulSet ID",name,namespace);
        return request(apiUrl.deleteStatefulSetApi, {clusterId,name,namespace}, "post",2000);
    }
    export const getStatefulSetApi = (data) => { 
        console.log("请求获取的StatefulSet ID",data);
        return request(apiUrl.getStatefulSetApi, data, "get",2000);
    }
    export const addStatefulSetApi = (data) => { 
        console.log("请求添加的StatefulSet配置",data);
        return request(apiUrl.addStatefulSetApi, data, "post",2000);
    }

    export const updateStatefulSetApi = (data) => { 
        console.log("请求更新的StatefulSet配置",data);
        return request(apiUrl.updataStatefulSetApi, data, "post",2000);
    }

