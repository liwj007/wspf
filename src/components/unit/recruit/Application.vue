<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          岗位招聘历史
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div title-font">
          <Col span="20" class="">岗位招聘历史列表</Col>
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
        title="招聘详情"
        v-model="modal"
        :mask-closable="false" >

        <Form :label-width="120">
          <Row>
            <Col span="12">
            <Form-item label="设岗单位">
              <p>{{detail.unitName}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="岗位名称">
              <p>{{detail.jobName}}</p>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <Form-item label="拟招聘人数">
              <p>{{detail.numberOfNeed}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="实际招聘人数">
              <p>{{detail.actualNumber}}</p>
            </Form-item>
            </Col>
          </Row>
          <Form-item label="招聘要求">
            <p class="p-content">{{detail.requirements}}</p>
          </Form-item>
          <Form-item label="招聘日期">
            <p>{{detail.time}}</p>
          </Form-item>
        </Form>
        <p style="padding-bottom: 10px;color: #999999;">学生申请记录</p>
        <div class="clear">
          <Table :columns="columns2" :data="data2"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total='total2' :current="page2" @on-change="changePage2" :page-size="this.$store.state.modalPageSize"></Page>
            </div>
          </div>
        </div>

        <div slot="footer"></div>
      </Modal>
    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  import moment from 'moment'
  export default{
    name: 'RecruitApplication',
    components: {
      Workare
    },
    data () {
      return {
        modal: false,
        detail: {
          unitName: '',
          jobName: '',
          numberOfNeed: '',
          actualNumber: '',
          time: ''
        },
        columns2: [
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
            title: '申请状态',
            key: 'status',
            render: (h, params) => {
              if (params.row.interviewResult === 'PASS') {
                return h('span', '录用')
              } else {
                return h('span', '未录用')
              }
            }
          }
        ],
        data2: [],
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
            title: '拟招聘人数',
            key: 'numberOfNeed'
          },
          {
            title: '实际招聘人数',
            key: 'actualHireNumber'
          },
          {
            title: '招聘状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              if (params.row.actualHireNumber < params.row.numberOfNeed) {
                return h('span', '未完成')
              } else if (params.row.actualHireNumber === params.row.numberOfNeed) {
                return h('span', '已完成')
              } else if (params.row.actualHireNumber > params.row.numberOfNeed) {
                return h('span', '超标')
              }
            }
          },
          {
            title: '招聘日期',
            key: 'time',
            render: (h, params) => {
              return h('span', moment(params.row.createTime).format('YYYY-MM-DD') + '~' + moment(params.row.endTime).format('YYYY-MM-DD'))
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
                      this.detail.time = moment(params.row.createTime).format('YYYY-MM-DD') + '~' + moment(params.row.endTime).format('YYYY-MM-DD')
                      this.detail.unitName = params.row.unit.name
                      this.detail.jobName = params.row.name
                      this.detail.numberOfNeed = params.row.numberOfNeed
                      this.detail.actualNumber = params.row.actualHireNumber
                      this.detail.requirements = params.row.requirements
                      this.modal = true
                      this.page2 = 1
                      this.getApplicationsOfJobs(params.row.id)
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
        page2: 1,
        total2: 0
      }
    },
    mounted: function () {
      this.getHistoryJobs()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getHistoryJobs()
      },
      changePage2: function (page) {
        this.page2 = page
        this.getApplicationsOfJobs()
      },
      getHistoryJobs: function () {
        this.$http.get('/jobs/history', {
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
      getApplicationsOfJobs: function (jobId) {
        this.$http.get('/jobs/' + jobId + '/applications', {
          params: {
            page: this.page2 - 1,
            size: this.$store.state.modalPageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total2 = response.data.data.res.totalElements
              this.data2 = response.data.data.res.content
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ivu-form-item{
    margin-bottom: 5px;
  }
  .p-content {
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
