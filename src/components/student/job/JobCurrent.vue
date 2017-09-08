<template>
  <div style="height: 100%;">
    <div class="com-inner-content">
      <Row class="title-div title-font">
        <Col span="24" class="">当前岗位列表</Col>

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
      title="填写月度考核"
      :mask-closable="false" :closable="false" width="450"  v-model="modal">
      <Form  label-position="top" :model="newData" ref="validate" :rules="ruleValidate">
        <Form-item label="选择月份" prop="date">
          <Date-picker type="month" :options="options" placeholder="选择月" style="width: 200px"
                       @on-change="hasEvaluation" v-model="newData.date" :editable="false" :clearable="false"></Date-picker>

          <span v-show="hasSubmit" style="color: red;">该月份已经提交过考核</span>
        </Form-item>
        <Form-item label="汇报内容(300字以内)" prop="content">
          <Input type="textarea" :autosize="{minRows: 4,maxRows: 7}" :maxlength="300" placeholder="请输入..." v-model="newData.content" :disabled="hasSubmit"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Row type="flex" justify="center">
          <Col span="8">
          <Button type="ghost" size="large" long @click="cancelAddEvaluation">取消</Button>
          </Col>
          <Col span="2"></Col>
          <Col span="8">
          <Button type="primary" size="large" long @click="addEvaluation" :disabled="!canSubmit">提交</Button>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>

</template>

<script>
  var querystring = require('querystring')
  import moment from 'moment'
  import store from '../../../store/index'
  export default {
    name: 'JobCurrent',
    data () {
      return {
        options: {
          disabledDate (date) {
            if (this !== undefined) {
              if (store.state.evaluationDate === '') {
                return true
              }
              let now = moment(moment().format('YYYY-MM-01')).valueOf()
              let hireDate = moment(moment(store.state.evaluationDate).format('YYYY-MM-01')).valueOf()
              return date && (date.valueOf() < hireDate || date.valueOf() > now)
            }
          }
        },
        ruleValidate: {
          date: [
            {required: true, type: 'date', message: '时间不能为空', trigger: 'change'}
          ],
          content: [
            {required: true, message: '汇报内容不能为空', trigger: 'blur'}
          ]
        },
        modal: false,
        newData: {
          date: new Date(),
          content: ''
        },
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
              return h('span', params.row.job.name)
            }
          },
          {
            title: '设岗单位',
            key: 'unit',
            render: (h, params) => {
              return h('span', params.row.unit.name)
            }
          },
          {
            title: '岗位类型',
            key: 'job',
            render: (h, params) => {
              if (params.row.job.jobType === 'Fixed') {
                return h('span', '固定岗位')
              } else if (params.row.job.jobType === 'Temporary') {
                return h('span', '临时岗位')
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
                      this.applicationId = params.row.id
                      this.hasEvaluation(new Date())
                      this.modal = true
                    }
                  }
                }, '填写月度考核')
              ])
            }
          }
        ],
        data: [],
        page: 1,
        total: 0,
        applicationId: '',
        canSubmit: false,
        hasSubmit: false,
        evaluationDate: ''
      }
    },
    mounted: function () {
      this.getHiredApplications()
      this.getEvaluationDate()
    },
    methods: {
      changePage: function (page) {
        this.page = page
        this.getHiredApplications()
      },
      cancelAddEvaluation: function () {
        this.$refs['validate'].resetFields()
        this.canSubmit = false
        this.hasSubmit = false
        this.modal = false
      },
      addEvaluation: function () {
        this.$refs['validate'].validate((valid) => {
          if (valid) {
            this.$http.post('/evaluations/' + this.applicationId, querystring.stringify({
              content: this.newData.content,
              year: moment(this.newData.date).year(),
              month: moment(this.newData.date).month() + 1
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.cancelAddEvaluation()
                this.$Message.success('请求处理成功')
              } else {
                this.$Message.error({
                  content: response.data.message,
                  duration: 10,
                  closable: true
                })
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          } else {
            this.$Message.error('请输入正确的参数')
          }
        })
      },
      getEvaluationDate: function () {
        this.$http.get('/applications/evaluation_date')
          .then(response => {
            if (response.data.status === true) {
              this.evaluationDate = response.data.data
              this.$store.commit('SET_EVALUATIONDATE', this.evaluationDate)
            } else {
              this.$Message.error(response.data.status)
            }
          })
      },
      getHiredApplications: function () {
        this.$http.get('/applications/working', {
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
              this.$Message.error(response.data.status)
            }
          })
      },
      hasEvaluation: function (val) {
        if (!val) {
          return
        }
        this.$http.get('/evaluations/has_evaluation', {
          params: {
            appId: this.applicationId,
            year: moment(val).year(),
            month: moment(val).month() + 1
          }
        })
          .then(response => {
            if (response.data.status === true) {
              if (response.data.data !== null) {
                this.newData.content = response.data.data
                this.hasSubmit = true
                this.canSubmit = false
              } else {
                this.newData.content = ''
                this.hasSubmit = false
                this.canSubmit = true
              }
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>
