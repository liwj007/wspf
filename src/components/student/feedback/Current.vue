<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div title-font">
        <Col span="24" class="">申请审核列表</Col>

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
      title="申请详情"
      v-model="modal"
      :mask-closable="false">
      <Form  :label-width="80" label-position="left">
        <Row>
          <Col span="12">
          <Form-item label="设岗单位">
            <p>{{detail.unit.name}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="岗位名称">
            <p>{{detail.job.name}}</p>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Form-item label="设岗人数">
            <p>{{detail.job.numberOfNeed}}</p>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="每月工资">
            <p>{{detail.job.money}}</p>
          </Form-item>
          </Col>
        </Row>
        <Form-item label="招聘要求">
          <p>{{detail.job.requirements}}</p>
        </Form-item>
        <Form-item label="申请材料">
          <p><span>学习情况：</span> {{detail.study}}</p>
          <p><span>工作情况: </span> {{detail.work}}</p>
          <p><span>经济情况: </span> {{detail.economic}}</p>
          <p><span>对申请岗位的认识: </span> {{detail.cognition}}</p>
        </Form-item>
        <Form-item label="是否面试">
          <p v-if="detail.interviewStatus === 'NONE'">等待通知</p>
          <p v-else-if="detail.interviewStatus === 'SEND'">
            是 (时间：{{detail.interviewDate}}, 地点：{{detail.interviewPosition}})
          </p>
          <p v-else>否</p>
        </Form-item>
        <Form-item label="面试结果">
          <p v-if="detail.interviewStatus === 'SEND' && detail.interviewResult === 'NONE'">等待通知</p>
          <p v-else-if="detail.interviewStatus === 'SEND' && detail.interviewResult === 'PASS'">已通过</p>
          <p v-else-if="detail.interviewStatus === 'FAIL' || detail.interviewResult === 'FAIL'">已拒绝</p>
          <p v-else>－</p>
        </Form-item>
      </Form>

      <div slot="footer"></div>
    </Modal>
  </div>

</template>

<script>
  export default {
    name: 'JobCurrent',
    data () {
      return {
        modal: false,
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
              return h('span', params.row.job.name)
            }
          },
          {
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '是否面试',
            key: 'status',
            render: (h, params) => {
              if (params.row.interviewStatus === 'NONE') {
                return h('span', '等待通知')
              } else if (params.row.interviewStatus === 'SEND') {
                let d = ''
                if (params.row.interviewDate !== null) {
                  d = params.row.interviewDate
                }
                return h('span', '是 (时间：' + d + ', 地点：' + params.row.interviewPosition + ')')
              }
            }
          },
          {
            title: '面试结果',
            key: 'result',
            render: (h, params) => {
              if (params.row.interviewStatus === 'SEND' && params.row.interviewResult === 'NONE') {
                return h('span', '等待通知')
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
                      this.detail = params.row
                      if (this.detail.interviewDate === null) {
                        this.detail.interviewDate = ''
                      }
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
        detail: {
          job: {},
          unit: {}
        }
      }
    },
    mounted: function () {
      this.getMyApplications()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getMyApplications()
      },
      getMyApplications: function () {
        this.$http.get('/applications/myself', {
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
