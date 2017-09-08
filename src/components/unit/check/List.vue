
<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div ">
        <Col span="24" class="">
        <span class="title-font">考核列表</span>
        <Date-picker type="month" placeholder="选择月" :options="options" style="width: 200px" v-model="selectDate" :editable="false" :clearable="false"></Date-picker>

        <Button type="info" @click="filterData">筛选</Button>
        <Button type="info" style="float: right;"  size="large" @click="finishCheck">完成审核</Button>
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

  </div>

</template>

<script>
  import moment from 'moment'
  export default {
    name: 'JobCurrent',
    data () {
      return {
        options: {
          disabledDate (date) {
            let now = moment(moment().format('YYYY-MM-01')).valueOf()
            return date && date.valueOf() > now
          }
        },
        modal: false,
        selectDate: new Date(),
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
            key: 'name',
            render: (h, params) => {
              if (params.row.newNum > 0) {
                return h('Badge', {
                  props: {
                    dot: true,
                    color: 'red'
                  }
                }, params.row.name)
              } else {
                return h('span', params.row.name)
              }
            }
          },
          {
            title: '单位月薪限额',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '已有人数',
            key: 'numberOfOn'
          },
          {
            title: '已上报考核人数(已审核数/总数)',
            key: 'statisticUserNumber',
            render: (h, params) => {
              return h('span', (params.row.statisticUserNumber - params.row.newNum) + '/' + params.row.statisticUserNumber)
            }
          },
          {
            title: '上报薪资总额',
            key: 'statisticMoney'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.numberOfOn !== 0 && params.row.statisticUserNumber === params.row.numberOfOn && (params.row.statisticUserNumber - params.row.newNum) === params.row.statisticUserNumber) {
                return h('div', [
                  h('span', '已全部审核, '),
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
                        this.$router.push('/unit/check/individual/' + params.row.id + '/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
                      }
                    }
                  }, '查看')
                ])
              } else if (params.row.numberOfOn === 0) {
                return h('span', '该岗位暂无学生')
              } else {
                return h('Button', {
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
                      this.$router.push('/unit/check/individual/' + params.row.id + '/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
                    }
                  }
                }, '审核')
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0
      }
    },
    mounted: function () {
      this.getEvaluationJobs()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getEvaluationJobs()
      },
      finishCheck: function () {
        this.$http.get('/evaluations/can_submit_to_school', {
          params: {
            year: moment(this.selectDate).year(),
            month: moment(this.selectDate).month() + 1
          }
        })
          .then(response => {
            if (response.data.status === true) {
              if (response.data.data === true) {
                this.$router.push('/unit/check/total/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
              } else {
                this.$Modal.warning({
                  title: '提醒',
                  content: '该单位在本月仍有学生未完成考核审核，需对全部在岗学生完成审核后才能提交至学校进行评审。'
                })
              }
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      filterData: function () {
        this.page = 1
        this.getEvaluationJobs()
      },
      getEvaluationJobs: function () {
        this.$http.get('/jobs/evaluation', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            year: moment(this.selectDate).year(),
            month: moment(this.selectDate).month() + 1
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

</style>
