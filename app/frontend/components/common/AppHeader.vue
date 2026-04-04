<script setup lang="ts">
</script>

<template>
  <header class="bg-white border-b border-slate-200">
    <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <RouterLink to="/items" class="font-bold text-slate-800">lain</RouterLink>
      <RouterLink
        to="/items/new"
        class="bg-indigo-600 text-white text-sm px-4 py-2 rounded"
      >New item</RouterLink>
    </div>
  </header>
</template>
