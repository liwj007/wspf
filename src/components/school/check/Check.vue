
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
        <span class="title-font">{{unitName}}-{{year}}年{{month}}月考核详情</span>


        <Button type="error" style="float: right;"  size="large" @click="openReject" :disabled="!canReject">驳回</Button>
        <Button type="info" style="float: right;margin-right: 10px;"  size="large" @click="openApprove" :disabled="!canPass">通过</Button>
        </Col>

      </Row>

      <p class="sub-title-font">本单位在岗人数{{hireNum}}，上报考核人数{{reportNum}}；金额上限{{moneyCap}}，上报金额{{totalMoney}}</p>
      <p class="sub-title-font">备注：{{remark}}</p>

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
      :mask-closable="false" :closable="false" width="500">

      <Form  :label-width="120" label-position="left">
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
        <Form-item label="拟发放工资">
          <p>{{detail.realMoney}}</p>
        </Form-item>
        <Form-item label="批准发放工资">
          <Input-number  :min="0" :max="1000000" v-model="realMoney"  style="width: 300px;" ></Input-number>
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

    <Modal
      title="学生月度考核详情"
      v-model="modal2"
      :mask-closable="false" width="550">

      <Form  :label-width="120" label-position="left">
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
        <Form-item label="批准放工资">
          <p>{{detail.realMoney}}</p>
        </Form-item>
      </Form>

      <div slot="footer">

      </div>
    </Modal>

    <Modal title="驳回单位考核申请" v-model="modal3"
           :mask-closable="false" :closable="false" width="350">
      <div style="text-align:center">
        <p>确定要驳回该单位考核申请吗？该单位本月的全部考核申请将被驳回，需联系学院负责人对申请记录进行修改。</p>
      </div>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelReject">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="error" size="large" long @click="reject">驳回</Button>
          </Col>
        </Row>
      </div>

    </Modal>

    <Modal title="通过单位考核申请" v-model="modal4"
           :mask-closable="false" :closable="false" width="350">
      <div style="text-align:center">
        <p>确定要通过该单位考核申请吗？该单位本月的全部考核申请将被全部通过。</p>
      </div>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelApprove">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="approve">通过</Button>
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
        canReject: false,
        canPass: false,
        modal: false,
        modal2: false,
        modal3: false,
        modal4: false,
        remark: '',
        reportNum: 0,
        hireNum: 0,
        moneyCap: 0,
        totalMoney: 0,
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
          realMoney: 0
        },
        realMoney: 0,
        columns: [
          {
            type: 'index',
            width: 70,
            align: 'center',
            title: '序号'
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
              if (params.row.status === 'REPORTED') {
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
                        this.showDetail(params)
                        this.modal = true
                      }
                    }
                  }, '审核')
                ])
              } else if (params.row.status === 'PASS') {
                return h('div', [
                  h('span', '已审核, '),
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
                        this.modal2 = true
                      }
                    }
                  }, '查看')
                ])
              } else if (params.row.status === 'FAIL') {
                return h('div', [
                  h('span', '已驳回, '),
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
        evaluationId: '',
        unitName: ''
      }
    },
    mounted: function () {
      this.getReportEvaluations()
    },
    methods: {
      showDetail: function (params) {
        this.evaluationId = params.row.id
        this.realMoney = params.row.realMoney
        this.detail.userName = params.row.application.applicant.realName
        this.detail.unitName = params.row.unit.name
        this.detail.jobName = params.row.job.name
        this.detail.college = params.row.application.applicant.collegeName
        this.detail.userNo = params.row.application.applicant.userName
        this.detail.y = params.row.y
        this.detail.m = params.row.m
        this.detail.content = params.row.content
        this.detail.workload = params.row.workload
        this.detail.workAttitude = params.row.workAttitude
        this.detail.workResult = params.row.workResult
        this.detail.assessment = params.row.assessment
        this.detail.bankCard = params.row.application.applicant.bankCard
        this.detail.realMoney = params.row.realMoney
      },
      changePage: function (page) {
        this.page = page
        this.getReportEvaluations()
      },
      getReportEvaluations: function () {
        this.$http.get('/evaluations/audit', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            id: this.$route.params.id,
            year: this.$route.params.year,
            month: this.$route.params.month
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.list.totalElements
              this.data = response.data.data.list.content
              this.reportNum = response.data.data.reportNum
              this.hireNum = response.data.data.hireNum
              this.moneyCap = response.data.data.moneyCap
              this.totalMoney = response.data.data.totalMoney
              this.unitName = response.data.data.unitName
              this.remark = response.data.data.remark
              if (response.data.data.status === 'NONE') {
                this.canReject = true
                this.canPass = true
              } else {
                this.canReject = false
                this.canPass = false
              }
            }
          })
      },
      onCancel: function () {
        this.realMoney = 0
        this.evaluationId = ''
        this.modal = false
      },
      handleSubmit: function () {
        this.$http.put('/evaluations/pass', querystring.stringify({
          money: this.realMoney,
          id: this.evaluationId
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.onCancel()
            this.$Message.success('请求处理成功')
            this.getReportEvaluations()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          console.log(response)
        })
      },
      release: function () {
        this.modal2 = true
      },
      openReject: function () {
        this.modal3 = true
      },
      openApprove: function () {
        this.modal4 = true
      },
      cancelReject: function () {
        this.modal3 = false
      },
      cancelApprove: function () {
        this.modal4 = false
      },
      reject: function () {
        this.$http.put('/evaluations/reject_all', querystring.stringify({
          year: this.$route.params.year,
          month: this.$route.params.month,
          unitId: this.$route.params.id
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.cancelReject()
            this.$Message.success('请求处理成功')
            this.getReportEvaluations()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          console.log(response)
        })
      },
      approve: function () {
        this.$http.put('/evaluations/approve_all', querystring.stringify({
          year: this.$route.params.year,
          month: this.$route.params.month,
          unitId: this.$route.params.id
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.cancelApprove()
            this.$Message.success('请求处理成功')
            this.getReportEvaluations()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          console.log(response)
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .ivu-form-item{
    margin-bottom: 5px;
  }
  .annotation{
    color: #999999;
    font-size: 12px;
    margin-left: 15px;
  }
</style>
