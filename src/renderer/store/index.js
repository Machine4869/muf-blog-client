import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    hexoPath: '',
    backupRepo: '',
    isServerLoading: false,
  },
  // 修改vuex的值
  mutations:{
    // hexoPath(state,hexoPath){
    //     state.hexoPath = hexoPath
    // },
    // isServerLoading(state,isServerLoading){
    //   state.isServerLoading = isServerLoading
    // }
  },
  actions:{
    // hexoPath(context,hexoPath){
    //   context.commit('hexoPath',hexoPath)
    // },
    // isServerLoading(context,isServerLoading){
    //   context.commit('isServerLoading',isServerLoading)
    // }
  }
})
