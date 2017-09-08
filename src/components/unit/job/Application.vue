<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          岗位申请记录
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
          <div class="com-inner-content">
            <Row class="title-div ">
              <Col span="24" class="">
              <span class="title-font">申请列表</span>
              <Select  style="width:200px" v-model="selectStatus">
                <Option value="NONE">全部审核类型</Option>
                <Option value="NEW">待审核</Option>
                <Option value="PASS">已通过</Option>
                <Option value="FAIL">未通过</Option>
                <Option value="CLOSED">已通过(已关闭)</Option>
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
    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  export default{
    name: 'JobApplication',
    components: {
      Workare
    },
    data () {
      return {
        selectStatus: 'NONE',
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
            title: '设岗人数',
            key: 'numberOfNeed'
          },
          {
            title: '每月工资',
            key: 'money'
          },
          {
            title: '岗位类型',
            key: 'jobType',
            render: (h, params) => {
              if (params.row.jobType === 'Fixed') {
                return h('span', '固定岗位')
              } else if (params.row.jobType === 'Temporary') {
                return h('span', '临时岗位')
              }
            }
          },
          {
            title: '审核状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 'NEW') {
                return h('span', '审核中')
              } else if (params.row.status === 'PASS') {
                return h('span', '已通过')
              } else if (params.row.status === 'FAIL') {
                return h('span', {
                  style: {
                    color: 'red'
                  }
                }, '未通过')
              } else if (params.row.status === 'CLOSED') {
                return h('span', '已通过 (已关闭)')
              } else if (params.row.status === 'FINISH') {
                return h('span', '已通过')
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
      this.getJobs()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getJobs()
      },
      filterData: function () {
        this.page = 1
        this.getJobs()
      },
      getJobs: function () {
        this.$http.get('/jobs/unit_search', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            status: this.selectStatus
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

<style lang="less">


</style>
