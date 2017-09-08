<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1">
        <Menu-item name="1">
          历史申请列表
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
    name: 'HistoryRecruitLayout',
    components: {
      Workare
    },
    methods: {
      selectMenu: function () {
      }
    }
  }
</script>

