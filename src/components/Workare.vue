<template>
  <div class="com">
    <div class="com-top">
      <slot name="header"></slot>
    </div>
    <div class="com-inner">
      <!--<div class="com-inner-content">-->
        <slot name="footer"></slot>
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  export default{
    name: 'Workare'
  }
</script>
