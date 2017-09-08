<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div title-font">
        <Col span="1" class="">
        <router-link to="/unit/recruit">
          <Icon type="chevron-left" size="32px"></Icon>
          返回
        </router-link>
        </Col>
        <Col span="23" class="">
        当前招聘岗位</Col>
      </Row>
      <p class="sub-title-font">本招聘岗位设岗人数{{numberOfNeed}}人，已聘用{{numberOfOn}}人</p>
      <div class="clear">
        <Table :columns="columns" :data="data"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total='total' :current="page" @on-change="changePage" :page-size="this.$store.state.pageSize"></Page>
          </div>
        </div>
      </div>
    </div>


    <Modal
      title="面试详情"
      v-model="modal"
      :mask-closable="false" :closable="false">

      <Form :model="interview" ref="interviewValidate" :rules="ruleValidate">
        <Form-item label="姓名">
          <p>{{interview.name}}</p>
        </Form-item>
        <Form-item label="学号">
          <p>{{interview.userNo}}</p>
        </Form-item>
        <Form-item label="面试结果" prop="result">
          <Select v-model="interview.result" placeholder="请选择...">
            <Option value='PASS'>聘用</Option>
            <Option value='FAIL'>不聘用</Option>
          </Select>
        </Form-item>
        <Form-item label="面试评价(150字以内)" prop="assessment">
          <Input v-model="interview.assessment" type="textarea" placeholder="请输入..." :maxlength="150"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelInputResult">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="inputResult">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal
      title="申请材料"
      v-model="modal2"
      :mask-closable="false"  width="600">

      <table class="p-table">
        <tr>
          <td style="width: 10%">姓名</td>
          <td style="width: 40%">{{detail.applicant.realName}}</td>
          <td style="width: 10%">性别</td>
          <td v-if="detail.applicant.gender === 1" style="width: 40%">男</td>
          <td v-else style="width: 40%">女</td>
        </tr>
        <tr>
          <td>民族</td>
          <td>{{detail.applicant.peopleName}}</td>
          <td>学院</td>
          <td>{{detail.applicant.collegeName}}</td>
        </tr>
        <tr>
          <td>班级</td>
          <td>{{detail.applicant.gradeName}}</td>
          <td>出生年月</td>
          <td>{{detail.birthday}}</td>
        </tr>
        <tr>
          <td>手机</td>
          <td>{{detail.applicant.mobile}}</td>
          <td>邮箱</td>
          <td>{{detail.applicant.email}}</td>
        </tr>
      </table>

      <p class="p-title">学习情况</p>
      <p class="p-content">{{detail.study}}</p>

      <p class="p-title">工作情况</p>
      <p class="p-content">{{detail.work}}</p>

      <p class="p-title">经济情况</p>
      <p class="p-content">{{detail.economic}}</p>

      <p class="p-title">对申请岗位的认识</p>
      <p class="p-content">{{detail.cognition}}</p>

      <p class="p-title">特长和爱好</p>
      <p class="p-content">{{detail.hobbies}}</p>

      <p class="p-title">课程情况</p>
      <!--<p class="p-content">{{detail.schedule}}</p>-->
      <table class="table">
        <thead>
        <td></td>
        <td>周一</td>
        <td>周二</td>
        <td>周三</td>
        <td>周四</td>
        <td>周五</td>
        </thead>
        <tr>
          <td>上午一二节</td>
          <td>
            <span v-if="monday1 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="tuesday1 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="wednesday1 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="thursday1 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="friday1 === 'true'">有课</span>
          </td>
        </tr>
        <tr>
          <td>上午三四节</td>
          <td>
            <span v-if="monday2 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="tuesday2 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="wednesday2 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="thursday2 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="friday2 === 'true'">有课</span>
          </td>
        </tr>
        <tr>
          <td>下午五六节</td>
          <td>
            <span v-if="monday3 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="tuesday3 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="wednesday3 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="thursday3 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="friday3 === 'true'">有课</span>
          </td>
        </tr>
        <tr>
          <td>下午七八节</td>
          <td>
            <span v-if="monday4 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="tuesday4 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="wednesday4 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="thursday4 === 'true'">有课</span>
          </td>
          <td>
            <span v-if="friday4 === 'true'">有课</span>
          </td>
        </tr>
      </table>

      <div slot="footer">

      </div>
    </Modal>

    <Modal
      title="发送面试邀请"
      v-model="modal3"
      :mask-closable="false" :closable="false">

      <Form :model="interview">
        <Form-item label="姓名">
          <p>{{interview.name}}</p>
        </Form-item>
        <Form-item label="学号">
          <p>{{interview.userNo}}</p>
        </Form-item>
        <Form-item label="面试时间" prop="assessment">
          <Date-picker type="date" :options="options3" placeholder="选择日期" style="width: 200px"
                       v-model="interview.date" :editable="false" :clearable="false"></Date-picker>
          <Time-picker format="HH:mm" placeholder="选择时间" style="width: 112px" v-model="interview.time" confirm
                       :editable="false" :clearable="false"></Time-picker>
        </Form-item>
        <Form-item label="面试地点(50字以内)" prop="result">
          <Input type="text" placeholder="请输入..." v-model="interview.position" :maxlength="50"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelInputInterview">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="inputInterview">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

  </div>

</template>

<script>
  import moment from 'moment'

  var querystring = require('querystring')
  export default {
    name: 'JobCurrent',
    data () {
      return {
        options3: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        ruleValidate: {
          name: [
            {required: true, message: '请选择面试结果', trigger: 'blur'}
          ],
          assessment: [
            {required: true, message: '面试评价不能为空', trigger: 'blur'},
            {type: 'string', max: 200, message: '长度不能大于200', trigger: 'blur'}
          ]
        },
        modal: false,
        modal2: false,
        modal3: false,
        detail: {
          applicant: {}
        },
        interview: {
          name: '',
          result: 'PASS',
          userNo: '',
          assessment: '',
          date: '',
          time: '',
          position: ''
        },
        appId: '',
        columns: [
          {
            width: 70,
            align: 'center',
            title: '序号',
            render: (h, params) => {
              return h('span', params.index + (this.page - 1) * this.$store.state.pageSize + 1)
            }
          },
          {
            title: '申请人',
            key: 'name',
            render: (h, params) => {
              return h('span', params.row.applicant.realName)
            }
          },
          {
            title: '学号',
            key: 'userNo',
            render: (h, params) => {
              return h('span', params.row.applicant.userName)
            }
          },
          {
            title: '申请材料',
            key: 'applyId',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#2D8CF0'
                  },
                  on: {
                    click: () => {
                      this.monday1 = false
                      this.tuesday1 = false
                      this.wednesday1 = false
                      this.thursday1 = false
                      this.friday1 = false
                      this.monday2 = false
                      this.tuesday2 = false
                      this.wednesday2 = false
                      this.thursday2 = false
                      this.friday2 = false
                      this.monday3 = false
                      this.tuesday3 = false
                      this.wednesday3 = false
                      this.thursday3 = false
                      this.friday3 = false
                      this.monday4 = false
                      this.tuesday4 = false
                      this.wednesday4 = false
                      this.thursday4 = false
                      this.friday4 = false
                      this.modal2 = false
                      this.detail = params.row
                      this.detail.birthday = moment(params.row.applicant.birthday).format('YYYY-MM-DD')
                      if (params.row.schedule !== null && params.row.schedule !== '') {
                        let querystring = require('querystring')
                        let schedule = querystring.parse(params.row.schedule)
                        this.monday1 = schedule.monday1
                        this.tuesday1 = schedule.tuesday1
                        this.wednesday1 = schedule.wednesday1
                        this.thursday1 = schedule.thursday1
                        this.friday1 = schedule.friday1
                        this.monday2 = schedule.monday2
                        this.tuesday2 = schedule.tuesday2
                        this.wednesday2 = schedule.wednesday2
                        this.thursday2 = schedule.thursday2
                        this.friday2 = schedule.friday2
                        this.monday3 = schedule.monday3
                        this.tuesday3 = schedule.tuesday3
                        this.wednesday3 = schedule.wednesday3
                        this.thursday3 = schedule.thursday3
                        this.friday3 = schedule.friday3
                        this.monday4 = schedule.monday4
                        this.tuesday4 = schedule.tuesday4
                        this.wednesday4 = schedule.wednesday4
                        this.thursday4 = schedule.thursday4
                        this.friday4 = schedule.friday4
                      }
                      this.modal2 = true
                    }
                  }
                }, '查看')
              ])
            }
          },
          {
            title: '面试通知',
            align: 'center',
            key: 'interviewStatus',
            render: (h, params) => {
              if (params.row.interviewStatus === 'NONE') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      color: '#2D8CF0'
                    },
                    on: {
                      click: () => {
                        this.modal3 = true
                        this.appId = params.row.id
                        this.index = params.index
                        this.interview.name = params.row.applicant.realName
                        this.interview.userNo = params.row.applicant.userName
                      }
                    }
                  }, '发送'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      color: 'red'
                    },
                    on: {
                      click: () => {
                        this.sendInterviewMessage(params.row.id, 'FAIL')
                        this.data[params.index].interviewStatus = 'FAIL'
                      }
                    }
                  }, '拒绝')
                ])
              } else if (params.row.interviewStatus === 'SEND') {
                return h('span', '已发送')
              } else if (params.row.interviewStatus === 'FAIL') {
                return h('span', '不发送')
              }
            }
          },
          {
            title: '面试结果',
            key: 'interviewResult',
            render: (h, params) => {
              if (params.row.interviewResult === 'FAIL') {
                return h('span', '不聘用')
              } else if (params.row.interviewResult === 'PASS') {
                return h('span', '聘用')
              } else {
                return h('span', '-')
              }
            }
          },
          {
            title: '面试评价',
            key: 'interviewAssessment',
            render: (h, params) => {
              if (params.row.interviewAssessment === null) {
                return h('span', '-')
              } else {
                return h('span', params.row.interviewAssessment)
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.interviewStatus === 'SEND' && params.row.interviewResult === 'NONE') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      color: '#2D8CF0'
                    },
                    on: {
                      click: () => {
                        this.interview.name = params.row.applicant.realName
                        this.interview.userNo = params.row.applicant.userName
                        this.appId = params.row.id
                        this.index = params.index
                        this.modal = true
                      }
                    }
                  }, '录入')
                ])
              } else {
                return h('span', '-')
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        index: '',
        numberOfOn: 0,
        numberOfNeed: 0,
        monday1: false,
        tuesday1: false,
        wednesday1: false,
        thursday1: false,
        friday1: false,
        monday2: false,
        tuesday2: false,
        wednesday2: false,
        thursday2: false,
        friday2: false,
        monday3: false,
        tuesday3: false,
        wednesday3: false,
        thursday3: false,
        friday3: false,
        monday4: false,
        tuesday4: false,
        wednesday4: false,
        thursday4: false,
        friday4: false
      }
    },
    mounted: function () {
      this.getApplications()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getApplications()
      },
      cancelInputResult: function () {
        this.$refs['interviewValidate'].resetFields()
        this.appId = ''
        this.modal = false
      },
      inputResult: function () {
        this.$refs['interviewValidate'].validate((valid) => {
          if (valid) {
            this.$http.put('/applications/result/' + this.appId, querystring.stringify({
              result: this.interview.result,
              assessment: this.interview.assessment
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.$Message.success('面试结果录入')
                this.data[this.index].interviewResult = this.interview.result
                this.data[this.index].interviewAssessment = this.interview.assessment
                if (this.interview.result === 'PASS') {
                  this.numberOfOn += 1
                }
                this.cancelInputResult()
              } else {
                this.$Message.error(response.data.message)
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          }
        })
      },
      inputInterview: function () {
        this.sendInterviewMessage(this.appId, 'SEND')
        this.data[this.index].interviewStatus = 'SEND'
      },
      cancelInputInterview: function () {
        this.interview.date = ''
        this.interview.time = ''
        this.interview.position = ''
        this.appId = ''
        this.modal3 = false
      },
      sendInterviewMessage: function (id, status) {
        let y
        if (!moment(this.interview.date).isValid()) {
          y = ''
        } else {
          y = moment(this.interview.date).format('YYYY-MM-DD')
        }
        let m
        if (!moment(this.interview.time).isValid()) {
          m = ''
        } else {
          m = moment(this.interview.time).format('HH:mm')
        }
        if (y === '' && m !== '') {
          this.$Message.error('请输入正确的日期')
          return
        }
        this.$http.put('/applications/status/' + id, querystring.stringify({
          status: status,
          position: this.interview.position,
          date: y,
          time: m
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            if (status === 'SEND') {
              this.$Message.success('面试通知已发送')
            }
            this.cancelInputInterview()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      getApplications: function () {
        this.$http.get('/jobs/' + this.$route.params.id + '/applications', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.res.totalElements
              this.data = response.data.data.res.content
              this.numberOfNeed = response.data.data.numberOfNeed
              this.numberOfOn = response.data.data.numberOfOn
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>
<style scoped lang="less">
  .table td {
    border: 1px #000 solid;
    padding: 10px;
    text-align: center;
    width: 16.67%;
  }

  .table {
    border-collapse: collapse;
  }

  .p-table {
    width: 100%;
    line-height: 2;
    font-size: 13px;
  }

  .p-table tr {
    padding-bottom: 5px;
  }

  .p-table td:nth-child(odd) {
    color: #999999;
    width: 14%;
  }

  .p-title {
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 13px;
    color: #999999;
  }

  .p-content {
    font-size: 13px;
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
