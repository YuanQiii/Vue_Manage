/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 16:41:12
 * @FilePath: \vue_manage\src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue"; // svg组件
Vue.use(ElementUI);

// 全局注册
Vue.component("svg-icon", SvgIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
