<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          岗位申请审核
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">申请列表</span>
          <Select  style="width:200px" v-model="selectUnit">
            <Option value="0">全部设岗单位</Option>
            <Option v-for="item in units" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select  style="width:200px" v-model="selectJobType">
            <Option value="NONE">全部岗位类型</Option>
            <Option value="Fixed">固定岗位</Option>
            <Option value="Temporary">临时岗位</Option>
          </Select>
          <Select  style="width:200px" v-model="selectJobStatus">
            <Option value="NONE">全部审核状态</Option>
            <Option value="NEW">待审核</Option>
            <Option value="PASS">已通过</Option>
            <Option value="FAIL">未通过</Option>
            <Option value="CLOSED">已通过(已关闭)</Option>
          </Select>
          <Button type="info" @click="filterJobs">筛选</Button>
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

      <Modal title="申请岗位详情" v-model="modal1"
             :mask-closable="false" width="600">

        <div>
          <table class="table" style="width: 100%">
            <tr>
              <td style="width: 100px;">单位名称</td>
              <td>{{detail.unitName}}</td>
              <td style="width: 100px;">新增岗位类别</td>
              <td v-if="detail.jobType === 'Fixed'">固定岗位</td>
              <td v-else>临时岗位({{detail.deadline}}个月)</td>
            </tr>
            <tr>
              <td>新增岗位数</td>
              <td>{{detail.numberOfNeed}}</td>
              <td>工作薪资</td>
              <td>{{detail.money}}</td>
            </tr>
            <tr>
              <td>指导教师</td>
              <td>{{detail.teacher}}</td>
              <td>联系方式</td>
              <td>{{detail.phone}}</td>
            </tr>
            <tr>
              <td>本单位同类岗位原有勤工助学学生数及承担任务情况</td>
              <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{detail.originalSituation}}</td>
            </tr>
            <tr>
              <td>新增岗位工作任务或工作内容</td>
              <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{detail.jobContent}}</td>
            </tr>
            <tr>
              <td>对照岗位设置原则需要说明的理由</td>
              <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{detail.reason}}</td>
            </tr>
            <tr>
              <td>单个学生工作量测算</td>
              <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{detail.workload}}</td>
            </tr>
            <tr>
              <td>招聘要求</td>
              <td colspan="3" style="text-align: left;word-wrap: break-word;word-break: break-all;">{{detail.requirements}}</td>
            </tr>
          </table>
        </div>

        <div slot="footer"> </div>

      </Modal>

      <Modal title="审核岗位申请" v-model="modal2"
             :mask-closable="false"  width="350"　:closable="false">

        <p style="font-weight:bold; padding: 10px 0;"> 确定要通过该岗位申请吗？</p>

        <Form>
          <Form-item label="最终设岗人数">
            <Input type="text" v-model="finalNumber" :maxlength="3" @keyup.native="limitInteger" style="width: 180px;"></Input>
          </Form-item>
        </Form>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="onCancel">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="primary" size="large" long @click="checkPass">提交</Button>
            </Col>
          </Row>
        </div>

      </Modal>


      <Modal title="审核岗位申请" v-model="modal3"
             :mask-closable="false"  width="350" :closable="false">
        <div style="text-align:center">
          <p>确定不通过该岗位申请吗？</p>
        </div>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="onCancel">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="error" size="large" long @click="checkReject">确定</Button>
            </Col>
          </Row>
        </div>

      </Modal>

    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  var querystring = require('querystring')
  export default{
    name: 'JobCheck',
    components: {
      Workare
    },
    data () {
      return {
        modal1: false,
        modal2: false,
        modal3: false,
        finalNumber: '',
        selectUnit: '0',
        selectJobType: 'NONE',
        selectJobStatus: 'NONE',
        detail: {},
        jobId: '',
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
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '待招聘人数',
            key: 'numberOfNeed',
            width: 120
          },
          {
            title: '岗位薪资',
            key: 'money',
            width: 120
          },
          {
            title: '岗位类型',
            key: 'type',
            width: 100,
            render: (h, params) => {
              if (params.row.jobType === 'Fixed') {
                return h('span', '固定岗位')
              } else if (params.row.jobType === 'Temporary') {
                return h('span', '临时岗位')
              }
            }
          },
          {
            title: '有效期限',
            key: 'deadline',
            render: (h, params) => {
              if (params.row.jobType === 'Fixed' && params.row.deadline === null) {
                return h('span', '永久')
              } else if (params.row.jobType === 'Temporary' && params.row.deadline !== null) {
                return h('span', params.row.deadline + '个月')
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'left',
            render: (h, params) => {
              if (params.row.status === 'NEW') {
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
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
                        this.jobId = params.row.id
                        this.finalNumber = params.row.numberOfNeed
                        this.index = params.index
                        this.modal2 = true
                      }
                    }
                  }, '通过'),
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
                        this.index = params.index
                        this.modal3 = true
                      }
                    }
                  }, '不通过')
                ])
              } else if (params.row.status === 'PASS' || params.row.status === 'FINISH') {
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
                  h('span', ' 已通过')
                ])
              } else if (params.row.status === 'FAIL') {
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
                  h('span', ' 未通过')
                ])
              } else if (params.row.status === 'CLOSED') {
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
                        this.showDetail(params)
                      }
                    }
                  }, '详情'),
                  h('span', ' 已通过 (已关闭)')
                ])
              }
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        index: '',
        units: []
      }
    },
    mounted: function () {
      this.getAllUnits()
      this.getAllJobs()
    },
    methods: {
      limitInteger: function (val) {
        let tmp = (this.finalNumber + '').replace(/\D/g, '')
        if (tmp === '') {
          this.finalNumber = 1
        } else {
          this.finalNumber = parseInt(tmp)
        }
      },
      changePage: function (page) {
        this.page = page
        this.getAllJobs()
      },
      addUnit: function () {
        this.modal1 = true
      },
      onCancel: function () {
        this.modal2 = false
        this.modal3 = false
      },
      checkPass: function () {
        this.$http.put('/jobs/check', querystring.stringify({
          id: this.jobId,
          number: this.finalNumber,
          type: 'PASS'
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.data[this.index].status = 'PASS'
            this.data[this.index].numberOfNeed = this.finalNumber
            this.modal2 = false
            this.$Message.success('请求处理成功')
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      checkReject: function () {
        this.$http.put('/jobs/check', querystring.stringify({
          id: this.jobId,
          type: 'FAIL'
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.data[this.index].status = 'FAIL'
            this.modal3 = false
            this.$Message.success('请求处理成功')
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      showDetail: function (params) {
        this.detail.name = params.row.name
        this.detail.jobType = params.row.jobType
        this.detail.deadline = params.row.deadline
        this.detail.numberOfNeed = params.row.numberOfNeed
        this.detail.money = params.row.money
        this.detail.teacher = params.row.teacher
        this.detail.phone = params.row.phone
        this.detail.originalSituation = params.row.originalSituation
        this.detail.jobContent = params.row.jobContent
        this.detail.reason = params.row.reason
        this.detail.workload = params.row.workload
        this.detail.unitName = params.row.unit.name
        this.detail.requirements = params.row.requirements
        this.modal1 = true
      },
      getAllUnits: function () {
        this.$http.get('/units/all')
          .then(response => {
            if (response.data.status === true) {
              this.units = response.data.data
            }
          })
      },
      filterJobs: function () {
        this.page = 1
        this.getAllJobs()
      },
      getAllJobs: function () {
        this.$http.get('/jobs/all', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize,
            uid: this.selectUnit,
            jobType: this.selectJobType,
            jobStatus: this.selectJobStatus
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
      }
    }
  }
</script>

<style scoped lang="less">
  .table td{
    border:1px #000 solid;
    padding: 10px;
    text-align: center;
  }
  .table{border-collapse:collapse;}

</style>
