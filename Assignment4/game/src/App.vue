<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div>
    <header class="app-header">
      <nav-bar />
    </header>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>
