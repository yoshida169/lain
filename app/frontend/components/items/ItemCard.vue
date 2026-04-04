<script setup lang="ts">
import type { Item } from "../../api/items";

defineProps<{ item: Item }>();
</script>

<template>
  <RouterLink
    :to="`/items/${item.id}`"
    class="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
  >
    <h2 class="font-semibold text-gray-900 mb-1 truncate">{{ item.title }}</h2>
    <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ item.content }}</p>
    <div class="flex gap-1 flex-wrap">
      <span
        v-for="tag in item.tags"
        :key="tag.id"
        class="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full"
      >{{ tag.name }}</span>
    </div>
  </RouterLink>
</template>
