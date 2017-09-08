
<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div ">
        <Col span="1" class="title-font">
        <router-link to="/school/check">
          <Icon type="chevron-left" size="32px"></Icon> 返回
        </router-link>
        </Col>
        <Col span="23" class="">
        <span class="title-font">{{year}}年{{month}}月资金发放详情</span>


        <Button type="info" style="float: right;"  size="large" @click="release" :disabled="unitNum2 === 0">发放</Button>
        <Button type="info" style="float: right;margin-right: 10px;"  size="large" @click="exportRecords"  :disabled="unitNum === 0">导出已发放清单</Button>
        </Col>

      </Row>

      <p class="sub-title-font">本月已发放{{unitNum}}个单位，{{jobNum}}个岗位，{{studentNum}}名学生，累计资金{{totalMoney}}元</p>
      <p class="sub-title-font">本次需发放{{unitNum2}}个单位，{{jobNum2}}个岗位，{{studentNum2}}名学生，涉及资金{{totalMoney2}}元</p>

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
      :mask-closable="false" @on-cancel="onCancel" @on-ok="handleSubmit" width="500">

      <Form  :label-width="80" label-position="left">
        <Row>
          <Col span="12">
          <Form-item label="工作单位">
            <p>{{detail.unitName}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="姓名">
            <p>{{detail.name}}</p>
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
            <p>{{detail.no}}</p>
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
            <p>{{year}}年{{month}}月</p>
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
        <Form-item label="工作态度" >
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
      title="提交财务名单确认"
      v-model="modal2"
      :mask-closable="false" :closable="false" width="600">
      <Form  :label-width="200" label-position="left" :model="newData" ref="validate" :rules="ruleValidate">
        <Form-item label="发放总人数">
          <p>{{studentNum}}</p>
        </Form-item>
        <Form-item label="发放总金额">
          <p>{{totalMoney}}</p>
        </Form-item>
        <Form-item label="本次提交名单名称(20字以内)" prop="reportName">
          <Input type="text"  placeholder="请输入..." v-model="newData.reportName" :maxlength="20"></Input>
        </Form-item>
        <Form-item label="提交财务备注(150字以内)" prop="reportRemark">
          <Input  type="textarea" :autosize="{minRows: 5,maxRows: 7}" placeholder="请输入..."  v-model="newData.reportRemark" :maxlength="150"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="onCancel">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="handleSubmit">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>

  </div>

</template>

<script>
  var querystring = require('querystring')
  export default {
    name: 'FundRelease',
    data () {
      return {
        modal: false,
        modal2: false,
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
            key: 'userName',
            render: (h, params) => {
              if (params.row.application !== undefined) {
                return h('span', params.row.application.applicant.realName)
              }
            }
          },
          {
            title: '学号',
            key: 'userNo',
            render: (h, params) => {
              if (params.row.application !== undefined) {
                return h('span', params.row.application.applicant.userName)
              }
            }
          },
          {
            title: '银行帐号',
            key: 'userCard',
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
                      this.detail.name = params.row.application.applicant.realName
                      this.detail.no = params.row.application.applicant.userName
                      this.detail.content = params.row.content
                      this.detail.realMoney = params.row.realMoney
                      this.detail.workload = params.row.workload
                      this.detail.workAttitude = params.row.workAttitude
                      this.detail.workResult = params.row.workResult
                      this.detail.assessment = params.row.assessment
                      this.detail.jobName = params.row.job.name
                      this.detail.unitName = params.row.unit.name
                      this.detail.bankCard = params.row.application.applicant.bankCard
                      this.detail.college = params.row.application.applicant.collegeName
                      this.modal = true
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        detail: {
          id: '',
          jobName: '',
          unitName: '',
          bankCard: '',
          college: '',
          name: '',
          no: '',
          assessment: '',
          realMoney: '',
          workload: 'FULL',
          workAttitude: 'GOOD',
          workResult: 'EXCELLENT',
          content: ''
        },
        remark: '',
        data: [],
        page: 1,
        total: 0,
        unitNum: 0,
        jobNum: 0,
        studentNum: 0,
        totalMoney: 0,
        unitNum2: 0,
        jobNum2: 0,
        studentNum2: 0,
        totalMoney2: 0,
        year: this.$route.params.year,
        month: this.$route.params.month,
        newData: {
          reportName: '',
          reportRemark: ''
        },
        ruleValidate: {
          reportName: [
            {required: true, message: '名单名称不能为空', trigger: 'blur'}
          ],
          reportRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {
      this.getFundList()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getFundList()
      },
      onCancel: function () {
        this.$refs['validate'].resetFields()
        this.modal2 = false
      },
      handleSubmit: function () {
        this.$refs['validate'].validate((valid) => {
          if (valid) {
            this.$http.post('/evaluations/release', querystring.stringify({
              name: this.newData.reportName,
              remark: this.newData.reportRemark,
              year: this.year,
              month: this.month
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.onCancel()
                this.$Message.success('请求处理成功')
                this.getFundList()
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
      release: function () {
        this.modal2 = true
      },
      exportRecords: function () {
        window.open(this.$http.defaults.baseURL + '/evaluations/export?year=' + this.year + '&month=' + this.month + '&token=' + sessionStorage.getItem('token'))
      },
      getFundList: function () {
        this.$http.get('/evaluations/fund_list', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            year: this.year,
            month: this.month
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.list.totalElements
              this.data = response.data.data.list.content
              this.unitNum = response.data.data.unitNum
              this.jobNum = response.data.data.jobNum
              this.studentNum = response.data.data.studentNum
              this.totalMoney = response.data.data.totalMoney
              this.unitNum2 = response.data.data.unitNum2
              this.jobNum2 = response.data.data.jobNum2
              this.studentNum2 = response.data.data.studentNum2
              this.totalMoney2 = response.data.data.totalMoney2
            } else {
              this.$Message.error(response.data.message)
            }
          })
          .catch(function (error) {
            console.log(error)
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
