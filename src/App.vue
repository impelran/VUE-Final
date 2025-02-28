<template>
  <div id="app">
    <nav>
      <router-link to="/add-feed">Register a Feed</router-link> |
      <router-link to="/">List of Feeds</router-link> |
      <router-link to="/preferences">Preferences</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
nav {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}
nav a.router-link-exact-active {  
  font-weight: bold;
  color: black;
}
</style>