export default [
    {
        url: '',
        name: 'DashBoard',
        icon: 'el-icon-data-line',
        menuId: 1,
        children: [
            {
                url: '/introduce',
                name: '系统介绍',
                icon: 'el-icon-data-line',
                menuId: 1001,
                children: []
            },
            {
                url: '/dashboard',
                name: 'DshBoard',
                icon: 'el-icon-odometer',
                menuId: 1002,
                children: []
            },
            {
                url: '/add',
                name: '添加商品',
                icon: 'el-icon-plus',
                menuId: 1003,
                children: []
            }
        ]
    },
    {
        url: '',
        name: '首页配置',
        icon: 'el-icon-picture',
        menuId: 2,
        children: [
            {
                url: '/swiper',
                name: '轮播图配置',
                icon: 'el-icon-data-line',
                menuId: 2001,
                children: []
            },
            {
                url: '/hot',
                name: '热销商品配置',
                icon: 'el-icon-odometer',
                menuId: 2002,
                children: []
            },
            {
                url: '/new',
                name: '新品上线配置',
                icon: 'el-icon-plus',
                menuId: 2003,
                children: []
            },
            {
                url: '/recommend',
                name: '为你推荐配置',
                icon: 'el-icon-plus',
                menuId: 2004,
                children: []
            }
        ]
    },
    {
        url: '',
        name: '系统管理',
        icon: 'el-icon-picture',
        menuId: 3,
        children: [
            {
                url: '/account',
                name: '修改密码',
                icon: 'el-icon-data-line',
                menuId: 2001,
                children: []
            },
            {
                url: '/permission',
                name: '权限管理',
                icon: 'el-icon-data-line',
                menuId: 2002,
                children: []
            },
            {
                url: '/user',
                name: '会员管理',
                icon: 'el-icon-data-line',
                menuId: 2003,
                children: []
            },
            {
                url: '/role',
                name: '角色管理',
                icon: 'el-icon-data-line',
                menuId: 2004,
                children: []
            },
            {
                url: '/dept',
                name: '部门管理',
                icon: 'el-icon-data-line',
                menuId: 2005,
                children: []
            }
        ]
    }
]