<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ItemForm from "../components/items/ItemForm.vue";
import { useItems } from "../composables/useItems";
import type { ItemParams } from "../api/items";

const router = useRouter();
const { createItem } = useItems();
const loading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit(params: ItemParams) {
  loading.value = true;
  error.value = null;
  try {
    const item = await createItem(params);
    router.push(`/vue/items/${item.id}`);
  } catch {
    error.value = "作成に失敗しました";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">新規 Item</h1>
    <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
    <ItemForm :loading="loading" @submit="handleSubmit" />
  </div>
</template>
