<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          资金发放记录
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">资金发放列表</span>
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

    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  export default{
    name: 'FundRecord',
    components: {
      Workare
    },
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
            title: '发放情况',
            key: 'action',
            render: (h, params) => {
              if (params.row.fundStatus === 'NONE') {
                return h('span', '未发放')
              } else if (params.row.fundStatus === 'RELEASE') {
                return h('span', '已提交，请到资金发放系统查看')
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
      this.getEvaluations()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getEvaluations()
      },
      getEvaluations: function () {
        this.$http.get('/evaluations/myself_pass', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
              this.pageSize = response.data.data.size
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
