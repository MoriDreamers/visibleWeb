import { defineStore } from "pinia";
//创建一个全局容器 接受两个参数 容器ID 容器内容
//defineStore返回的是一个函数 这个函数我们一般称为useXXXXXXX
export const useStoreDemo = defineStore('storeDemo',{
    //容器内容
    //state：存储全局状态
    //data
    state: () => {
        return{
            msg:"Hello pinia!"
        }
    },
    //相当于计算属性
    getters:{},
    //相当于methods 修改数据的方法
    actions:{
        changeStoreDemo(value){
            this.msg=value
        }
    }
})


//管理ITEM数据
export const useItem = defineStore('item',{
    //容器内容
    //state：存储全局状态
    //data
    state: () => {
        return{
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
                    relicas:1,
                    //POD的模板
                    template:{
                        metadata:{
                            labels:{},
                            annotations:{},
                        },
                        spec:{
                            imagePullSecrets:[],
                            nodeSelector:{},
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
        }
    },
    //相当于计算属性
    getters:{},
    //相当于methods 修改数据的方法
    actions:{
        }
})