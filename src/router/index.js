//导入创建路由的方法
import { createRouter,createWebHashHistory } from 'vue-router'
import { apiHeader } from '../config'
import { userRouter } from './user.js'
import { clusterRoutes } from './cluster.js'
import { namespaceRoutes }from  './namespace.js'
import {podRoutes, deploymentRoutes, statefulsetRoutes, daemonsetRoutes, cronjobRoutes} from './schedule.js'
import { nodeRoutes }from './node.js'
export const jmupRouter=(url) =>{
    router.replace(url)
}

//路由集合处理，创建一个路由对象，并且包括子路由

const Login = () => import('../view/Login.vue')
//const Index = () => import('../view/Index.vue')
const Layout = () => import('../view/layout/Layout.vue')
//定义路由映射 route是一条路由 许多放到一起就成了集合router
const routes = [
    userRouter,
    clusterRoutes,
    nodeRoutes,
    namespaceRoutes,
    podRoutes,
    deploymentRoutes,
    statefulsetRoutes,
    cronjobRoutes,
    daemonsetRoutes,
    {path: "/", redirect: "/home" }, // 根路径重定向到 /home
    {path:"/home",component:Layout},
    {path:"/login",component:Login},

    //这玩意实际上是个数组 [] ，在里面插入了很多条对象 {}
]
//创建路由实例
const router = createRouter({
    history : createWebHashHistory(),
    routes,
})
//定义一个全局路由守卫，去判断请求链接有没有token字段
/*
router.beforeEach(
    //测试 如果token字段不是mori，就直接跳转到 /
    (to,from,next) =>{
        if(to.query.token !== "mori" && to.path == "/list"){
            next("/")
            return false
        }
        next()
    }
)
*/
//配置未登录的请求地址拦截
router.beforeEach((to, from, next) => {
    // 获取目标路径和 token
    const toPath = to.path;
    const isLoginPage = toPath === "/login"; // 判断是否是登录页
    const tokenStatus = window.localStorage.getItem(apiHeader.TokenName); // 获取 token

    if (isLoginPage && tokenStatus) {
        // 如果用户已经登录且目标是登录页，重定向到首页
        next("/home");
    } else if (isLoginPage && !tokenStatus) {
        // 如果用户未登录且目标是登录页，允许访问
        next();
    } else if (tokenStatus) {
        // 如果用户已登录且目标不是登录页，允许访问
        next();
    } else {
        // 如果用户未登录且目标不是登录页，重定向到登录页
        next("/login");
    }
});
router.push("/")

export default router