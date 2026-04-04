<script setup lang="ts">
import AppHeader from "./components/common/AppHeader.vue";
</script>

<template>
  <AppHeader />
  <main class="max-w-4xl mx-auto px-6 py-8">
    <RouterView />
  </main>
</template>
