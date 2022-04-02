/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 21:21:41
 * @FilePath: \vue_manage\src\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

const Login = () => import("@/views/login/Login.vue");
const wrongPage = () => import("@/views/404/wrongPage.vue");

export const constantRouterMap = [
  {
    path: "/login",
    name: "login",
    component: Login,
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: wrongPage,
    hidden: true,
  },
];

export const asyncRouterMap = [{ path: "*", redirect: "/404", hidden: true }];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

export default router;
