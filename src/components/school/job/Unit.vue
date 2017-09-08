<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" >
        <Menu-item name="1">
          设岗单位管理
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <div class="com-inner-content">
        <Row class="title-div ">
          <Col span="24" class="">
          <span class="title-font">设岗单位列表</span>
          <Button type="info" style="float: right;"  size="large" @click="addUnit">添加</Button>
          </Col>

        </Row>
        <div class="clear">
          <Table :columns="columns1" :data="data1"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total='unitTotal' :current="unitPage" @on-change="onChangeUnit" :page-size="$store.state.pageSize"></Page>
            </div>
          </div>
        </div>
      </div>

      <Modal title="添加设岗单位" v-model="modal1"
             :mask-closable="false" :closable="false">
        <Form  ref="unitValidate" :rules="unitRuleValidate" :model="unit">
          <Form-item label="单位名称(20字以内)" prop="name">
            <Input type="text"  placeholder="请输入..." v-model="unit.name" :maxlength="20"></Input>
          </Form-item>
          <!--<Row>-->
            <!--<Col span="11">-->
            <!--<Form-item label="人数限额(20人以内)" prop="limitOfPeople">-->
              <!--<Input-number  :min="0" :max="20" v-model="unit.limitOfPeople"  style="width: 180px;" @on-change="limitInteger"></Input-number>-->
            <!--</Form-item>-->
            <!--</Col>-->

            <!--<Col span="11" offset="2">-->
            <!--<Form-item label="月薪限额 (100000元以内)" prop="monthlySalaryCap">-->
              <!--<Input-number  :min="1" :max="100000" v-model="unit.monthlySalaryCap"  style="width: 180px;" @on-change="limitMoney"></Input-number>-->
            <!--</Form-item>-->
            <!--</Col>-->
          <!--</Row>-->
          <Form-item label="部门介绍(1000字以内)" prop="remark">
            <Input  type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..." v-model="unit.remark" :maxlength="1000"></Input>
          </Form-item>
        </Form>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelAddNewUnit">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="primary" size="large" long @click="addNewUnit">提交</Button>
            </Col>
          </Row>
        </div>

      </Modal>

      <Modal title="授权" v-model="modal2"
             :mask-closable="false" :closable="false">

        <p style="font-weight:bold; padding: 10px 0;"> 已授权{{adminTotal}}人：{{admins}}</p>

        <div style="padding: 0 0 15px 0;">
         <Select style="width: 200px" v-model="selectUserType">
           <Option value='1'>学校单位</Option>
           <Option value='2'>学院单位</Option>
         </Select>
          <Button type="info" @click="filterUser">筛选</Button>
        </div>

        <div class="clear">
          <Table :columns="columns2" :data="data2"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total='total2' :current="page2" @on-change="changePage2" :page-size="$store.state.modalPageSize"></Page>
            </div>
          </div>
        </div>

        <div slot="footer">
          <Row type="flex" justify="end">
            <Col span="8">

            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="ghost" size="large" long @click="closeModal2">关闭</Button>
            </Col>
          </Row>
        </div>

      </Modal>

      <Modal title="添加人员" v-model="modal3"
             :mask-closable="false" :closable="false">
        <Form :label-width="90" :model="newStudent" ref="studentValidate" :rules="studentRuleValidate">
         <Form-item label="所在岗位" prop="job" :required="true">
           <Select v-model="newStudent.job" placeholder="请选择..." @on-change="selectJob">
             <div v-for="item in selectJobs">
               <Option v-if="item.full" :value="item.id" :key="item.id" :disabled="item.full">
                 {{ item.name }}(已招满)
               </Option>
               <Option v-else :value="item.id" :key="item.id" :disabled="item.full">
                 {{ item.name }}
               </Option>
             </div>
           </Select>
         </Form-item>
         <Form-item label="学生学号" style="width: 300px" prop="userNo">
           <Input type="text"  placeholder="请输入..." v-model="newStudent.userNo" @on-change="searchStudent"></Input>
         </Form-item>
         <Form-item label="检测结果" prop="userName">
           <p style="font-weight: bold;font-size: 13px;">{{newStudent.userName}}</p>
         </Form-item>
       </Form>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelAddStudent">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button v-if="hasApply" type="primary" disabled size="large" long>该用户已申请过该岗位</Button>
            <Button v-else type="primary" size="large" long @click="submitNewStudent" :disabled="!canSubmit">提交</Button>
            </Col>
          </Row>
        </div>

      </Modal>

      <Modal title="编辑设岗单位" v-model="modal4"
             :mask-closable="false"  :closable="false">

        <Form label-position="top" ref="unitEditValidate" :rules="unitRuleValidate" :model="unit">
          <Form-item label="单位名称" style="width: 300px" prop="name">
            <Input type="text"  placeholder="请输入..." v-model="unit.name" :maxlength="20"></Input>
          </Form-item>
          <!--<Row>-->
            <!--<Col span="11">-->
            <!--<Form-item label="人数限额(20人以内)" prop="limitOfPeople">-->
              <!--<Input-number  :min="1" :max="20" v-model="unit.limitOfPeople"  style="width: 180px;" @on-change="limitInteger"></Input-number>-->
            <!--</Form-item>-->
            <!--</Col>-->

            <!--<Col span="11" offset="2">-->
            <!--<Form-item label="月薪限额 (100000元以内)" prop="monthlySalaryCap">-->
              <!--<Input-number  :min="1" :max="100000" v-model="unit.monthlySalaryCap"  style="width: 180px;"></Input-number>-->
            <!--</Form-item>-->
            <!--</Col>-->
          <!--</Row>-->
          <Form-item label="部门介绍" prop="remark">
            <Input  type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..." v-model="unit.remark" :maxlength="1000"></Input>
          </Form-item>
        </Form>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelUpdateUnit">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="primary" size="large" long @click="updateUnit">提交</Button>
            </Col>
          </Row>
        </div>

      </Modal>

      <Modal title="关闭设岗单位" v-model="modal5"
             :mask-closable="false" :closable="false" width="350">
        <div style="text-align:center">
          <p>确定要关闭该设岗单位吗？所有该单位下的岗位都将被关闭。</p>
        </div>

        <div slot="footer">
          <Row type="flex" justify="center">
            <Col span="8">
            <Button type="ghost" size="large" long @click="cancelCloseUnit">取消</Button>
            </Col>
            <Col span="2"></Col>
            <Col span="8">
            <Button type="error" size="large" long @click="closeUnit">关闭</Button>
            </Col>
          </Row>
        </div>

      </Modal>

      <Modal title="单位详情" v-model="modal6"
             :mask-closable="false"  width="400">
        <div>
          <p>岗位列表</p>
          <div class="clear">
            <Table :columns="columns3" :data="data3"></Table>
            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total='jobTotal' :current="jobPage" @on-change="changeJobPage" :page-size="this.$store.state.smallPageSize"></Page>
              </div>
            </div>
          </div>
        </div>

        <div slot="footer"> </div>

      </Modal>

    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  var querystring = require('querystring')
  export default{
    name: 'UnitManage',
    components: {
      Workare
    },
    data () {
      const validateJob = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择岗位'))
        } else {
          callback()
        }
      }
      return {
        unitRuleValidate: {
          name: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          limitOfPeople: [
            { required: true, type: 'integer', message: '请输入人数限额', trigger: 'blur' },
            { type: 'integer', min: 1, message: '不能小于1', trigger: 'blur' }
          ],
          monthlySalaryCap: [
            { required: true, type: 'number', message: '请输入月薪限额', trigger: 'blur' },
            { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
          ],
          remark: [
            { type: 'string', max: 1000, message: '部门介绍不能多于1000字', trigger: 'change' }
          ]
        },
        newStudent: {
          job: '',
          userNo: '',
          userName: ''
        },
        studentRuleValidate: {
          userNo: [
            {required: true, message: '学生不能为空', trigger: 'blur'}
          ],
          job: [
            { validator: validateJob, trigger: 'change' }
          ]
        },
        modal1: false,
        modal2: false,
        modal3: false,
        modal4: false,
        modal5: false,
        modal6: false,
        data2: [],
        data3: [],
        columns3: [
          {
            type: 'index',
            width: 70,
            align: 'center',
            title: '序号'
          },
          {
            title: '岗位名称',
            key: 'name'
          },
          {
            title: '在岗人数',
            key: 'numberOfOn'
          }
        ],
        columns2: [
          {
            type: 'index',
            width: 70,
            align: 'center',
            title: '序号'
          },
          {
            title: '姓名',
            key: 'userName'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (params.row.unitId === null) {
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
                        this.authorize(params.index)
                      }
                    }
                  }, '授权')
                ])
              } else if (params.row.unitId === this.unitId) {
                return h('div', [
                  h('span', {
                    style: {
                      paddingRight: '2px'
                    }
                  }, '已授权,'),
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
                        this.cancelAuthorize(params.index)
                      }
                    }
                  }, '取消')
                ])
              } else {
                return h('div', '已授权到' + params.row.unitName)
              }
            }
          }
        ],
        columns1: [
          {
            width: 70,
            align: 'center',
            title: '序号',
            render: (h, params) => {
              return h('span', params.index + (this.unitPage - 1) * this.$store.state.pageSize + 1)
            }
          },
          {
            title: '设岗单位',
            key: 'name'
          },
          {
            title: '管理员人数',
            key: 'adminNum',
            width: 120
          },
          {
            title: '岗位总数',
            key: 'jobNum',
            width: 100
          },
//          {
//            title: '单位月薪限额',
//            key: 'monthlySalaryCap',
//            width: 120
//          },
          {
            title: '已有人数',
            key: 'hireNum',
            width: 100
          },
          {
            title: '部门介绍',
            key: 'remark',
            ellipsis: true
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
                      this.unitId = params.row.id
                      this.selectUserType = '1'
                      this.filterUser()
                      this.getAdmins()
                      this.modal2 = true
                    }
                  }
                }, '添加管理员'),
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
                      this.unitId = params.row.id
                      this.selectJobs = []
                      this.getAllJobsOfUnit()
                      this.modal3 = true
                    }
                  }
                }, '添加人员'),
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
                      this.unitId = params.row.id
                      this.unit.name = params.row.name
                      this.unit.remark = params.row.remark
                      this.unit.monthlySalaryCap = params.row.monthlySalaryCap
                      this.unit.limitOfPeople = params.row.limitOfPeople
                      this.modal4 = true
                    }
                  }
                }, '编辑'),
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
                      this.unitId = params.row.id
                      this.modal5 = true
                    }
                  }
                }, '关闭'),
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
                      this.unitId = params.row.id
                      this.jobPage = 1
                      this.getJobsDetail()
                      this.modal6 = true
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        data1: [],
        page: 1,
        total: 20,
        unit: {
          name: '',
          numberOfManage: 0,
          numberOfJob: 0,
          numberOfOn: 0,
          monthlySalaryCap: 0,
          limitOfPeople: 1,
          remark: ''
        },
        page2: 1,
        total2: 0,
        unitId: '',
        unitTotal: 0,
        unitPage: 1,
        selectUserType: '1',
        tmpData: [],
        pageSize: 10,
        adminTotal: 0,
        admins: '',
        jobPage: 1,
        jobTotal: 0,
        selectJobs: [],
        hasApply: false,
        canSubmit: false
      }
    },
    mounted: function () {
      this.getUnits()
    },
    methods: {
      changeJobPage: function (page) {
        this.jobPage = page
        this.getJobsDetail()
      },
      addUnit: function () {
        this.modal1 = true
      },
      cancelAuthorize: function (index) {
        this.$http.delete('/units/authorize', {
          params: {
            userName: this.data2[index].userName
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('取消授权成功')
            this.data2[index].unitId = null
            this.getAdmins()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      cancelAddNewUnit: function () {
        this.modal1 = false
        this.$refs['unitValidate'].resetFields()
      },
      cancelUpdateUnit: function () {
        this.modal4 = false
        this.unitId = ''
        this.$refs['unitEditValidate'].resetFields()
      },
      authorize: function (index) {
        this.$http.put('/units/authorize', querystring.stringify({
          unitId: this.unitId,
          userType: this.selectUserType,
          name: this.data2[index].userName
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('授权成功')
            this.data2[index].unitId = this.unitId
            this.getAdmins()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          this.$Message.error(response)
        })
      },
      updateUnit: function () {
        this.$refs['unitValidate'].validate((valid) => {
          if (valid) {
            this.$http.put('/units/' + this.unitId, querystring.stringify({
              name: this.unit.name,
//              limitOfPeople: this.unit.limitOfPeople,
//              monthlySalaryCap: this.unit.monthlySalaryCap,
              limitOfPeople: 10000,
              monthlySalaryCap: 10000000,
              remark: this.unit.remark
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              this.cancelUpdateUnit()
              this.modal4 = false
              this.$Message.success('更新单位成功')
              this.getUnits()
            }).catch(response => {
              this.$Message.error(response)
            })
          } else {
            this.$Message.error('请输入正确的参数')
          }
        })
      },
      limitInteger: function (val) {
        let tmp = (this.unit.limitOfPeople + '').replace(/\D/g, '')
        if (tmp === '') {
          this.unit.limitOfPeople = 0
        } else {
          this.unit.limitOfPeople = parseInt(tmp)
        }
      },
      limitMoney: function (val) {
        this.unit.monthlySalaryCap = parseFloat(val.toFixed(2))
      },
      addNewUnit: function () {
        this.$refs['unitValidate'].validate((valid) => {
          if (valid) {
            this.$http.post('/units/', querystring.stringify({
              name: this.unit.name,
//              limitOfPeople: this.unit.limitOfPeople,
//              monthlySalaryCap: this.unit.monthlySalaryCap,
              limitOfPeople: 10000,
              monthlySalaryCap: 10000000,
              remark: this.unit.remark
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(response => {
              if (response.data.status === true) {
                this.cancelAddNewUnit()
                this.getUnits()
                this.$Message.success('添加单位成功')
              } else {
                this.$Message.error(response.data.message)
              }
            }).catch(response => {
              this.$Message.error(response)
            })
          } else {
            this.$Message.error('请输入正确的参数')
          }
        })
      },
      onChangeUnit: function (page) {
        this.unitPage = page
        this.getUnits()
      },
      closeModal2: function () {
        this.modal2 = false
        this.getUnits()
      },
      getUnits: function () {
        this.$http.get('/units/', {
          params: {
            page: this.unitPage - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.unitTotal = response.data.data.totalElements
              this.data1 = response.data.data.content
            } else {
              this.$Message.error(response.data.message)
            }
          })
      },
      getAllJobsOfUnit: function () {
        this.$http.get('/jobs/unit', {
          params: {
            unitId: this.unitId
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.selectJobs = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getJobsDetail: function () {
        this.$http.get('/jobs/unit_search', {
          params: {
            page: this.jobPage - 1,
            size: this.$store.state.smallPageSize,
            unitId: this.unitId
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.jobTotal = response.data.data.totalElements
              this.data3 = response.data.data.content
            }
          })
      },
      getAdmins: function () {
        this.admins = ''
        this.adminTotal = 0
        this.$http.get('/units/' + this.unitId + '/administrators').then(response => {
          if (response.data.status === true) {
            this.adminTotal = response.data.data.length
            for (var k = 0, length = response.data.data.length; k < length; k++) {
              this.admins += response.data.data[k].userName + '、'
            }
            if (this.admins.length > 0) {
              this.admins = this.admins.substring(0, this.admins.length - 1)
            }
          }
        }).catch(response => {
          console.log(response)
        })
      },
      changePage2: function (page) {
        this.page2 = page
        this.data2 = []
        for (var i = this.$store.state.modalPageSize * (this.page2 - 1); i < this.$store.state.modalPageSize * this.page2; i++) {
          if (i < this.total2) {
            this.data2.push(this.tmpData[i])
          }
        }
      },
      filterUser: function () {
        this.$http.get('/icp/icp_user/', {
          params: {
            type: this.selectUserType
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.page2 = 1
              this.tmpData = response.data.data
              this.total2 = response.data.data.length
              this.data2 = []
              for (var i = this.$store.state.modalPageSize * (this.page2 - 1); i < this.$store.state.modalPageSize * this.page2; i++) {
                if (i < this.total2) {
                  this.data2.push(this.tmpData[i])
                }
              }
            } else {
              this.$Message.error(response.data.message)
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      cancelAddStudent: function () {
        this.$refs['studentValidate'].resetFields()
        this.modal3 = false
      },
      searchStudent: function () {
        if (this.newStudent.userNo.length === 12 || this.newStudent.userNo.length === 13) {
          this.$http.get('/icp/get_student/' + this.newStudent.userNo)
            .then(response => {
              if (response.data.status === true) {
                if (response.data.data !== null) {
                  this.newStudent.userName = response.data.data.realName
                  this.validateStudent()
                } else {
                  this.newStudent.userName = ''
                }
              } else {
                this.canSubmit = false
                this.newStudent.userName = ''
              }
            })
        } else {
          this.canSubmit = false
          this.newStudent.userName = ''
        }
      },
      selectJob: function (val) {
        this.validateStudent()
      },
      validateStudent: function () {
        if (this.newStudent.job === null || this.newStudent.job === '') {
          return
        }
        if (this.newStudent.userNo.length === 12 || this.newStudent.userNo.length === 13){
          this.$http.get('/applications/validate_student', {
            params: {
              userName: this.newStudent.userNo,
              jobId: this.newStudent.job
            }
          })
            .then(response => {
              if (response.data.status === true) {
                this.hasApply = response.data.data
                if (this.hasApply) {
                  this.canSubmit = false
                } else {
                  this.canSubmit = true
                }
              } else {
                this.canSubmit = false
                this.$Message.error(response.data.message)
              }
            })
        }
      },
      submitNewStudent: function () {
        this.$refs['studentValidate'].validate((valid) => {
          if (valid) {
            if (this.newStudent.userName !== '' && this.newStudent.job !== '') {
              this.$http.post('/applications/add', querystring.stringify({
                userNo: this.newStudent.userNo,
                jId: this.newStudent.job
              }), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(response => {
                if (response.data.status === true) {
                  this.getUnits()
                  this.cancelAddStudent()
                  this.$Message.success('添加学生成功')
                } else {
                  this.$Message.error(response.data.message)
                }
              }).catch(response => {
                console.log(response)
              })
            } else {
              this.$Message.error('请填写正确的信息后再重试')
            }
          }
        })
      },
      cancelCloseUnit: function () {
        this.unitId = ''
        this.modal5 = false
      },
      closeUnit: function () {
        this.$http.put('/units/close/', querystring.stringify({
          id: this.unitId
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          if (response.data.status === true) {
            this.$Message.success('该单位已被关闭')
            this.cancelCloseUnit()
            this.getUnits()
          } else {
            this.$Message.error(response.data.message)
          }
        }).catch(response => {
          console.log(response)
        })
      }
    }
  }
</script>

<style lang="less">


</style>
