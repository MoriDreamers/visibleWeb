
const Layout = () => import("../view/layout/Layout.vue");


export const nodeRoutes = {
    path: "/node",
    component: Layout, // 确保这里是有效的组件
    redirect: "/node/list", // 默认重定向到子路由
    children: [
        {
            path: "list", 
            component: () => import("../view/node/List.vue") 
        },
        
    ]
}