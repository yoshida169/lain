<script setup lang="ts">
</script>

<template>
  <header class="bg-gray-900 text-white px-6 py-3 flex items-center gap-6">
    <RouterLink to="/vue/items" class="text-lg font-bold tracking-wide">lain</RouterLink>
    <nav class="flex gap-4 text-sm">
      <RouterLink to="/vue/items" class="hover:text-gray-300">Items</RouterLink>
      <RouterLink to="/vue/items/new" class="hover:text-gray-300">New</RouterLink>
    </nav>
  </header>
</template>