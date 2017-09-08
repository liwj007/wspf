
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
        <span class="title-font">{{year}}年{{month}}月考核详情</span>

        <div v-if="canSubmit">
          <Button type="info" style="float: right;"  size="large" @click="submitToSchool" :disabled="data.length===0">
            <span v-if="data.length===0">没有数据需要提交</span>
            <span v-else>提交到学校</span>
          </Button>
        </div>
        <div v-else>
          <Button type="info" style="float: right;"  size="large" :disabled="true">
            <span>已提交到学校</span>
          </Button>
        </div>

        <Button type="info" style="float: right;margin-right: 10px;"  size="large" @click="exportRecords" :disabled="data.length===0">导出</Button>
        </Col>

      </Row>

      <p class="sub-title-font">拟发放{{jobNum}}个岗位，{{studentNum}}名学生，需发放资金{{totalMoney}}元，单位资金上限{{moneyCap}}元<span v-if="totalMoney>moneyCap">，已超额</span></p>

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
      :mask-closable="false" width="500">

      <Form  :label-width="80" label-position="left">
        <Row>
          <Col span="12">
            <Form-item label="工作单位">
              <p>{{detail.unitName}}</p>
            </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="姓名">
            <p>{{detail.userName}}</p>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="学院">
            <p>{{detail.college}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="学号">
            <p>{{detail.userNo}}</p>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="岗位名称">
            <p>{{detail.jobName}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="考核时间">
            <p>{{detail.y}}年{{detail.m}}月</p>
          </Form-item>
          </Col>
        </Row>
        <Form-item label="汇报内容">
          <p>{{detail.content}}</p>
        </Form-item>
        <Form-item label="工作量">
          <p v-if="detail.workload === 'FULL'">饱满</p>
          <p v-else-if="detail.workload === 'COMMON'">一般</p>
          <p v-else-if="detail.workload === 'LESS'">较少</p>
        </Form-item>
        <Form-item label="工作态度">
          <p v-if="detail.workAttitude === 'GOOD'">良好</p>
          <p v-else-if="detail.workAttitude === 'COMMON'">一般</p>
          <p v-else-if="detail.workAttitude === 'POOR'">较差</p>
        </Form-item>
        <Form-item label="工作态度" >
          <p v-if="detail.workResult === 'EXCELLENT'">优秀</p>
          <p v-else-if="detail.workResult === 'WELL'">良</p>
          <p v-else-if="detail.workResult === 'QUALIFIED'">及格</p>
          <p v-else-if="detail.workResult === 'UNQUALIFIED'">不及格</p>
        </Form-item>
        <Form-item label="评价">
          <p>{{detail.assessment}}</p>
        </Form-item>
        <Form-item label="卡号">
          <p>{{detail.bankCard}}</p>
        </Form-item>
        <Form-item label="批准工资">
          <p>{{detail.realMoney}}</p>
        </Form-item>
      </Form>

      <div slot="footer">

      </div>
    </Modal>

    <Modal
    title="提交学校确认"
    v-model="modal2"
    :mask-closable="false" :closable="false"  width="550">
      <Form  :label-width="130" label-position="left" :model="newData" ref="validate" :rules="ruleValidate">
        <Form-item label="发放总人数">
          <p>{{studentNum}}</p>
        </Form-item>
        <Form-item label="发放总金额">
          <p>{{totalMoney}}</p>
        </Form-item>
        <Form-item label="本单位资金限额">
          <p>{{moneyCap}}</p>
        </Form-item>
        <Form-item label="提交名单名称" prop="submitName">
          <Input type="text"  placeholder="请输入...(20字以内)" v-model="newData.submitName" :maxlength="20"></Input>
        </Form-item>
        <Form-item label="提交备注" prop="submitRemark">
          <Input  type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入...(200字以内)" v-model="newData.submitRemark" :maxlength="200"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelSubmit">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="primary" size="large" long @click="submit" >提交</Button>
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
      return {
        modal: false,
        modal2: false,
        newData: {
          submitName: '',
          submitRemark: ''
        },
        ruleValidate: {
          submitName: [
            {required: true, message: '名单名称不能为空', trigger: 'blur'}
          ],
          submitRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        jobNum: 0,
        studentNum: 0,
        totalMoney: 0,
        moneyCap: 0,
        year: this.$route.params.year,
        month: this.$route.params.month,
        detail: {
          unitName: '',
          userName: '',
          college: '',
          userNo: '',
          jobName: '',
          y: '',
          m: '',
          content: '',
          workload: 'FULL',
          workAttitude: 'GOOD',
          workResult: 'EXCELLENT',
          assessment: '',
          bankCard: '',
          realMoney: ''
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
            title: '在岗单位',
            key: 'unit',
            render: (h, params) => {
              if (params.row.unit !== undefined) {
                return h('span', params.row.unit.name)
              }
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
            key: 'application',
            render: (h, params) => {
              if (params.row.application !== undefined) {
                return h('span', params.row.application.applicant.realName)
              }
            }
          },
          {
            title: '学号',
            key: 'application',
            render: (h, params) => {
              if (params.row.application !== undefined) {
                return h('span', params.row.application.applicant.userName)
              }
            }
          },
          {
            title: '银行帐号',
            key: 'application',
            render: (h, params) => {
              if (params.row.application !== undefined) {
                return h('span', params.row.application.applicant.bankCard)
              }
            }
          },
          {
            title: '工资',
            key: 'realMoney'
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
                      this.detail.userName = params.row.application.applicant.realName
                      this.detail.unitName = params.row.unit.name
                      this.detail.jobName = params.row.job.name
                      this.detail.college = params.row.application.applicant.collegeName
                      this.detail.userNo = params.row.application.applicant.userName
                      this.detail.y = params.row.y
                      this.detail.m = params.row.m
                      this.detail.content = params.row.content
                      this.detail.realMoney = params.row.realMoney
                      this.detail.workload = params.row.workload
                      this.detail.workAttitude = params.row.workAttitude
                      this.detail.workResult = params.row.workResult
                      this.detail.assessment = params.row.assessment
                      this.detail.bankCard = params.row.application.applicant.bankCard
                      this.modal = true
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        canSubmit: false,
        reportId: ''
      }
    },
    mounted: function () {
      this.getReportEvaluations()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getReportEvaluations()
      },
      cancelSubmit: function () {
        this.$refs['validate'].resetFields()
        this.modal2 = false
      },
      submit: function () {
        this.$refs['validate'].validate((valid) => {
          if (valid) {
            this.$http.put('/evaluations/submit', querystring.stringify({
              name: this.newData.submitName,
              remark: this.newData.submitRemark,
              year: this.$route.params.year,
              month: this.$route.params.month,
              reportId: this.reportId
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.cancelSubmit()
                this.canSubmit = false
                this.$Message.success('请求处理成功')
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
      submitToSchool: function () {
        this.modal2 = true
      },
      getReportEvaluations: function () {
        this.$http.get('/evaluations/reported', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            year: this.$route.params.year,
            month: this.$route.params.month
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.list.totalElements
              this.data = response.data.data.list.content
              this.jobNum = response.data.data.jobNum
              this.studentNum = response.data.data.hireNum
              this.moneyCap = response.data.data.moneyCap
              this.totalMoney = response.data.data.totalMoney
              this.canSubmit = response.data.data.canSubmit
              if (this.cancelSubmit && response.data.data.reportId !== undefined) {
                this.reportId = response.data.data.reportId
              }
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      exportRecords: function () {
        window.open(this.$http.defaults.baseURL + '/evaluations/export_of_unit?year=' + this.$route.params.year + '&month=' + this.$route.params.month + '&token=' + sessionStorage.getItem('token'))
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
