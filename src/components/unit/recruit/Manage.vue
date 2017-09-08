<template>
  <div style="height: 100%;">
    <div class="com-inner-content" >
      <Row class="title-div title-font">
        <Col span="20" class="">当前招聘岗位</Col>
        <Col span="4"> </Col>
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
      title="结束招聘"
      v-model="modal"
      :mask-closable="false"  width="300">

      <div style="text-align:center">
        <p>确定要结束该岗位的招聘吗？</p>
      </div>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelFinishJob">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="error" size="large" long @click="finishJob">确认结束</Button>
          </Col>
        </Row>
      </div>
    </Modal>

  </div>

</template>

<script>
  var querystring = require('querystring')
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
            key: 'name'
          },
          {
            title: '薪资',
            key: 'money'
          },
          {
            title: '发布日期',
            key: 'createTime'
          },
          {
            title: '设岗人数',
            key: 'numberOfNeed'
          },
          {
            title: '申请人数',
            key: 'applicationsSize'
          },
          {
            title: '已聘用人数',
            key: 'numberOfOn'
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
                      this.$router.push('/unit/recruit/check/' + params.row.id)
                    }
                  }
                }, '审核'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    color: 'red'
                  },
                  on: {
                    click: () => {
                      this.jobId = params.row.id
                      this.modal = true
                    }
                  }
                }, '结束')
              ])
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        jobId: ''
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
      createJob: function () {
        this.modal = true
      },
      addStudent: function () {
        this.modal2 = true
      },
      getJobs: function () {
        this.$http.get('/jobs/open', {
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
      finishJob: function () {
        this.$http.put('/jobs/finish/', querystring.stringify({
          id: this.jobId
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('岗位已结束招聘')
            this.cancelFinishJob()
            this.getJobs()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      cancelFinishJob: function () {
        this.modal = false
      }
    }
  }
</script>
