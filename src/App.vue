<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav class>
    <RouterLink class="homeLink" to="/"> Home </RouterLink>
    <RouterLink class="aboutLink" to="/about"> About </RouterLink>
    <RouterLink class="userAuthLink" to="/UserAuth">
      Login / SignUp
    </RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
@media (min-width: 1024px) {
  nav {
    display: flex;
    position: absolute;
    font-size: 1rem;
    right: 0;
    top: 0;
    background-color: #31c48d;
    width: 100%;
    max-height: 100%;
    justify-content: right;
    padding-top: 30px;
    padding-bottom: 30px;
    margin: auto;
    border-bottom: 1px solid #ddd;
  }

  nav a.router-link-exact-active {
    color: black;
    font-weight: bolder;
  }

  nav a.router-link-exact-active:hover {
    background-color: white;
  }

  nav a {
    font-size: 16px;
    color: black;
    display: block;
    margin-right: 30px;
    margin-left: 30px;
    padding-right: 10px;
    padding-left: 10px;
    transition: 0.5s;
    text-decoration: none;
  }

  nav a:hover {
    background-color: white;
    border-radius: 50px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .pollpic {
    margin: auto;
    position: fixed;
  }
}
</style>
