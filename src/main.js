/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 16:41:12
 * @FilePath: \vue_manage\src\main.js
 */

import App from "./App.vue";
import router from "./router";
import store from "./store";

import 'normalize.css/normalize.css'

import '@/icons/index'
import '@/utils/permission'

import Directives from '@/directives/index'
Vue.use(Directives)

import Filters from '@/filters/index'
Vue.use(Filters)

import wlExplorer from "wl-explorer";
import "wl-explorer/lib/wl-explorer.css"
Vue.use(wlExplorer);

//dev
import Vue from "vue";
import VCharts from 'v-charts'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(VCharts)
Vue.use(ElementUI)

 
//prod
// Vue.use(ELEMENT);
// Vue.use(VeIndex);
// Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
