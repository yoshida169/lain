<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItems } from "../composables/useItems";

const route = useRoute();
const router = useRouter();
const { item, loading, error, fetchItem, deleteItem } = useItems();

onMounted(() => {
  fetchItem(Number(route.params.id));
});

async function handleDelete() {
  if (!item.value) return;
  await deleteItem(item.value.id);
  router.push("/vue/items");
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div v-if="loading" class="text-gray-500">読み込み中...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="item">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">{{ item.title }}</h1>
        <div class="flex gap-2">
          <RouterLink
            :to="`/vue/items/${item.id}/edit`"
            class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >編集</RouterLink>
          <button
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            @click="handleDelete"
          >削除</button>
        </div>
      </div>
      <div class="mb-4 flex gap-2 flex-wrap">
        <span
          v-for="tag in item.tags"
          :key="tag.id"
          class="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full"
        >{{ tag.name }}</span>
      </div>
      <p class="whitespace-pre-wrap text-gray-800">{{ item.content }}</p>
      <RouterLink to="/vue/items" class="mt-8 inline-block text-sm text-gray-500 hover:underline">
        ← 一覧に戻る
      </RouterLink>
    </div>
  </div>
</template>