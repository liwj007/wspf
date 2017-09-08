<template>
  <div class="top" style="font-size: 16px">
    <ul  class="welcome">
      <li>
        <span>欢迎你，{{userRole}} {{username}}</span>
      </li>
    </ul>
    <ul class="top_menu">
      <li>
        <Tooltip content="暂无">
          <span style="cursor: pointer">
          <svg class="icon" aria-hidden="true" style="width: 1em;">
            <use xlink:href="#icon-help"></use>
          </svg>
          帮助支持
        </span>
        </Tooltip>

      </li>
      <li>
        <Tooltip content="暂无">
        <span  style="cursor: pointer">
          <svg class="icon" aria-hidden="true" style="width: 1em;">
            <use xlink:href="#icon-file"></use>
          </svg>
          使用手册
        </span>
        </Tooltip>
      </li>
      <li>
        <span>
          <svg class="icon" aria-hidden="true" style="width: 1em;">
            <use xlink:href="#icon-person"></use>
          </svg>
          {{username}}
        </span>
      </li>
      <li>
        <Tooltip content="退出">
          <Button type="text" shape="circle"  @click="logout" style="color: white;margin-top: -7px;">
            <svg class="icon" aria-hidden="true" style="width: 1.5em;height: 1.5em;">
              <use xlink:href="#icon-tuichu"></use>
            </svg>
          </Button>
        </Tooltip>
      </li>
    </ul>
    <!--<div style="line-height: 60px; padding-right: 10px;">-->
    <!--</div>-->
  </div>
</template>

<script>

  export default{
    name: 'Top',
    props: ['username', 'userType'],
    computed: {
      userRole: function () {
        if (this.userType === 'student') {
          return '学生用户'
        } else if (this.userType === 'school') {
          return '学校用户'
        } else if (this.userType === 'unit') {
          return '学院用户'
        }
      }
    },
    methods: {
      logout () {
        this.$http.get('/users/logout')
          .then(response => {
            if (response.data.status === true) {
              window.location.href = response.data.data
            } else {
              this.$Message.error(response.data.message)
            }
          })
      }
    }
  }
</script>
<style scoped lang="less">
  .top_menu{
    float: right;
  }
  .top_menu li{
    float: left;
    line-height: 60px;
    margin-right: 30px;
  }
  .welcome{
    padding-left: 50px;
  }
  .welcome li {
    float: left;
    line-height: 60px;
    margin-right: 30px;
  }
</style>
