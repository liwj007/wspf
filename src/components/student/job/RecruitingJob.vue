<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1">
        <Menu-item name="1">
          申请岗位
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">在招岗位列表</span>
          </Col>

        </Row>
        <div class="clear">
          <Table :columns="columns" :data="data"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total='total' :current="page" @on-change="changePage"
                    :page-size="this.$store.state.pageSize"></Page>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="岗位详情"
        v-model="modal1"
        :mask-closable="false">
        <Form :label-width="120" :model="detail">
          <Row>
            <Col span="12">
            <Form-item label="岗位名称">
              <span>{{detail.name}}</span>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="岗位薪资">
              <span>{{detail.money}}</span>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="新增岗位类别">
              <span v-if="detail.jobType === 'Fixed'">固定岗位</span>
              <span v-else-if="detail.jobType === 'Temporary'">临时岗位</span>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="有效期限">
          <span v-if="detail.jobType === 'Temporary'">
            {{detail.deadline}}个月
          </span>
              <span v-else>永久</span>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="指导教师">
              <span>{{detail.teacher}}</span>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="联系电话">
              <span>{{detail.phone}}</span>
            </Form-item>
            </Col>
          </Row>
          <Form-item label="招聘要求">
            <span>{{detail.requirements}}</span>
          </Form-item>
        </Form>

        <div slot="footer">
        </div>
      </Modal>


      <Modal
        title="申请岗位"
        v-model="modal2"
        :mask-closable="false" :closable="false" :styles="{top: '20px'}" width="600">

        <Form :label-width="90" label-position="left" :model="application" ref="appValidate" :rules="ruleValidate"
              class="detailModal">
          <Row>
            <Col span="12">
            <Form-item label="姓名：" prop="name">
              <p>{{application.name}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="性别：" :required="true">
              <p v-if="application.gender === 1">男</p>
              <p v-else-if="application.gender === 2">女</p>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="民族：" prop="peopleName">
              <p>{{application.peopleName}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="学院：" prop="collegeName">
              <p>{{application.collegeName}}</p>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="班级：" prop="className">
              <p>{{application.className}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="出生年月：" prop="birthday">
              <p>{{application.birthday}}</p>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="手机：" prop="phone">
              <p>{{application.phone}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="邮箱：" prop="email">
              <p>{{application.email}}</p>
            </Form-item>
            </Col>
          </Row>
        </Form>
        <Form label-position="top" style="padding-top: 10px;" :model="application" ref="appValidate2"
              :rules="ruleValidate">
          <Form-item label="学习情况(150字以内)：" prop="study">
            <Input v-model="application.study" type="textarea" :rows="3" :maxlength="150" placeholder="请输入..."></Input>
          </Form-item>
          <Form-item label="工作情况(150字以内)：" prop="work">
            <Input v-model="application.work" type="textarea" :rows="3" :maxlength="150" placeholder="请输入..."></Input>
          </Form-item>
          <Form-item label="经济情况(150字以内)：" prop="economic">
            <Input v-model="application.economic" type="textarea" :rows="3" :maxlength="150"
                   placeholder="请输入..."></Input>
          </Form-item>
          <Form-item label="对申请岗位的认识(150字以内)：" prop="cognition">
            <Input v-model="application.cognition" type="textarea" :rows="3" :maxlength="150"
                   placeholder="请输入..."></Input>
          </Form-item>
          <Form-item label="特长和爱好(150字以内)：" prop="hobbies">
            <Input v-model="application.hobbies" type="textarea" :rows="3" :maxlength="150"
                   placeholder="请输入..."></Input>
          </Form-item>
          <!--<Form-item label="课程情况(150字以内)：" prop="schedule">-->
          <!--<Input v-model="application.schedule" type="textarea" :rows="3" :maxlength="150"-->
          <!--placeholder="请输入..."></Input>-->
          <!--</Form-item>-->
          <Form-item label="课程情况(请在下表中勾选出上课时间)：" prop="schedule">
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
                  <Checkbox v-model="monday1"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="tuesday1"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="wednesday1"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="thursday1"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="friday1"></Checkbox>
                </td>
              </tr>
              <tr>
                <td>上午三四节</td>
                <td>
                  <Checkbox v-model="monday2"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="tuesday2"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="wednesday2"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="thursday2"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="friday2"></Checkbox>
                </td>
              </tr>
              <tr>
                <td>下午五六节</td>
                <td>
                  <Checkbox v-model="monday3"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="tuesday3"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="wednesday3"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="thursday3"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="friday3"></Checkbox>
                </td>
              </tr>
              <tr>
                <td>下午七八节</td>
                <td>
                  <Checkbox v-model="monday4"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="tuesday4"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="wednesday4"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="thursday4"></Checkbox>
                </td>
                <td>
                  <Checkbox v-model="friday4"></Checkbox>
                </td>
              </tr>
            </table>
          </Form-item>
        </Form>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelAddApplication">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="primary" size="large" long @click="addApplication">提交</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal
        v-model="confirmModal"
        title="提示"
        @on-ok="sureToApply"
        @on-cancel="closeConfirm">
        <p>请注意，您已经处在被雇佣状态，您可以继续填写岗位申请，但只有在您与原单位解除雇佣关系后才能被新单位录用！</p>
      </Modal>
    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  import moment from 'moment'

  var querystring = require('querystring')
  export default {
    name: 'RecruitingJob',
    components: {
      Workare
    },
    data () {
      return {
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          gender: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'blur'}
          ],
          peopleName: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'blur'}
          ],
          className: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'blur'}
          ],
          birthday: [
            {required: false, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'change'}
          ],
          collegeName: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'change'}
          ],
          email: [
            {required: true, message: '请到电子科技大学智慧校园平台补充相关信息后重新登录', trigger: 'blur'}
          ],
          study: [
            {required: true, type: 'string', message: '输入项不能为空', trigger: 'blur'}
          ],
          work: [
            {required: true, type: 'string', message: '输入项不能为空', trigger: 'blur'}
          ],
          economic: [
            {required: true, type: 'string', message: '输入项不能为空', trigger: 'blur'}
          ],
          cognition: [
            {required: true, type: 'string', message: '输入项不能为空', trigger: 'blur'}
          ],
          hobbies: [
            {required: true, type: 'string', message: '输入项不能为空', trigger: 'blur'}
          ]
        },
        modal1: false,
        confirmModal: false,
        detail: {},
        modal2: false,
        application: {
          name: '',
          gender: '1',
          nation: '',
          college: '',
          grade: '',
          birthday: '',
          phone: '',
          email: '',
          work: '',
          study: '',
          economic: '',
          cognition: '',
          peopleName: '',
          className: '',
          majorName: '',
          gradeName: '',
          collegeName: '',
          schedule: [],
          hobbies: ''
        },
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
            title: '岗位名称',
            key: 'name'
          },
          {
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.hasApply === false) {
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
                        this.showUnitDesc(params)
                      }
                    }
                  }, '部门介绍'),
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
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
                        this.$http.get('/applications/check_applied')
                          .then(response => {
                            if (response.data.status === true) {
                              console.log(response.data.data === true)
                              if (response.data.data === true) {
                                this.jobId = params.row.id
                                this.index = params.index
                                this.confirmModal = true
                              } else {
                                this.jobId = params.row.id
                                this.index = params.index
                                this.getUserInfo()
                                this.modal2 = true
                              }
                            } else {
                              this.$Message.error(response.data.message)
                            }
                          })
                      }
                    }
                  }, '申请')
                ])
              } else {
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
                        this.showUnitDesc(params)
                      }
                    }
                  }, '部门介绍'),
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
                  h('span', '已申请')
                ])
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        jobId: '',
        index: '',
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
      this.getJobsOnRecruiting()
    },
    methods: {
      showUnitDesc: function (params) {
        this.$Modal.info({
          title: params.row.unit.name + '介绍',
          content: params.row.unit.remark
        })
      },
      closeConfirm: function () {
        this.confirmModal = false
      },
      sureToApply: function () {
        this.getUserInfo()
        this.modal2 = true
      },
      changePage: function (page) {
        this.page = page
        this.getJobsOnRecruiting()
      },
      onCancel: function () {
      },
      handleSubmit: function () {
      },
      cancelAddApplication: function () {
        this.$refs['appValidate'].resetFields()
        this.$refs['appValidate2'].resetFields()
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
      },
      checkTel: function (tel) {
        let mobile = /^1[3|5|8]\d{9}$/
        let phone = /^0\d{2,3}-?\d{7,8}$/
        return mobile.test(tel) || phone.test(tel)
      },
      addApplication: function () {
        this.$refs['appValidate'].validate((valid1) => {
          this.$refs['appValidate2'].validate((valid) => {
            if (valid1 && valid) {
              let schedule = {
                monday1: this.monday1,
                tuesday1: this.tuesday1,
                wednesday1: this.wednesday1,
                thursday1: this.thursday1,
                friday1: this.friday1,
                monday2: this.monday2,
                tuesday2: this.tuesday2,
                wednesday2: this.wednesday2,
                thursday2: this.thursday2,
                friday2: this.friday2,
                monday3: this.monday3,
                tuesday3: this.tuesday3,
                wednesday3: this.wednesday3,
                thursday3: this.thursday3,
                friday3: this.friday3,
                monday4: this.monday4,
                tuesday4: this.tuesday4,
                wednesday4: this.wednesday4,
                thursday4: this.thursday4,
                friday4: this.friday4
              }
              let querystring = require('querystring')
              this.$http.post('/jobs/apply/' + this.jobId, querystring.stringify({
                work: this.application.work,
                study: this.application.study,
                economic: this.application.economic,
                cognition: this.application.cognition,
                schedule: querystring.stringify(schedule),
                hobbies: this.application.hobbies
              }), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(response => {
                if (response.data.status === true) {
                  this.modal2 = false
                  this.data[this.index].hasApply = true
                  this.cancelAddApplication()
                  this.$Message.success('请求处理成功')
                } else {
                  this.$Message.error(response.data.message)
                }
              }).catch(response => {
                this.$Message.error(response)
              })
            } else {
              this.$Message.error('请输入正确的参数')
            }
          })
        })
      },
      showDetail: function (params) {
        this.detail.name = params.row.name
        this.detail.jobType = params.row.jobType
        this.detail.deadline = params.row.deadline
        this.detail.numberOfNeed = params.row.numberOfNeed
        this.detail.money = params.row.money
        this.detail.teacher = params.row.teacher
        this.detail.phone = params.row.phone
        this.detail.originalSituation = params.row.originalSituation
        this.detail.jobContent = params.row.jobContent
        this.detail.reason = params.row.reason
        this.detail.workload = params.row.workload
        this.detail.unitName = params.row.unitName
        this.detail.requirements = params.row.requirements
        this.modal1 = true
      },
      getJobsOnRecruiting: function () {
        this.$http.get('/jobs/recruit', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      getUserInfo: function () {
        this.$http.get('/users/info')
          .then(response => {
            if (response.data.status === true) {
              this.application.name = response.data.data.user.realName
              this.application.gender = response.data.data.user.gender
              this.application.phone = response.data.data.user.mobile
              this.application.email = response.data.data.user.email
              this.application.peopleName = response.data.data.user.peopleName
              this.application.className = response.data.data.user.className
              this.application.gradeName = response.data.data.user.gradeName
              this.application.collegeName = response.data.data.user.collegeName
              this.application.majorName = response.data.data.user.majorName
              if (response.data.data.user.birthday != null) {
                this.application.birthday = moment(response.data.data.user.birthday).format('YYYY-MM-DD')
              }
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>

<style scoped lang="less">
  .detailModal .ivu-form-item {
    margin-bottom: 7px;
  }

  span {
    word-wrap: break-word;
    word-break: break-all;
  }

  .table td {
    border: 1px #000 solid;
    padding: 10px;
    text-align: center;
    width: 16.67%;
  }

  .table {
    border-collapse: collapse;
  }

</style>
