/*
    封装axios:
    超时时间
    URL
    请求头
    请求方法
    请求参数
*/
import axios from 'axios'
import { apiHeader } from '../config'
import { jmupRouter } from '../router'
import router from '../router/index.js'
import { ElMessage } from 'element-plus'

const request = (url = '',data = {} , method , timeout = 2000) =>{ //默认值写到接受参数里
    return new Promise((resolve, reject) => {
        method = method.toLowerCase()//将请求方法转为小写以统一处理
        if (method === 'get'){
            axios({
                method:method,
                params:data,
                timeout:timeout,
                url:url,
            }).then((Response)=>{
                console.log("请求成功")
                resolve(Response.data)
            }).catch((error)=>{
                reject(error)
            })
        }else if (method === 'post'){
            axios({
                method:method,
                data:data,
                timeout:timeout,
                url:url,
            }).then((Response)=>{
                console.log("请求成功")
                resolve(Response.data)
            }).catch((error)=>{
                reject(error)
            })
        }
    })
}

export default request //方法导出

//axios默认全局配置
axios.defaults.timeout = 1000; //超时时间

//这个是请求级别的拦截器，之前的router守卫是页面拦截器
axios.interceptors.request.use(function (config) {
    //在发送之前添加一点功能
    console.log('这是请求拦截器',config)
    
    if (config.method == 'get'){
      //解决缓存问题
      let timeStamp = (new Date()).getTime()
      //添加时间戳在请求当中 一般都在GET请求里添加，而POST不需要一般
      console.log(timeStamp)
      if (config.params){//即使config.params没有timeStamp条目，这段代码也不会报错。这是因为JavaScript允许直接在对象上添加新的属性。即使config.params之前没有timeStamp，也可以通过config.params.timeStamp = timeStamp来添加
        config.params.timeStamp = timeStamp
      }else{//如果没有params，就添加一个
        config.params = {
          timeStamp:timeStamp
        }
      }
    }
    //取出token
    let value = "";
    try {
        value = window.localStorage.getItem(apiHeader.TokenName) || "";
    } catch (error) {
        console.error("从本地获取token失败", error);
    }

    config.headers[apiHeader.TokenName] = value;
    return config;//千万记得返回config，否则请求会无法完成
  }, function (error) {
    return Promise.reject(error);
  })

//响应拦截器
axios.interceptors.response.use(function (response){
    //在这里对返回的数据进行处理
    //超出2xx范围的状态码都会触发该函数
    //go后台默认只要请求了就返回201 但是我定义的data.status401为401 所以这里要判断一下
    if (response.status === 200 && response.data.status !== 401){
      return Promise.resolve(response)
    }else if (response.data.status === 401) {
      //说明token失效
    ElMessage({
        message: '您的登录信息已失效，请重新登录.',
        type: 'warning',
    })
    window.localStorage.removeItem(apiHeader.TokenName)
      //跳转到登录页面 
    if(router.currentRoute.path!== 'login') {      
        jmupRouter('login')
    }
      return Promise.reject(response)

    }return response;
    },function(error){ 
        ElMessage({
            message: '请求错误，请联系管理员，错误信息为：'+ error.message,
            type: 'error',
        })
      return Promise.reject(error);
    }
  )

