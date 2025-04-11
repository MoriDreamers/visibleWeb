
const Layout = () => import("../view/layout/Layout.vue");


export const clusterRoutes = {
    path: "/cluster",
    component: Layout, // 确保这里是有效的组件
    redirect: "/cluster/list", // 默认重定向到子路由
    children: [
        {
            path: "add", 
            component: () => import("../view/cluster/Add.vue")
        },
        {
            path: "list", 
            component: () => import("../view/cluster/List.vue") 
        },
        
    ]
}