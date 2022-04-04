/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-02 13:45:08
 * @FilePath: \vue_manage\src\store\modules\user.js
 */

import { SET_TOKEN, SET_NAME, SET_AVATAR, SET_ROLES } from "../types";

import { getToken } from "@/utils/auth";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  roles: [],
};

const mutations = {
  [SET_TOKEN]: (state, payload) => {
    state.token = payload;
  },
  [SET_NAME]: (state, payload) => {
    state.name = payload;
  },
  [SET_AVATAR]: (state, payload) => {
    state.avatar = payload;
  },
  [SET_ROLES]: (state, payload) => {
    state.roles = payload;
  },
};

const getters = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
