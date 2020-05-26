// 导航图标 909399


import Vue from 'vue'
import axios from 'axios'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
// 自定义主题色 #1591AA
import './assets/themes/dark/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

// md渲染
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

// #17D0D6
// 全局样式
import './styles/global.scss'

// 字体图标
import './assets/fonts/iconfont.css'

import App from './App'
import router from './router'
import store from './store'

// 自定义的公共js
import common from './js/common.js'
Vue.prototype.$common = common

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
