import Vue from 'vue'
import Router from 'vue-router'

import unitRouter from './unit'
import schoolRouter from './school'
import studentRouter from './student'
import commonRouter from './common'

Vue.use(Router)

export default new Router({
  base: '/wspf/',
  routes: [
    commonRouter,
    unitRouter,
    schoolRouter,
    studentRouter
  ]
})
