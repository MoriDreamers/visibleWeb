

// user.js 文件
const Layout = () => import("../view/layout/Layout.vue");
export const userRouter = {
    path: "/user",
    component: Layout, // 确保这里是有效的组件
    children: [
        {
            path: "list", 
            component: () => import("../view/user/ListUser.vue") // 子路由正确配置
        },
        {
            path: "view", 
            component: () => import("../view/user/ViewUser.vue") // 子路由正确配置
        }
    ]
}
/*
export const userRouter = {
    path: "/cluster",
    component: Layout, // 确保这里是有效的组件
    children: [
        {
            path: "list", 
            component: () => import("../view/user/ListUser.vue") // 子路由正确配置
        },
        {
            path: "view", 
            component: () => import("../view/user/ViewUser.vue") // 子路由正确配置
        }
    ]
}*/