
const Layout = () => import("../view/layout/Layout.vue");


export const podRoutes = {
    path: "/pod",
    component: Layout,
    redirect: "/pod/list",
    children: [
        {
            path: 'list',
            component: ()=>import ('../view/pod/List.vue')
        }
        
    ]
}


export const statefulsetRoutes = {
    path: "/statefulset",
    component: Layout,
    redirect: "/statefulset/list",
    children: [
        {
            path: 'list',
            component: ()=>import ('../view/statefulset/List.vue')
        },
        {
            path: 'add',
            component: ()=>import ('../view/statefulset/Add.vue')
        }
    ]
}

export const deploymentRoutes = {
    path: "/deployment",
    component: Layout,
    redirect: "/deployment/list",
    children: [
        {
            path: 'list',
            component: ()=>import ('../view/deployment/List.vue')
        },
        {
            path: 'add',
            component: ()=>import ('../view/deployment/Add.vue')
        }
    ]
}

export const daemonsetRoutes = {
    path: "/daemonset",
    component: Layout,
    redirect: "/daemonset/list",
    children: [
        {
            path: 'list',
            component: ()=>import ('../view/daemonset/List.vue')
        },
        {
            path: 'add',
            component: ()=>import ('../view/daemonset/Add.vue')
        }
    ]
}


export const cronjobRoutes = {
    path: "/cronjob",
    component: Layout,
    redirect: "/cronjob/list",
    children: [
        {
            path: 'list',
            component: ()=>import ('../view/cronjob/List.vue')
        },
        {
            path: 'add',
            component: ()=>import ('../view/cronjob/Add.vue')
        }
    ]
}