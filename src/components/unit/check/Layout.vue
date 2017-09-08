<template>
  <Workare>
    <section slot="header">
      <Menu mode="horizontal" active-name="1" @on-select="selectMenu">
        <Menu-item name="1">
          考核管理
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
    name: 'CheckLayout',
    components: {
      Workare
    },
    methods: {
      selectMenu: function () {
      }
    }
  }
</script>

