<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          在招岗位列表
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">招聘记录列表</span>
          <Select  style="width:200px" v-model="selectUnit">
            <Option value="0">全部设岗单位</Option>
            <Option v-for="item in units" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Button type="info" @click="filterData">筛选</Button>
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
        v-model="modal1"
        :mask-closable="false" class="detailModal">

        <Form :label-width="90">
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
            <Form-item label="设岗人数">
              <p>{{detail.numberOfNeed}}</p>
            </Form-item>
            </Col>
            <Col span="12">
            <Form-item label="学生薪资">
              <p>{{detail.money}}</p>
            </Form-item>
            </Col>
          </Row>
          <Form-item label="发布日期">
            <p>{{detail.time}}</p>
          </Form-item>
          <Form-item label="招聘要求">
            <p>{{detail.requirements}}</p>
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
  import moment from 'moment'
  import Workare from '../../Workare'
  export default{
    name: 'CurrentRecruit',
    components: {
      Workare
    },
    data () {
      return {
        modal1: false,
        selectUnit: '0',
        units: [],
        detail: {
          unitName: '',
          jobName: '',
          numberOfNeed: '',
          money: '',
          time: '',
          requirements: ''
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
              if (params.row.interviewStatus === 'NONE' && params.row.interviewResult === 'NONE') {
                return h('span', '等待通知')
              } else if (params.row.interviewStatus === 'SEND' && params.row.interviewResult === 'NONE') {
                return h('span', '面试中')
              } else if (params.row.interviewResult === 'PASS') {
                return h('span', '已通过')
              } else if (params.row.interviewStatus === 'FAIL' || params.row.interviewResult === 'FAIL') {
                return h('span', '未通过')
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
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              if (params.row.unit !== undefined) {
                return h('span', params.row.unit.name)
              }
            }
          },
          {
            title: '设岗人数',
            key: 'numberOfNeed',
            width: 100
          },
          {
            title: '每月工资',
            key: 'money',
            width: 120
          },
          {
            title: '已招人数',
            key: 'numberOfOn',
            width: 100
          },
          {
            title: '招聘状态',
            key: 'status',
            render: (h, params) => {
              return h('span', '招聘中')
            }
          },
          {
            title: '发布日期',
            key: 'createTime',
            render: (h, params) => {
              return h('span', moment(params.row.createTime).format('YYYY-MM-DD'))
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
                      this.detail.unitName = params.row.unit.name
                      this.detail.jobName = params.row.name
                      this.detail.numberOfNeed = params.row.numberOfNeed
                      this.detail.money = params.row.money
                      this.detail.requirements = params.row.requirements
                      this.detail.time = moment(params.row.createTime).format('YYYY-MM-DD')
                      this.jobId = params.row.id
                      this.modal1 = true
                      this.getApplications()
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
        jobId: '',
        page2: 1,
        total2: 0
      }
    },
    mounted: function () {
      this.getAllUnits()
      this.getJobsOnRecruiting()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getJobsOnRecruiting()
      },
      filterData: function () {
        this.page = 1
        this.getJobsOnRecruiting()
      },
      onCancel: function () {
      },
      handleSubmit: function () {
      },
      getAllUnits: function () {
        this.$http.get('/units/all')
          .then(response => {
            if (response.data.status === true) {
              this.units = response.data.data
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      getJobsOnRecruiting: function () {
        this.$http.get('/jobs/on_recruit', {
          params: {
            unitId: this.selectUnit,
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
      getApplications: function () {
        this.$http.get('/jobs/' + this.jobId + '/applications', {
          params: {
            page: this.page2 - 1,
            size: this.$store.state.modalPageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total2 = response.data.data.res.totalElements
              this.data2 = response.data.data.res.content
              this.pageSize2 = response.data.data.res.size
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      changePage2: function (page) {
        this.page2 = page
        this.getApplications()
      }
    }
  }
</script>

<style scoped lang="less">

  .detailModal .ivu-form-item{
    margin-bottom: 7px;
  }
</style>
