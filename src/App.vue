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
    padding-top: 20px;
    padding-bottom: 20px;
    margin: auto;
    border-bottom: 1px solid #ddd;
  }

  nav a.router-link-exact-active {
    color: black;
    font-weight: bold;
  }

  nav a.router-link-exact-active:hover {
    background-color: white;
  }

  nav a {
    font-size: 16px;
    margin-right: 15px;
    color: black;
    display: block;
    padding: 0 3rem;
    transition: 0.5s;
    text-decoration: none;
  }

  nav a:hover {
    /* font-weight: bold; */
    background-color: white;
    border-radius: 50px;
  }

  nav a:first-of-type {
    border: 0;
  }

  .pollpic {
    margin: auto;
    position: fixed;
  }
}
</style>
