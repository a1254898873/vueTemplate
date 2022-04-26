import { createRouter, createWebHashHistory } from 'vue-router'
import navData from '@/mock/navData'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/introduce'
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
    }
  ]
})



//添加动态路由
navData.forEach(element => {
  router.addRoute({
    path: element.path,
    meta: { title: element.title },
    name: element.name,
    component: () => import(`../views/${element.component}.vue`)
  })
});






export default router