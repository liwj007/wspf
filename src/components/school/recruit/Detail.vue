
<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div title-font">
        <Col span="1" class="">
        <router-link to="/school/recruit/history">
          <Icon type="chevron-left" size="32px"></Icon> 返回
        </router-link>
        </Col>
        <Col span="23" class="">{{unitName}}历史申请列表</Col>
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

      <Form :label-width="90">
        <Form-item label="设岗单位">
          <p>{{detail.unitName}}</p>
        </Form-item>
        <Form-item label="岗位名称">
          <p>{{detail.jobName}}</p>
        </Form-item>
        <Form-item label="拟招聘人数">
          <p>{{detail.numberOfNeed}}</p>
        </Form-item>
        <Form-item label="实际招聘人数">
          <p>{{detail.actualNumber}}</p>
        </Form-item>
        <!--<Form-item label="招聘要求">-->
        <!--<p>这里是招聘要求什么的，这里是招聘要求什么的，这里是招聘要求什么的，-->
        <!--这里是招聘要求什么的</p>-->
        <!--</Form-item>-->
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

  </div>

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
        unitName: this.$route.params.name,
        unitId: this.$route.params.id,
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
        this.$http.get('/jobs/unit_history', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            unitId: this.unitId
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
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
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ivu-form-item{
    margin-bottom: 5px;
  }

</style>
