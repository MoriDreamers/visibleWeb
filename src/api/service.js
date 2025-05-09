//封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
import request from "./index.js";
import { apiUrl } from '../config/index.js';

//命名空间
export const getServiceListApi = (data) => {
    console.log("请求获取service列表");
    return request(apiUrl.getServiceListApi, data, "get",2000);
}
