<template>
  <div class="main">
    <Menu_Bar title="勤工助学管理系统" :menuList=menu></Menu_Bar>
    <div class="content">
      <Top :username="user.username" :userType="user.usertype"></Top>
      <transition>
        <router-view></router-view>
      </transition>
      <Bottom title="电子科技大学·成都寻道科技有限公司"></Bottom>
    </div>
  </div>
</template>

<script>
  import Top from './layout/Top'
  import Bottom from './layout/Bottom'
  import MenuBar from './layout/MenuBar'
  import Vue from 'vue'
  import axios from 'axios'
  import util from '../js/util'

  export default {
    name: 'Main',
    data () {
      return {
        user: {
          username: '',
          usertype: ''
        },
        unitMenu: [
          {
            type: '岗位管理',
            list: [
              {link: '/unit/job', name: '岗位管理', icon: '#icon-icon-test1', color: '#29D582'},
              {link: '/unit/job_application', name: '岗位申请管理', icon: '#icon-icon-test10', color: '#24CCF6'}
            ]
          },
          {
            type: '招聘管理',
            list: [
              {link: '/unit/recruit', name: '岗位招聘', icon: '#icon-icon-test16', color: '#00AAFF'},
              {link: '/unit/recruit_application', name: '岗位招聘历史', icon: '#icon-icon-test17', color: '#CC60FF'}
            ]
          },
          {
            type: '学生考核',
            list: [
              {link: '/unit/check', name: '学生考核', icon: '#icon-icon-test2', color: '#FF53C7'}
            ]
          }
        ],
        schoolMenu: [
          {
            type: '岗位管理',
            list: [
              {link: '/school/unit', name: '设岗单位管理', icon: '#icon-icon-test3', color: '#29D582'},
              {link: '/school/job_check', name: '岗位申请管理', icon: '#icon-icon-test20', color: '#24CCF6'}
            ]
          },
          {
            type: '招聘管理',
            list: [
              {link: '/school/c_recruit', name: '在招岗位列表', icon: '#icon-icon-test1', color: '#00AAFF'},
              {link: '/school/recruit', name: '历史申请列表', icon: '#icon-icon-test17', color: '#CC60FF'}
            ]
          },
          {
            type: '学生考核',
            list: [
              {link: '/school/check', name: '学生考核', icon: '#icon-icon-test2', color: '#FF53C7'}
            ]
          }
        ],
        studentMenu: [
          {
            type: '岗位管理',
            list: [
              {link: '/student/job', name: '我的岗位', icon: '#icon-icon-test18', color: '#29D582'},
              {link: '/student/recruiting_job', name: '招聘公告', icon: '#icon-icon-test16', color: '#24CCF6'},
              {link: '/student/feedback', name: '投递反馈', icon: '#icon-icon-test19', color: '#00AAFF'}
            ]
          },
          {
            type: '考核',
            list: [
              {link: '/student/check', name: '考核记录', icon: '#icon-icon-test2', color: '#CC60FF'},
              {link: '/student/fund', name: '资金发放记录', icon: '#icon-icon-test17', color: '#FF53C7'}
            ]
          }
        ]
      }
    },
    computed: {
      menu: {
        get: function () {
          if (this.user.usertype === 'student') {
            return this.studentMenu
          } else if (this.user.usertype === 'school') {
            return this.schoolMenu
          } else if (this.user.usertype === 'unit') {
            return this.unitMenu
          }
        },
        set: function (value) {
          this.user.usertype = value
        }
      }
    },
    created: function () {
      Vue.prototype.$http = axios
      Vue.prototype.$utils = util
//      this.$store.commit('SET_TOKEN', this.$utils.getUrlKey('token'))
//      this.$store.commit('SET_TOKEN', this.getCookie('token'))
      sessionStorage.setItem('token', this.getCookie('token'))
      axios.defaults.withCredentials = true
      var wspServer = require('../wsp_info.json')
      axios.defaults.baseURL = wspServer.wsp_url

      axios.interceptors.request.use((config) => {
        if (config.params === undefined) {
          config['params'] = {}
        }
        config['params']['token'] = sessionStorage.getItem('token')
//        config['params']['token'] = this.$store.state.token
        return config
      }, function (error) {
        return Promise.reject(error)
      })

      axios.interceptors.response.use(
        response => {
          if (response.data.status !== true) {
            switch (response.data.code) {
              case 10001:
                this.$Modal.warning({
                  title: '您的登录身份无效',
                  content: response.data.message,
                  onOk: function () {
                    window.location.href = 'http://icp-test.xdbigdata.com'
                  }
                })
                return Promise.reject()
              case 10002:
                this.$Modal.warning({
                  title: '您的登录身份无效',
                  content: response.data.message,
                  onOk: function () {
                    window.location.href = 'http://icp-test.xdbigdata.com'
                  }
                })
                return Promise.reject()
              case 10004:
                this.$Modal.warning({
                  title: '您的登录身份无效',
                  content: response.data.message,
                  onOk: function () {
                    window.location.href = 'http://icp-test.xdbigdata.com'
                  }
                })
                return Promise.reject()
            }
            return response
          } else {
            return response
          }
        },
        error => {
          if (error.response) {
            console.log(error)
          }
          return Promise.reject(error.response.data)
        })
    },
    mounted: function () {
      this.$http.get('/users/info/')
        .then(response => {
          if (response.data.status === true) {
            this.menu = response.data.data.type
            this.user.username = response.data.data.user.realName
            sessionStorage.setItem('user', JSON.stringify(response.data.data.user))
            if (this.user.usertype === 'student') {
              this.$router.push('/student/job')
            } else if (this.user.usertype === 'school') {
              this.$router.push('/school/unit')
            } else if (this.user.usertype === 'unit') {
              this.$router.push('/unit/job')
            }
          }
        })
    },
    methods: {
      getCookie: function (cname) {
        var name = cname + '='
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i]
          while (c.charAt(0) === ' ') c = c.substring(1)
          if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
        }
        return ''
      }
    },
    components: {
      Top,
      Bottom,
      Menu_Bar: MenuBar
    }
  }
</script>
