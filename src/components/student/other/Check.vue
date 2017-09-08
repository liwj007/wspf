<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          考核记录
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">考核记录列表</span>
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
        :mask-closable="false">
        <Form :label-width="80" label-position="left">
          <Row>
            <Col span="12">
            <Form-item label="工作单位">
              <p>{{detail.unitName}}</p>
            </Form-item>
            </Col>
            <Col span="11" offset="1">
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
            <Col span="11" offset="1">
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
            <Col span="11" offset="1">
            <Form-item label="考核时间">
              <p>{{detail.time}}</p>
            </Form-item>
            </Col>
          </Row>
          <Form-item label="汇报内容">
            <p>{{detail.content}}</p>
          </Form-item>
          <div v-if="detail.status === 'PASS'">
            <Form-item label="工作量">
              <p v-if="detail.workload === 'FULL'">饱满</p>
              <p v-else-if="detail.workload === 'COMMON'">一般</p>
              <p v-else-if="detail.workload === 'LESS'">较少</p>
              <p v-else>待审核</p>
            </Form-item>
            <Form-item label="工作态度">
              <p v-if="detail.workAttitude === 'GOOD'">良好</p>
              <p v-else-if="detail.workAttitude === 'COMMON'">一般</p>
              <p v-else-if="detail.workAttitude === 'POOR'">较差</p>
              <p v-else>待审核</p>
            </Form-item>
            <Form-item label="工作成效">
              <p v-if="detail.workResult === 'EXCELLENT'">优秀</p>
              <p v-else-if="detail.workResult === 'WELL'">良</p>
              <p v-else-if="detail.workResult === 'QUALIFIED'">及格</p>
              <p v-else-if="detail.workResult === 'UNQUALIFIED'">不及格</p>
              <p v-else>待审核</p>
            </Form-item>
            <Form-item label="评价">
              <p>{{detail.assessment}}</p>
            </Form-item>
            <Form-item label="发放工资">
              <p>{{detail.realMoney}}</p>
            </Form-item>
          </div>
          <div v-else>
            <p>结果待审核</p>
          </div>
        </Form>

        <div slot="footer">

        </div>

      </Modal>
    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  export default{
    name: 'CheckRecord',
    components: {
      Workare
    },
    data () {
      return {
        modal: false,
        detail: {},
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
            key: 'job',
            render: (h, params) => {
              if (params.row.job !== undefined) {
                return h('span', params.row.job.name)
              }
            }
          },
          {
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              if (params.row.unit !== undefined) {
                return h('span', params.row.unit.name)
              }
            }
          },
          {
            title: '考核时间',
            key: 'time',
            render: (h, params) => {
              return h('span', params.row.y + '年' + params.row.m + '月')
            }
          },
          {
            title: '工作成效',
            key: 'workResult',
            render: (h, params) => {
              if (params.row.status === 'PASS') {
                if (params.row.workResult === 'EXCELLENT') {
                  return h('span', '优秀')
                } else if (params.row.workResult === 'WELL') {
                  return h('span', '良好')
                } else if (params.row.workResult === 'QUALIFIED') {
                  return h('span', '合格')
                } else if (params.row.workResult === 'UNQUALIFIED') {
                  return h('span', '不合格')
                }
              } else {
                return h('span', '待审核')
              }
            }
          },
          {
            title: '发放工资',
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
                      this.detail.jobName = params.row.job.name
                      this.detail.unitName = params.row.unit.name
                      this.detail.name = params.row.application.applicant.realName
                      this.detail.no = params.row.application.applicant.userName
                      this.detail.college = params.row.application.applicant.collegeName
                      this.detail.content = params.row.content
                      this.detail.time = params.row.y + '年' + params.row.m + '月'
                      this.detail.realMoney = params.row.realMoney
                      this.detail.workload = params.row.workload
                      this.detail.workAttitude = params.row.workAttitude
                      this.detail.workResult = params.row.workResult
                      this.detail.assessment = params.row.assessment
                      this.detail.status = params.row.status
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
        total: 0
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
      getEvaluations: function () {
        this.$http.get('/evaluations/myself', {
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
      }
    }
  }
</script>

<style scoped lang="less">
  .ivu-form-item{
    margin-bottom: 7px;
  }

</style>
