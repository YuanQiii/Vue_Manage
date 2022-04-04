/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 22:31:18
 * @FilePath: \vue_manage\src\utils\permission.js
 */
import router from "@/router";
import store from "@/store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { getToken } from "@/utils/auth"; // 验权
import { adminLoginApi } from "@/api/user";

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    // token未过期直接跳转
    if (to.path === "/login") {
      next({
        path: "/",
      });
    } else {
      if (store.state.user.roles.length == 0) {
        adminLoginApi().then((response) => {
          store.commit("user/SET_NAME", response.data.username);
          store.commit("user/SET_AVATAR", response.data.icon);
          store.commit("user/SET_ROLES", response.data.roles);

          store.commit("pemission/GENERATE_ROUTES", response.data.menus);

          // 动态添加可访问路由表
          store.state.pemission.addRouters.forEach((element) => {
            router.addRoute(element);
          });

          // 如果 addRoute 并未完成，路由守卫会一层一层的执行执行，直到 addRoute 完成，找到对应的路由
          next({ ...to, replace: true });

        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
