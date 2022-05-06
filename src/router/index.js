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
      name: '/404',
      component: () => import('../views/404.vue')
    }

  ]
})


router.beforeEach((to, from, next) => {
  if (to.name == 'Login' || to.name == 'Register') {
    next();
    return;
  }
  // 实例化仓库
  const store = mainStore();
  let routers = store.routers;
  if (routers != null) {
    next();
  } else {
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
)



//添加动态路由
// navData.forEach(element => {
//   router.addRoute({
//     path: element.path,
//     meta: { title: element.title },
//     name: element.name,
//     component: () => import(`../views/${element.component}.vue`)
//   })
// });






export default router