<template>
  <div style="height: 100%;">
    <div class="com-inner-content" style="min-height: 50%">
      <Row class="title-div title-font">
        <Col span="20" class="">历史在岗记录</Col>
        <Col span="4">
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
      title="解聘详情"
      v-model="modal"
      :mask-closable="false"  width="350">
      <Form  :label-width="80">
        <Form-item label="岗位名称">
          <p>{{detail.jobName}}</p>
        </Form-item>
        <Form-item label="设岗单位">
          <p>{{detail.unitName}}</p>
        </Form-item>
        <Form-item label="在岗时间">
          <p>{{detail.time}}</p>
        </Form-item>
        <Form-item label="解聘原因">
          <p v-if="detail.fireReason === 'END'">岗位到期</p>
          <p v-else-if="detail.fireReason === 'APPLY'">学生自主申请</p>
          <p v-else-if="detail.fireReason === 'LEAVE'">学生离校</p>
          <p v-else-if="detail.fireReason === 'DISCIPLINE'">违纪行为</p>
          <p v-else-if="detail.fireReason === 'OTHER'">其他</p>
        </Form-item>
        <Form-item label="备注">
          <p>{{detail.remark}}</p>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="24">
          <Button type="info" size="large" long @click="printRecord">打印</Button>
          </Col>
        </Row>
      </div>
    </Modal>

  </div>
</template>


<script>
  import moment from 'moment'
  export default {
    name: 'JobHistory',
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
            title: '在岗时间',
            key: 'time',
            render: (h, params) => {
              return h('span', moment(params.row.hiredDate).format('YYYY-MM-DD') + '~' + moment(params.row.firedDate).format('YYYY-MM-DD'))
            }
          },
          {
            title: '解聘原因',
            key: 'fireReason',
            render: (h, params) => {
              if (params.row.fireReason === 'END') {
                return h('span', '岗位到期')
              } else if (params.row.fireReason === 'APPLY') {
                return h('span', '学生自主申请')
              } else if (params.row.fireReason === 'LEAVE') {
                return h('span', '学生离校')
              } else if (params.row.fireReason === 'DISCIPLINE') {
                return h('span', '违纪行为')
              } else if (params.row.fireReason === 'OTHER') {
                return h('span', '其他')
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
                      this.detail.fireReason = params.row.fireReason
                      this.detail.remark = params.row.fireRemark
                      this.detail.time = moment(params.row.hiredDate).format('YYYY-MM-DD') + '~' + moment(params.row.firedDate).format('YYYY-MM-DD')
                      this.detail.jobName = params.row.job.name
                      this.detail.unitName = params.row.unit.name
                      this.applicationId = params.row.id
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
        applicationId: ''
      }
    },
    mounted: function () {
      this.getMyHistoryApplications()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getMyHistoryApplications()
      },
      printRecord: function () {
        window.open(this.$http.defaults.baseURL + '/applications/print?id=' + this.applicationId + '&token=' + this.$store.state.token)
      },
      getMyHistoryApplications: function () {
        this.$http.get('/applications/my_history', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
            }
          })
      }
    }
  }
</script>
