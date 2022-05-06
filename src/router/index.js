import { createRouter, createWebHashHistory } from 'vue-router'
//导入工具
import { localGet, localSet } from "@/utils/auth";
import axios from "@/utils/axios";
import { mainStore } from "@/store";

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/introduce'
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: () => import(/* webpackChunkName: "login" */ '../views/Introduce.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "login" */ '../views/Register.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('../views/404.vue')
    }

  ]
})

//不需要token的路由
const constRouter = ["login", "register"];

router.beforeEach((to, from, next) => {
  if (constRouter.includes(to.name)) {
    next();
    return;
  }

  // 如果不是 /login 或者 /register，判断是否有 token
  if (!localGet("token")) {
    // 如果没有，则跳至登录页面
    next({ path: "/login" });
  } else {
    // 否则继续判断store是否已存在路由
    const store = mainStore();    // 实例化仓库
    let routers = store.routers;
    if (routers != null) {
      next();
    } else {
      //若store不存在路由，则请求后端获取路由
      axios.get("/sys/permission/router").then((res) => {
        store.routers = res;
        //添加动态路由
        res.forEach((element) => {
          router.addRoute({
            path: element.href,
            meta: { title: element.title },
            name: element.title,
            component: () => import(`../views/${element.component}.vue`),
          });
        });
        next(to.path);
      })
    }

  }

}
)










export default router