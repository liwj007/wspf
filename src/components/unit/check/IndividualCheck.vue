
<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div ">
        <Col span="1" class="title-font">
        <router-link to="/unit/check">
          <Icon type="chevron-left" size="32px"></Icon> 返回
        </router-link>
        </Col>
        <Col span="23" class="">
        <span class="title-font">{{jobName}}－{{year}}年{{month}}月考核详情</span>
        <Date-picker type="month" placeholder="选择月" :options="options" style="width: 200px" v-model="selectDate" :editable="false" :clearable="false"></Date-picker>

        <Button type="info" @click="filter">筛选</Button>

        </Col>

      </Row>

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
    title="学生月度考核详情"
    v-model="modal"
    :mask-closable="false" :closable="false"  width="700">

    <Form  :label-width="140" :model="detail"  ref="validate" :rules="ruleValidate">
      <Form-item label="姓名">
        <p>{{detail.name}}</p>
      </Form-item>
      <Form-item label="学号">
        <p>{{detail.no}}</p>
      </Form-item>
      <Form-item label="考核时间">
        <p>{{year}}年{{month}}月</p>
      </Form-item>
      <Form-item label="汇报内容">
        <p>{{detail.content}}</p>
      </Form-item>
      <Form-item label="工作量" prop="workload">
        <Select  placeholder="请选择..." style="width: 300px" v-model="detail.workload" >
          <Option value='FULL'>饱满</Option>
          <Option value='COMMON'>一般</Option>
          <Option value='LESS'>较少</Option>
        </Select>
      </Form-item>
      <Form-item label="工作态度"  prop="workAttitude">
        <Select  placeholder="请选择..." style="width: 300px" v-model="detail.workAttitude">
          <Option value='GOOD'>良好</Option>
          <Option value='COMMON'>一般</Option>
          <Option value='POOR'>较差</Option>
        </Select>
      </Form-item>
      <Form-item label="工作成效"  prop="workResult">
        <Select  placeholder="请选择..." style="width: 300px" v-model="detail.workResult">
          <Option value='EXCELLENT'>优秀</Option>
          <Option value='WELL'>良</Option>
          <Option value='QUALIFIED'>及格</Option>
          <Option value='UNQUALIFIED'>不及格</Option>
        </Select>
        <span class="annotation">优秀指标共{{excelNum}}个，已用{{excelCur}}个</span>
      </Form-item>
      <Form-item label="评价(200字以内)"  prop="assessment">
        <Input v-model="detail.assessment" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..." :maxlength="200"></Input>
      </Form-item>
      <Form-item label="批准工资"  prop="realMoney">
        <Input-number  :min="0" :max="100000" v-model="detail.realMoney"  style="width: 300px;" ></Input-number>
        <!--<span class="annotation">本单位资金限额{{unitMoney}}，已用{{unitCurMoney}}</span>-->
      </Form-item>
    </Form>

    <div slot="footer">
      <Row type="flex" justify="center">
        <Col span="8">
        <Button type="ghost" size="large" long @click="onCancel" >取消</Button>
        </Col>
        <Col span="2"></Col>
        <Col span="8">
        <Button type="primary" size="large" long @click="handleSubmit">提交</Button>
        </Col>
      </Row>
    </div>
  </Modal>

    <Modal
      title="学生月度考核详情"
      v-model="modal2"
      :mask-closable="false"  width="500">

      <Form  :label-width="80">
        <Row>
          <Col span="12">
          <Form-item label="姓名">
            <p>{{detail.name}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="学号">
            <p>{{detail.no}}</p>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="考核时间">
            <p>{{year}}年{{month}}月</p>
          </Form-item>
          </Col>
          <Col span="12">

          </Col>
        </Row>

        <Row>
          <Col span="12">
          <Form-item label="工作量">
            <p v-if="detail.workload === 'FULL'">饱满</p>
            <p v-else-if="detail.workload === 'COMMON'">一般</p>
            <p v-else-if="detail.workload === 'LESS'">较少</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="工作态度" >
            <p v-if="detail.workAttitude === 'GOOD'">良好</p>
            <p v-else-if="detail.workAttitude === 'COMMON'">一般</p>
            <p v-else-if="detail.workAttitude === 'POOR'">较差</p>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="工作态度" >
            <p v-if="detail.workResult === 'EXCELLENT'">优秀</p>
            <p v-else-if="detail.workResult === 'WELL'">良</p>
            <p v-else-if="detail.workResult === 'QUALIFIED'">及格</p>
            <p v-else-if="detail.workResult === 'UNQUALIFIED'">不及格</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="批准工资">
            <p>{{detail.realMoney}}</p>
          </Form-item>
          </Col>
        </Row>

        <Form-item label="汇报内容">
          <p>{{detail.content}}</p>
        </Form-item>

        <Form-item label="评价">
          <p>{{detail.assessment}}</p>
         </Form-item>

      </Form>

      <div slot="footer">
      </div>
    </Modal>
  </div>

</template>

<script>
  import moment from 'moment'
  import store from '../../../store/index'
  var querystring = require('querystring')
  export default {
    name: 'JobCurrent',
    data () {
      const validateWorlResult = (rule, value, callback) => {
        if (this.originalExl === true && value === 'EXCELLENT') {
          callback()
        } else if (value === 'EXCELLENT' && this.excelNum <= this.excelCur) {
          callback(new Error('没有优秀工作成效名额了'))
        } else {
          callback()
        }
      }
      const validateMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('金额不能为空'))
        } else {
          if (value <= 0) {
            callback(new Error('金额需大于0'))
          } else if (value > this.unitMoney - this.unitCurMoney) {
            callback(new Error('金额不能超过单位剩余金额' + (this.unitMoney - this.unitCurMoney)))
          }
          callback()
        }
      }
      return {
        options: {
          disabledDate (date) {
            if (this !== undefined) {
              let now = moment(moment().format('YYYY-MM-01')).valueOf()
              let start = moment(moment(store.state.evaluationDate).format('YYYY-MM-01')).valueOf()
              return date && (date.valueOf() < start || date.valueOf() > now)
            }
          }
        },
        ruleValidate: {
          workload: [
            {required: true, message: '工作量不能为空', trigger: 'change'}
          ],
          workAttitude: [
            {required: true, message: '工作态度不能为空', trigger: 'change'}
          ],
          workResult: [
            {required: true, message: '工作成效不能为空', trigger: 'change'},
            {validator: validateWorlResult, trigger: 'change'}
          ],
          assessment: [
            {required: true, message: '评价不能为空', trigger: 'blur'}
          ],
          realMoney: [
            {required: true, type: 'number', message: '金额不能为空', trigger: 'blur'},
            {validator: validateMoney, trigger: 'blur'}
          ]
        },
        detail: {
          id: '',
          name: '',
          no: '',
          assessment: '',
          realMoney: 0,
          workload: 'FULL',
          workAttitude: 'GOOD',
          workResult: 'EXCELLENT',
          content: ''
        },
        excelNum: 0,
        excelCur: 0,
        unitMoney: 0,
        unitCurMoney: 0,
        modal: false,
        modal2: false,
        year: this.$route.params.year,
        month: this.$route.params.month,
        selectDate: moment(this.$route.params.year + '~' + this.$route.params.month, 'YYYY-MM'),
        interview: {
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
            title: '姓名',
            key: 'userName',
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
            title: '考核材料',
            key: 'file',
            render: (h, params) => {
              if (params.row.evaluation === null) {
                return h('span', '未提交')
              } else {
                return h('span', '已提交')
              }
            }
          },
          {
            title: '工作成效',
            key: 'workResult',
            render: (h, params) => {
              if (params.row.evaluation !== null && params.row.evaluation.status !== 'NONE') {
                if (params.row.evaluation.workResult === 'EXCELLENT') {
                  return h('span', '优秀')
                } else if (params.row.evaluation.workResult === 'WELL') {
                  return h('span', '良好')
                } else if (params.row.evaluation.workResult === 'QUALIFIED') {
                  return h('span', '合格')
                } else if (params.row.evaluation.workResult === 'UNQUALIFIED') {
                  return h('span', '不合格')
                }
              } else {
                return h('span', '-')
              }
            }
          },
          {
            title: '拟发放工资',
            key: 'money',
            render: (h, params) => {
              if (params.row.evaluation !== null && params.row.evaluation.status !== 'NONE') {
                return h('span', params.row.evaluation.realMoney)
              } else {
                return h('span', '-')
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.evaluation === null || params.row.evaluation.status === 'NONE') {
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
                        this.getExcellentNum()
                        if (params.row.evaluation === null) {
                          this.detail.content = ''
                          this.detail.id = ''
                          this.detail.realMoney = params.row.job.money
                          this.detail.workload = 'LESS'
                          this.detail.workAttitude = 'POOR'
                          this.detail.workResult = 'UNQUALIFIED'
                        } else {
                          this.detail.content = params.row.evaluation.content
                          this.detail.id = params.row.evaluation.id
                          this.detail.realMoney = params.row.evaluation.realMoney
                        }
                        this.appId = params.row.id
                        this.detail.name = params.row.applicant.realName
                        this.detail.no = params.row.applicant.userName
                        this.modal = true
                      }
                    }
                  }, '审核')
                ])
              } else if (params.row.evaluation !== null && params.row.evaluation.status === 'FAIL') {
                return h('div', [
                  h('span', '被驳回'),
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
                        this.getExcellentNum()
                        this.detail.content = params.row.evaluation.content
                        this.detail.id = params.row.evaluation.id
                        this.detail.realMoney = params.row.evaluation.realMoney
                        this.appId = params.row.id
                        this.detail.name = params.row.applicant.realName
                        this.detail.no = params.row.applicant.userName
                        this.detail.workload = params.row.evaluation.workload
                        this.detail.workAttitude = params.row.evaluation.workAttitude
                        this.detail.workResult = params.row.evaluation.workResult
                        this.detail.assessment = params.row.evaluation.assessment
                        if (params.row.evaluation.workResult === 'EXCELLENT') {
                          this.originalExl = true
                        } else {
                          this.originalExl = false
                        }
                        this.modal = true
                      }
                    }
                  }, '重新审核')
                ])
              } else if (params.row.evaluation !== null && params.row.evaluation.status !== 'NONE') {
                return h('div', [
                  h('span', {
                    style: {
                      paddingRight: '2px'
                    }
                  }, '已审核,'),
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
                        this.detail.name = params.row.applicant.realName
                        this.detail.no = params.row.applicant.userName
                        this.detail.content = params.row.evaluation.content
                        this.detail.id = params.row.evaluation.id
                        this.detail.realMoney = params.row.evaluation.realMoney
                        this.detail.workload = params.row.evaluation.workload
                        this.detail.workAttitude = params.row.evaluation.workAttitude
                        this.detail.workResult = params.row.evaluation.workResult
                        this.detail.assessment = params.row.evaluation.assessment
                        this.modal2 = true
                      }
                    }
                  }, '查看')
                ])
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        jobName: '',
        appId: '',
        originalExl: false
      }
    },
    mounted: function () {
      this.getEvaluations()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getEvaluations()
      },
      filter: function () {
        if (this.selectDate === null || this.selectDate === '') {
          this.$Message.error('请选择日期')
          return
        }
        this.year = moment(this.selectDate).year()
        this.month = moment(this.selectDate).month() + 1
        this.page = 1
        this.getEvaluations()
      },
      onCancel: function () {
        this.$refs['validate'].resetFields()
        this.modal = false
      },
      handleSubmit: function () {
        this.$refs['validate'].validate((valid) => {
          if (valid) {
            this.$http.put('/evaluations/check', querystring.stringify({
              id: this.detail.id,
              appId: this.appId,
              workload: this.detail.workload,
              workAttitude: this.detail.workAttitude,
              workResult: this.detail.workResult,
              assessment: this.detail.assessment,
              money: this.detail.realMoney,
              year: moment(this.selectDate).year(),
              month: moment(this.selectDate).month() + 1
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.onCancel()
                this.$Message.success('请求处理成功')
                this.getEvaluations()
              } else {
                this.$Message.error(response.data.message)
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          } else {
            this.$Message.error('请输入正确的信息')
          }
        })
      },
      getEvaluations: function () {
        this.$http.get('/applications/evaluation', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            jobId: this.$route.params.id,
            year: moment(this.selectDate).year(),
            month: moment(this.selectDate).month() + 1
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.list.totalElements
              this.data = response.data.data.list.content
              this.jobName = response.data.data.jobName
              this.$store.commit('SET_EVALUATIONDATE', response.data.data.createTime)
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      getExcellentNum: function () {
        this.$http.get('/units/excellent_num', {
          params: {
            year: moment(this.selectDate).year(),
            month: moment(this.selectDate).month() + 1
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.excelNum = response.data.data.num
              this.excelCur = response.data.data.current
              this.unitCurMoney = response.data.data.curMoney
              this.unitMoney = response.data.data.money
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>
<style scoped lang="less">
  /*.ivu-form-item{*/
    /*margin-bottom: 5px;*/
  /*}*/
  .annotation{
    color: #999999;
    font-size: 12px;
    margin-left: 15px;
  }
</style>
