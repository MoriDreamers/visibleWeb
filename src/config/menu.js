//自动化渲染尝试
//一共三层 由index作为唯一标识 如果index未定义或者相同会导致展开时出现重复
//嵌套层级用subMenu定义 子菜单由items定义


export const MenuConfig = () => [
    //集群
    {
        title:"集群操作",
        index:"/cluster",
        icon:"Grid",
        items:[
            {
                index:"/cluster/list",
                title:"集群列表",
            },
            {
                index:"/node/list",
                title:"查看节点",
            },
            {
                index:"/namespace/list",
                title:"命名空间",
            },
        ]
    },
        //调度
        {
            title:"资源调度",
            index:"/schedule",
            icon:"Operation",
            subMenu: [
                {
                    title: "Pod",
                    index: "/pod/list",
                    items: [
                        {
                            index: "/pod/list",
                            title: "查看列表"
                        }
                    ]
                },
                {
                    title: "Deployment",
                    index: "/deployment/list",
                    items: [
                        {
                            index: "/deployment/list",
                            title: "查看"
                        },
                        {
                            index: "/deployment/add",
                            title: "创建"
                        }
                    ]
                },
                {
                    title: "StatefulSet",
                    index: "/statefulset/list",
                    items: [
                        {
                            index: "/statefulset/list",
                            title: "查看"
                        },
                        {
                            index: "/statefulset/add",
                            title: "创建"
                        }
                    ]
                },
                {
                    title: "DaemonSet",
                    index: "/daemonset/list",
                    items: [
                        {
                            index: "/daemonset/list",
                            title: "查看"
                        },
                        {
                            index: "/daemonset/add",
                            title: "创建"
                        }
                    ]
                },
                {
                    title: "CronJob",
                    index: "/cronjob/list",
                    items: [
                        {
                            index: "/cronjob/list",
                            title: "查看"
                        },
                        {
                            index: "/cronjob/add",
                            title: "创建"
                        }
                    ]
                }
            ]
        },
    //产品管理
    /*{
        title:"资产管理",
        index:"/product",
        icon:"Tools",
        subMenu:[
            {
                index:"/product/list",
                title:"资产列表",
                icon:"Histogram",
                items:[
                    {
                        index:"/product/list/controller",
                        title:"集群控制",
                    }
                ],
            },
            {
                index:"/product/view",
                title:"资产视图",
                icon:"InfoFilled",
                items:[
                    {
                        index:"/product/list/view",
                        title:"集群状态",
                    }
                ],
            },
        ]
    },
    {
        title:"樱之杜净梦者",
        icon:"Menu",
        index:"/moridreamers",
        subMenu:[
            {
                title:"女主角们",
                icon:"Flag",
                index:"/moridreamers/girls",
                items:[
                    {
                        title:"桐远暮羽",
                        index:"/moridreamers/girls/muyu",
                    },
                    {
                        title:"秋津圆香",
                        index:"/moridreamers/girls/yuanxiang",
                    },
                    {
                        title:"闲宫真幌",
                        index:"/moridreamers/girls/zhenhuang",
                    },
                    {
                        title:"衿坂美冬",
                        index:"/moridreamers/girls/meidong",
                    },
                    {
                        title:"吹上初音",
                        index:"/moridreamers/girls/miku",
                    },

                ]
            }
        ],
    }
    */
]
