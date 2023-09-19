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

<style scoped></style>
