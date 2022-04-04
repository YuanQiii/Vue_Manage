/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 16:41:12
 * @FilePath: \vue_manage\src\store\index.js
 */
import Vue from "vue";
import Vuex from "vuex";

import user from "./modules/user";
import pemission from "./modules/pemission";
import app from './modules/app'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    pemission,
    app
  },
});
