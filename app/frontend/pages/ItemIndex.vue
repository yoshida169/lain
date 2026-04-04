<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ItemCard from "../components/items/ItemCard.vue";
import TagFilter from "../components/items/TagFilter.vue";
import { useItems } from "../composables/useItems";
import { useTags } from "../composables/useTags";
import { useItemsChannel } from "../composables/useItemsChannel";

const { items, loading, error, fetchItems } = useItems();
const { tags, fetchTags } = useTags();
const selectedTags = ref<string[]>([]);

useItemsChannel({
  onCreated(item) {
    if (
      selectedTags.value.length === 0 ||
      item.tags.some((t) => selectedTags.value.includes(t.name))
    ) {
      items.value = [item, ...items.value];
    }
  },
  onUpdated(updated) {
    const index = items.value.findIndex((i) => i.id === updated.id);
    if (index !== -1) {
      items.value[index] = updated;
    }
  },
  onDeleted(id) {
    items.value = items.value.filter((i) => i.id !== id);
  },
});

onMounted(async () => {
  await Promise.all([fetchItems(), fetchTags()]);
});

watch(selectedTags, (val) => {
  fetchItems(val.length ? { tag: val } : undefined);
});
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Items</h1>
      <RouterLink
        to="/items/new"
        class="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >新規作成</RouterLink>
    </div>

    <TagFilter
      v-if="tags.length"
      :tags="tags"
      :selected="selectedTags"
      @change="selectedTags = $event"
    />

    <div v-if="loading" class="text-gray-500">読み込み中...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="items.length === 0" class="text-gray-400 text-center py-16">
      Item がありません
    </div>
    <div v-else class="grid gap-4">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>
