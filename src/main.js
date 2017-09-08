// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import iView from 'iview'
import './styles/index.less'
import 'iview/dist/styles/iview.css'
import './iconfont'

Vue.use(iView)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/') {
    window.location.href = 'http://icp-test.xdbigdata.com'
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
