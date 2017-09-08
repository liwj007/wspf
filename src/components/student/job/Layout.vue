<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" @on-select="selectMenu">
        <Menu-item name="1">
          当前岗位列表
        </Menu-item>
        <Menu-item name="2">
          历史在岗记录
        </Menu-item>
      </Menu>
    </section>
    <section slot="footer" style="height: 100%;">
      <router-view></router-view>
    </section>
  </Workare>
</template>
<script>
  import Workare from '../../Workare'
  export default{
    name: 'JobLayout',
    components: {
      Workare
    },
    methods: {
      selectMenu: function (name) {
        switch (name) {
          case '1':
            this.$router.push('/student/job/current')
            break
          case '2':
            this.$router.push('/student/job/history')
            break
        }
      }
    }
  }
</script>

<style lang="less">


</style>
