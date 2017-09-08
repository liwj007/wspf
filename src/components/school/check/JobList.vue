
<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div ">
        <Col span="24" class="">
        <span class="title-font">设岗单位列表</span>
        <Date-picker type="month" placeholder="选择月" :options="options" style="width: 200px" v-model="selectDate" :editable="false" :clearable="false"></Date-picker>

        <Button type="info" @click="filterData">筛选</Button>
        <Button type="info" style="float: right;"  size="large" @click="fundRelease">发放资金</Button>
        </Col>

      </Row>

      <div class="clear">
        <Table :columns="columns" :data="data"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total='total' :current="page" @on-change="changePage" :page-size="pageSize"></Page>
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
        modal2: false,
        selectDate: new Date(),
        columns: [
          {
            type: 'index',
            width: 70,
            align: 'center',
            title: '序号'
          },
          {
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '管理员人数',
            key: 'unit ',
            render: (h, params) => {
              return h('span', params.row.unit.adminNum)
            }
          },
          {
            title: '单位月薪限额',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.monthlySalaryCap)
            }
          },
          {
            title: '在岗人数',
            key: 'numberOnHire',
            render: (h, params) => {
              return h('span', params.row.unit.hireNum)
            }
          },
          {
            title: '已上报考核人数',
            key: 'numberOnReport'
          },
          {
            title: '上报薪资总额',
            key: 'moneyOnReport'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 'NONE') {
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
                        this.$router.push('/school/check/detail/' + params.row.unit.id + '/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
                      }
                    }
                  }, '审核')
                ])
              } else if (params.row.status === 'PASS' || params.row.status === 'FUND') {
                return h('div', [
                  h('span', '已通过, '),
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
                        this.$router.push('/school/check/detail/' + params.row.unit.id + '/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
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
                        this.$router.push('/school/check/detail/' + params.row.unit.id + '/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
                      }
                    }
                  }, '查看')
                ])
              } else if (params.row.status === null) {
                return h('span', '未提交 ')
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        pageSize: 10
      }
    },
    mounted: function () {
      this.getUnits()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getUnits()
      },
      filterData: function () {
        this.page = 1
        this.getUnits()
      },
      getUnits: function () {
        this.$http.get('/units/evaluation', {
          params: {
            page: this.page - 1,
            size: 10,
            year: moment(this.selectDate).year(),
            month: moment(this.selectDate).month() + 1
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
              this.pageSize = response.data.data.size
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      fundRelease: function () {
        this.$router.push('/school/check/release/' + moment(this.selectDate).year() + '/' + (moment(this.selectDate).month() + 1))
      }
    }
  }
</script>
<style scoped lang="less">

</style>
