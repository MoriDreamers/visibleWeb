//封装一些前后端交互的请求 调用request方法 使用config中解构的api地址
import request from "../api/index.js";
import { apiUrl } from '../config';

export const getUserListApi = () => {
    return request(apiUrl.userGetList, {}, "get",2000);
}

export const getUserDeleteApi = (id) => { 
    console.log("请求删除的用户ID",id);
    return request(apiUrl.userDelete, {id}, "get",2000);
}

export const getUserAddApi = (object) => { 
    console.log("请求添加的用户资料",object);
    return request(apiUrl.userAdd, {object}, "post",2000);
}

export const getUserModifyApi = (object) => { 
    console.log("请求修改的用户资料",object);
    return request(apiUrl.userModify, {object}, "post",2000);
}

export const getUserLogoutApi = () => { 
    console.log("请求用户登出");
    return request(apiUrl.userLogout, {}, "get",2000);
}