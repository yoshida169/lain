<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ItemForm from "../components/items/ItemForm.vue";
import { useItems } from "../composables/useItems";
import type { ItemParams } from "../api/items";

const route = useRoute();
const router = useRouter();
const { item, fetchItem, updateItem } = useItems();
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
  fetchItem(Number(route.params.id));
});

async function handleSubmit(params: ItemParams) {
  if (!item.value) return;
  loading.value = true;
  error.value = null;
  try {
    await updateItem(item.value.id, params);
    router.push(`/items/${item.value.id}`);
  } catch {
    error.value = "更新に失敗しました";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Item 編集</h1>
    <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
    <div v-if="!item" class="text-gray-500">読み込み中...</div>
    <ItemForm v-else :initial="item" :loading="loading" @submit="handleSubmit" />
  </div>
</template>
