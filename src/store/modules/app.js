import Cookies from 'js-cookie'

import { UPDATE_SIDEBAR_STATUS } from '../types'

const state = {
    sidebarStatus: Cookies.get('sidebarStatus')
};

const mutations = {
    [UPDATE_SIDEBAR_STATUS](state) {
        if (state.sidebarStatus) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
        state.sidebarStatus = !state.sidebarStatus
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