<template>
  <div class='menu'>
    <div class='menu_logo clear'>
      <div class='menu_logo_item'>
        <img src='../../assets/logo.png' alt='logo'>
      </div>
      <div class='menu_logo_item'>
        <p>电子科技大学</p>
        <p>{{title}}</p>
      </div>
    </div>
    <div class='menu_list'>
      <template v-for='x in menuList'>
        <h6>{{x.type}}</h6>
        <ul>
          <li v-for='y in x.list'>
            <router-link :to='y.link'>
              <svg class="icon" aria-hidden="true"><use v-bind:xlink:href=y.icon></use></svg>
              {{y.name}}
            </router-link>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'MenuBar',
    props: [
      'title',
      'menuList'
    ]
  }
</script>
