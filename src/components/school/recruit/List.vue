<template>
  <div style="height: 100%;">
    <div class="com-inner-content" style="min-height: 50%">
      <Row class="title-div title-font">
        <Col span="20" class="">设岗单位列表</Col>
        <Col span="4">
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
  export default {
    name: 'HistoryRecruit',
    data () {
      return {
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
            title: '设岗单位',
            key: 'name'
          },
          {
            title: '岗位数量',
            key: 'jobNum'
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
                      this.$router.push('/school/recruit/detail/' + params.row.id + '/' + params.row.name)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        data: [],
        page: 1,
        total: 0
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
      getUnits: function () {
        this.$http.get('/units/history', {
          params: {
            page: this.page - 1,
            size: this.$store.state.pageSize
          }
        })
          .then(response => {
            if (response.data.status === true) {
              this.total = response.data.data.totalElements
              this.data = response.data.data.content
            }
          })
      }
    }
  }
</script>
