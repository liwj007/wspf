<template>
  <div style="height: 100%;">
    <div class="com-inner-content" style="min-height: 50%">
      <Row class="title-div title-font">
        <Col span="20" class="">岗位列表</Col>
        <Col span="4">
        <Button type="info" style="float: right;"  size="large" @click="createJob">岗位申请</Button>
        </Col>
      </Row>
      <div class="clear">
        <Table :columns="columns1" :data="data1"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total='jobTotal' :current="jobPage" @on-change="onChangeJob" :page-size="this.$store.state.smallPageSize"></Page>
          </div>
        </div>
      </div>
    </div>
    <div class="com-inner-content" style="min-height: 50%">
      <Row class="title-div title-font">
        <Col span="20" class="">在岗学生列表</Col>
        <Col span="4">
        <Button type="info" style="float: right;"  size="large" @click="addStudent">添加学生</Button>
        </Col>
      </Row>
      <div class="clear">
        <Table :columns="columns2" :data="data2"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total='studentTotal' :current="studentPage" @on-change="changeStudentPage" :page-size="this.$store.state.smallPageSize"></Page>
          </div>
        </div>
      </div>

    </div>

    <Modal title="申请岗位" v-model="modal"
      :mask-closable="false" :closable="false" width="650" :styles="{top: '20px'}">
      <Form  :label-width="120" :model="newData" ref="jobNewValidate" :rules="jobRuleValidate">
        <Form-item label="岗位名称" prop="name">
          <Input type="text" v-model="newData.name" :maxlength="20"></Input>
        </Form-item>
        <Row>
          <Col span="12">
            <Form-item label="新增岗位类别"  prop="jobType">
              <Select v-model="newData.jobType" placeholder="请选择..." @on-change="changeType">
                <Option value='Fixed'>固定岗位</Option>
                <Option value='Temporary'>临时岗位</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="有效期限" prop="deadline">
              <Select v-if="newData.jobType === 'Temporary'" v-model="newData.deadline" placeholder="请选择...">
                <Option  v-for="n in 12" :value="n" :key="n">{{n}}个月</Option>
              </Select>
              <div v-else>永久</div>
              <!--<Select v-else-if="newData.jobType === '0'" v-model="newData.deadline">-->
                <!--<Option value=-1>永久</Option>-->
              <!--</Select>-->
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="新增加岗位数"  prop="numberOfNeed" :required="true">
            <Input-number  :min="1"  v-model="newData.numberOfNeed"  style="width: 180px;" ></Input-number>
            <!--<Input type="text" v-model="newData.numberOfNeed" :maxlength="3" @on-change="limitInteger" style="width: 180px;"></Input>-->
            <!--<span>剩余名额： {{maxNumber}}</span>-->
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="岗位薪资"  prop="money"  :required="true">
            <Input-number  :min="1" :max="10000" v-model="newData.money" style="width: 180px;"  ></Input-number>
            <!--<span>剩余金额： {{maxMoney}}</span>-->
          </Form-item>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <Form-item label="指导教师"  prop="teacher">
            <Input type="text" v-model="newData.teacher" :maxlength="10"></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="联系电话"  prop="phone">
            <Input type="text" v-model="newData.phone" @keyup.native="filterNumber"></Input>
          </Form-item>
          </Col>
        </Row>
      </Form>
      <Form  label-position="top"  :model="newData" ref="jobNewValidate2" :rules="jobRuleValidate">
        <Form-item label="本单位同类岗位原有勤工助学学生数及承担任务情况(150字以内)" prop="originalSituation">
          <Input v-model="newData.originalSituation" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  :maxlength="150" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="新增岗位工作任务或工作内容(150字以内)"  prop="jobContent">
          <Input v-model="newData.jobContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="150" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="对照岗位设置原则需要说明的理由(150字以内)"  prop="reason">
          <Input v-model="newData.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="150" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="单个学生工作量测算(150字以内)"  prop="workload">
          <Input v-model="newData.workload" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="150" placeholder="请输入..."></Input>
        </Form-item>
        <Form-item label="招聘要求（供学生查看,150字以内）"  prop="requirements">
          <Input v-model="newData.requirements" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="150" placeholder="请输入..."></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelAddJob">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="addJob">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal title="岗位详情" v-model="modal3" :mask-closable="false"
           :styles="{top: '20px'}"  class="detailModal" width="650">

      <div>
        <table class="table" style="width: 100%">
          <tr>
            <td style="width: 130px;">岗位名称</td>
            <td>{{jobDetail.name}}</td>
            <td style="width: 130px;">新增岗位类别</td>
            <td v-if="jobDetail.jobType === 'Fixed'">固定岗位</td>
            <td v-else>临时岗位({{jobDetail.deadline}}个月)</td>
          </tr>
          <tr>
            <td>新增岗位数</td>
            <td>{{jobDetail.numberOfNeed}}</td>
            <td>工作薪资</td>
            <td>{{jobDetail.money}}</td>
          </tr>
          <tr>
            <td>指导教师</td>
            <td>{{jobDetail.teacher}}</td>
            <td>联系方式</td>
            <td>{{jobDetail.phone}}</td>
          </tr>
          <tr>
            <td>本单位同类岗位原有勤工助学学生数及承担任务情况</td>
            <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{jobDetail.originalSituation}}</td>
          </tr>
          <tr>
            <td>新增岗位工作任务或工作内容</td>
            <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{jobDetail.jobContent}}</td>
          </tr>
          <tr>
            <td>对照岗位设置原则需要说明的理由</td>
            <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{jobDetail.reason}}</td>
          </tr>
          <tr>
            <td>单个学生工作量测算</td>
            <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{jobDetail.workload}}</td>
          </tr>
          <tr>
            <td>招聘要求</td>
            <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{jobDetail.requirements}}</td>
          </tr>
        </table>
      </div>

      <div slot="footer"> </div>

    </Modal>



    <Modal
      title="添加学生"
      v-model="modal2"
      :mask-closable="false" :closable="false">
      <Form  :label-width="90" :model="newStudent" ref="studentValidate" :rules="studentRuleValidate">
        <Form-item label="所在岗位" prop="job" :required="true">
          <Select v-model="newStudent.job" placeholder="请选择..." @on-change="selectJob">
            <div v-for="item in jobs">
              <Option v-if="item.full" :value="item.id" :key="item.id" :disabled="item.full">
                {{ item.name }}(已招满)
              </Option>
              <Option v-else :value="item.id" :key="item.id" :disabled="item.full">
                {{ item.name }}
              </Option>
            </div>
          </Select>
        </Form-item>
        <Form-item label="学生学号" style="width: 300px" prop="userNo">
          <Input type="text"  placeholder="请输入..." v-model="newStudent.userNo" @on-change="searchStudent"></Input>
        </Form-item>
        <Form-item label="检测结果" prop="userName">
          <p style="font-weight: bold;font-size: 13px;">{{newStudent.userName}}</p>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelAddStudent">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button v-if="hasApply" type="primary" disabled size="large" long>该用户已申请过该岗位</Button>
          <Button v-else type="primary" size="large" long @click="submitNewStudent" :disabled="!canSubmit">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal
      title="学生详情"
      v-model="modal4"
      :mask-closable="false">
      <Form  :label-width="90" :model="jobDetail">
        <Form-item label="姓名">
          <span>{{studentDetail.realName}}</span>
        </Form-item>
        <Form-item label="学号">
          <span>{{studentDetail.userName}}</span>
        </Form-item>
        <Form-item label="性别">
          <span v-if="studentDetail.gender === 1">男</span>
          <span v-else-if="studentDetail.gender === 2">女</span>
        </Form-item>
        <Form-item label="学院">
          <span>{{studentDetail.collegeName}}</span>
        </Form-item>
        <Form-item label="班级">
          <span>{{studentDetail.gradeName}}</span>
        </Form-item>
        <Form-item label="手机">
          <span>{{studentDetail.mobile}}</span>
        </Form-item>
        <Form-item label="邮箱">
          <span>{{studentDetail.email}}</span>
        </Form-item>
      </Form>
      <div slot="footer">
      </div>
    </Modal>

    <Modal
      title="解聘在岗学生"
      v-model="modal5"
      :mask-closable="false" :closable="false">
      <Form  label-position="top" :model="student"  ref="validate" :rules="ruleValidate">
        <Row>
          <Col span="12">
          <Form-item label="姓名">
            <span>{{student.name}}</span>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="学号">
            <span>{{student.no}}</span>
          </Form-item>
          </Col>
        </Row>
        <Form-item label="解聘原因" prop="reason">
          <Select v-model="student.reason" placeholder="请选择...">
            <Option value="END">岗位到期</Option>
            <Option value="APPLY">学生自主申请</Option>
            <Option value="LEAVE">学生离校</Option>
            <Option value="DISCIPLINE">违纪行为</Option>
            <Option value="OTHER">其他</Option>
          </Select>
        </Form-item>
        <Form-item label="备注(200字以内 )" prop="remark">
          <Input v-model="student.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." :maxlength="200"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelFireStudent">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="fireStudent">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal title="关闭设岗单位" v-model="modal6"
           :mask-closable="false" :closable="false" width="350">
      <div style="text-align:center">
        <p>确定要关闭该岗位吗？</p>
      </div>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelCloseJob">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="error" size="large" long @click="closeJob">关闭</Button>
          </Col>
        </Row>
      </div>

    </Modal>

    <Modal title="扩充名额" v-model="modal7"
           :mask-closable="false" :closable="false" width="350">

      <Form  label-position="left" :model="extension" :label-width="90">
          <Form-item label="岗位名称">
            <span>{{extension.name}}</span>
          </Form-item>
        <Form-item label="扩充名额(100以內)" prop="number">
          <InputNumber :max="100" :min="1" v-model="extension.number" style="width: 200px;"></InputNumber>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelExtension">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="submitExtension">提交</Button>
          </Col>
        </Row>
      </div>

    </Modal>
  </div>

</template>

<script>
  var querystring = require('querystring')
  export default {
    name: 'JobCurrent',
    data () {
      const validatePhoneCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系电话'))
        } else if (!this.checkTel(value)) {
          callback(new Error('请输入正确的联系电话'))
        } else {
          callback()
        }
      }
      const validateNumber = (rule, value, callback) => {
        value = parseInt(value)
//        if (value > this.maxNumber) {
//          value = this.maxNumber
//          this.newData.numberOfNeed = value
//          return
//        }
        this.newData.numberOfNeed = parseInt(value)
        if (!value || !Number.isInteger(value) || value <= 0) {
          callback(new Error('请输入大于0的整数'))
        } else {
          callback()
//          this.$http.get('/jobs/validate_number', {
//            params: {
//              number: this.newData.numberOfNeed
//            }
//          })
//            .then(response => {
//              if (response.data.status === true) {
//                this.maxNumber = response.data.data.rest
//                if (response.data.data.flag === true) {
//                  return callback()
//                } else {
//                  return callback(new Error('该单位只剩' + response.data.data.rest + '个名额'))
//                }
//              } else {
//                this.$Message.error(response.data.message)
//              }
//            })
        }
      }
      const validateMoney = (rule, value, callback) => {
        value = parseFloat(value.toFixed(2))
        this.newData.money = value
//        if (value * this.newData.numberOfNeed > this.maxMoney) {
//          this.newData.money = this.maxMoney
//          return callback(new Error('该单位只剩' + this.maxMoney + '元工资限额'))
//        }
        if (!value || value <= 0) {
          return callback(new Error('请输入大于0的数字'))
        } else {
          callback()
//          this.$http.get('/jobs/validate_money', {
//            params: {
//              money: this.newData.money * this.newData.numberOfNeed
//            }
//          })
//            .then(response => {
//              if (response.data.status === true) {
//                this.maxMoney = response.data.data.rest
//                if (response.data.data.flag === true) {
//                  return callback()
//                } else {
//                  return callback(new Error('该单位只剩' + response.data.data.rest + '元工资限额'))
//                }
//              } else {
//                this.$Message.error(response.data.message)
//              }
//            })
//            .catch(function (error) {
//              this.$Message.error(error)
//            })
        }
      }
      const validateJob = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择岗位'))
        } else {
          callback()
        }
      }
      return {
        maxNumber: 0,
        maxMoney: 0,
        ruleValidate: {
          reason: [
            { required: true, message: '请选择解聘原因', trigger: 'blur' }
          ]
        },
        extension: {},
        modal: false,
        modal2: false,
        modal3: false,
        modal4: false,
        modal5: false,
        modal6: false,
        modal7: false,
        jobId: '',
        student: {
          name: '',
          no: '',
          reason: 'END',
          remark: ''
        },
        newStudent: {
          job: '',
          userNo: '',
          userName: ''
        },
        newData: {
          name: '',
          jobType: 'Fixed',
          deadline: '',
          numberOfNeed: 1,
          money: 1,
          teacher: '',
          phone: '',
          originalSituation: '',
          jobContent: '',
          reason: '',
          workload: '',
          requirements: ''
        },
        studentRuleValidate: {
          userNo: [
            {required: true, message: '学生不能为空', trigger: 'blur'}
          ],
          job: [
            { validator: validateJob, trigger: 'change' }
          ]
        },
        jobRuleValidate: {
          name: [
            { required: true, message: '岗位名称不能为空', trigger: 'blur' }
          ],
          jobType: [
            { required: true, message: '岗位类型不能为空', trigger: 'blur' },
            {type: 'enum', enum: ['Fixed', 'Temporary'], trigger: 'blur'}
          ],
          numberOfNeed: [
            { validator: validateNumber, trigger: 'change' }
          ],
          money: [
//            { required: true, type: 'number', message: '请输入大于0的数字', trigger: 'change' },
            { validator: validateMoney, trigger: 'change' }
          ],
          teacher: [
            { required: true, message: '请输入指导教师', trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: validatePhoneCheck, message: '请有效的电话号码', trigger: 'change' }
          ],
          originalSituation: [
            { required: true, type: 'string', message: '输入项不能为空', trigger: 'blur' }
          ],
          jobContent: [
            { required: true, type: 'string', message: '输入项不能为空', trigger: 'blur' }
          ],
          reason: [
            { required: true, type: 'string', message: '输入项不能为空', trigger: 'blur' }
          ],
          workload: [
            { required: true, type: 'string', message: '输入项不能为空', trigger: 'blur' }
          ],
          requirements: [
            { required: true, type: 'string', message: '输入项不能为空', trigger: 'blur' }
          ]
        },
        jobDetail: {
          name: '',
          jobType: '',
          deadline: '',
          numberOfNeed: '',
          money: '',
          teacher: '',
          phone: '',
          originalSituation: '',
          jobContent: '',
          reason: '',
          workload: ''
        },
        studentDetail: {},
        columns1: [
          {
            width: 70,
            align: 'center',
            title: '序号',
            render: (h, params) => {
              return h('span', params.index + (this.jobPage - 1) * this.$store.state.smallPageSize + 1)
            }
          },
          {
            title: '岗位名称',
            key: 'name'
          },
          {
            title: '岗位薪资',
            key: 'money'
          },
          {
            title: '岗位类型',
            key: 'jobType',
            render: (h, params) => {
              if (params.row.jobType === 'Fixed') {
                return h('span', '固定岗位')
              } else if (params.row.jobType === 'Temporary') {
                return h('span', '临时岗位')
              }
            }
          },
          {
            title: '有效期限',
            key: 'deadline',
            render: (h, params) => {
              if (params.row.jobType === 'Fixed' && params.row.deadline === null) {
                return h('span', '永久')
              } else if (params.row.jobType === 'Temporary' && params.row.deadline !== null) {
                return h('span', params.row.deadline + '个月')
              }
            }
          },
          {
            title: '设岗人数',
            key: 'numberOfNeed'
          },
          {
            title: '在岗人数',
            key: 'numberOfOn'
          },
          {
            title: '招聘状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 'NEW') {
                return h('span', '待审核')
              } else if (params.row.status === 'PASS') {
                return h('span', '招聘中')
              } else if (params.row.status === 'FINISH' && params.row.numberOfOn === params.row.numberOfNeed) {
                return h('span', '-')
              } else if (params.row.status === 'FINISH' && params.row.numberOfOn < params.row.numberOfNeed) {
                return h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#2D8CF0'
                  },
                  on: {
                    click: () => {
                      this.jobId = params.row.id
                      this.beginHire()
                    }
                  }
                }, '开始招聘')
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            width: '300',
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
                      this.jobDetail = params.row
                      this.modal3 = true
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
                      this.extension = {
                        id: params.row.id,
                        number: 1,
                        name: params.row.name
                      }
                      this.modal7 = true
                    }
                  }
                }, '扩充名额'),
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
                      this.jobId = params.row.id
                      this.modal6 = true
                    }
                  }
                }, '关闭')
              ])
            }
          }
        ],
        data1: [],
        columns2: [
          {
            width: 70,
            align: 'center',
            title: '序号',
            render: (h, params) => {
              return h('span', params.index + (this.studentPage - 1) * this.$store.state.smallPageSize + 1)
            }
          },
          {
            title: '岗位名称',
            key: 'job',
            render: (h, params) => {
              if (params.row.job !== undefined) {
                return h('span', params.row.job.name)
              }
            }
          },
          {
            title: '姓名',
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
            title: '卡号',
            key: 'bankCard',
            render: (h, params) => {
              return h('span', params.row.applicant.bankCard)
            }
          },
          {
            title: '操作',
            key: 'action',
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
                      this.studentDetail = params.row.applicant
                      this.modal4 = true
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
                    color: 'red'
                  },
                  on: {
                    click: () => {
                      this.appId = params.row.id
                      this.student.name = params.row.applicant.realName
                      this.student.no = params.row.applicant.userName
                      this.modal5 = true
                    }
                  }
                }, '解聘')
              ])
            }
          }
        ],
        data2: [],
        studentPage: 1,
        studentTotal: 0,
        jobPage: 1,
        jobTotal: 0,
        jobs: [],
        appId: '',
        hasApply: false,
        canSubmit: false
      }
    },
    mounted: function () {
      this.getJobs()
      this.getStudents()
    },
    methods: {
      checkTel: function (tel) {
        let mobile = /^1[3|5|8|7]\d{9}$/
        let phone = /^0\d{2,3}-?\d{7,8}$/
        return mobile.test(tel) || phone.test(tel)
      },
      submitExtension: function () {
        this.$http.put('/jobs/extension/', querystring.stringify({
          id: this.extension.id,
          number: this.extension.number
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('扩充成功')
            this.getJobs()
            this.modal7 = false
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      cancelExtension: function () {
        this.modal7 = false
        this.extension = {}
      },
      createJob: function () {
//        this.$http.get('/jobs/max_number_money')
//          .then(response => {
//            if (response.data.status === true) {
//              this.maxNumber = response.data.data.number
//              this.maxMoney = response.data.data.money
//            }
//          })
        this.modal = true
      },
      addStudent: function () {
        this.$http.get('/jobs/unit/all')
          .then(response => {
            if (response.data.status === true) {
              this.jobs = response.data.data
              this.modal2 = true
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      onChangeJob: function (page) {
        this.jobPage = page
        this.getJobs()
      },
      getJobs: function () {
        this.$http.get('/jobs/current', {
          params: {
            page: this.jobPage - 1,
            size: this.$store.state.smallPageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.jobTotal = response.data.data.totalElements
              this.data1 = response.data.data.content
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      filterNumber: function () {
        console.log(this.newData.phone)
        this.newData.phone = this.newData.phone.replace(/\D/g, '')
        console.log(this.newData.phone)
      },
      changeType: function () {
        if (this.newData.jobType === 'Temporary') {
          this.newData.deadline = 1
        } else {
          this.newData.deadline = ''
        }
      },
      cancelAddJob: function () {
        this.$refs['jobNewValidate'].resetFields()
        this.$refs['jobNewValidate2'].resetFields()
        this.modal = false
      },
      addJob: function () {
        this.$refs['jobNewValidate'].validate((valid1) => {
          this.$refs['jobNewValidate2'].validate((valid) => {
            if (valid1 && valid) {
              this.$http.post('/jobs/', querystring.stringify({
                name: this.newData.name,
                jobType: this.newData.jobType,
                numberOfNeed: this.newData.numberOfNeed,
                deadline: this.newData.deadline,
                money: this.newData.money,
                teacher: this.newData.teacher,
                phone: this.newData.phone,
                originalSituation: this.newData.originalSituation,
                jobContent: this.newData.jobContent,
                reason: this.newData.reason,
                workload: this.newData.workload,
                requirements: this.newData.requirements
              }), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(response => {
                if (response.data.status === true) {
                  this.getJobs()
                  this.cancelAddJob()
                  this.$Modal.success({
                    title: '添加岗位成功',
                    content: '岗位已经提交给管理员进行审核，您可以到“岗位申请管理”中进行查看'
                  })
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
      getStudents: function () {
        this.$http.get('/applications/', {
          params: {
            page: this.studentPage - 1,
            size: this.$store.state.smallPageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.studentTotal = response.data.data.totalElements
              this.data2 = response.data.data.content
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      changeStudentPage: function (page) {
        this.studentPage = page
        this.getStudents()
      },
      cancelAddStudent: function () {
        this.$refs['studentValidate'].resetFields()
        this.modal2 = false
      },
      searchStudent: function () {
        if (this.newStudent.userNo.length === 12 || this.newStudent.userNo.length === 13) {
          this.$http.get('/icp/get_student/' + this.newStudent.userNo)
            .then(response => {
              if (response.data.status === true) {
                if (response.data.data !== null) {
                  this.newStudent.userName = response.data.data.realName
                  this.validateStudent()
                } else {
                  this.newStudent.userName = ''
                }
              } else {
                this.canSubmit = false
                this.newStudent.userName = ''
              }
            })
        } else {
          this.canSubmit = false
          this.newStudent.userName = ''
        }
      },
      selectJob: function (val) {
        this.validateStudent()
      },
      validateStudent: function () {
        if (this.newStudent.job === null || this.newStudent.job === '') {
          return
        }
        if (this.newStudent.userNo.length === 12 || this.newStudent.userNo.length === 13){
          this.$http.get('/applications/validate_student', {
            params: {
              userName: this.newStudent.userNo,
              jobId: this.newStudent.job
            }
          })
            .then(response => {
              if (response.data.status === true) {
                this.hasApply = response.data.data
                if (this.hasApply) {
                  this.canSubmit = false
                } else {
                  this.canSubmit = true
                }
              } else {
                this.canSubmit = false
                this.$Message.error(response.data.message)
              }
            })
        }
      },
      submitNewStudent: function () {
        this.$refs['studentValidate'].validate((valid) => {
          if (valid) {
            this.$http.post('/applications/add', querystring.stringify({
              userNo: this.newStudent.userNo,
              jId: this.newStudent.job
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.getStudents()
                this.getJobs()
                this.cancelAddStudent()
                this.$Message.success('添加学生成功')
              } else {
                this.$Message.error(response.data.message)
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          }
        })
      },
      beginHire: function () {
        this.$http.put('/jobs/begin/', querystring.stringify({
          id: this.jobId
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('岗位已开始招聘')
            this.getJobs()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      cancelFireStudent: function () {
        this.$refs['validate'].resetFields()
        this.modal5 = false
        this.appId = ''
      },
      fireStudent: function () {
        this.$refs['validate'].validate((valid) => {
          if (valid) {
            this.$http.put('/applications/fire/', querystring.stringify({
              id: this.appId,
              reason: this.student.reason,
              remark: this.student.remark
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.$Message.success('该同学已被解聘')
                this.cancelFireStudent()
                this.getStudents()
                this.getJobs()
              } else {
                this.$Message.error(response.data.message)
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          } else {
            this.$Message.error('输入数据不正确')
          }
        })
      },
      cancelCloseJob: function () {
        this.jobId = ''
        this.modal6 = false
      },
      closeJob: function () {
        this.$http.put('/jobs/close/', querystring.stringify({
          id: this.jobId
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('该岗位已被关闭')
            this.cancelCloseJob()
            this.getJobs()
            this.getStudents()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .table td{
    border:1px #000 solid;
    padding: 10px;
    text-align: center;
  }
  .table{border-collapse:collapse;}

  .detailModal .ivu-form-item{
    margin-bottom: 7px;
  }
</style>
