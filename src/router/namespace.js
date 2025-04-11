
const Layout = () => import("../view/layout/Layout.vue");


export const namespaceRoutes = {
    path: "/namespace",
    component: Layout, // 确保这里是有效的组件
    redirect: "/namespace/list", // 默认重定向到子路由
    children: [
        {
            path: "add", 
            component: () => import("../view/namespace/Add.vue")
        },
        {
            path: "list", 
            component: () => import("../view/namespace/List.vue") 
        },
        
    ]
}