import { ref } from "vue";
import { type Item, type ItemParams, itemsApi } from "../api/items";

export function useItems() {
  const items = ref<Item[]>([]);
  const item = ref<Item | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchItems(params?: { tag?: string | string[] }) {
    loading.value = true;
    error.value = null;
    try {
      items.value = await itemsApi.index(params);
    } catch (_e) {
      error.value = "取得に失敗しました";
    } finally {
      loading.value = false;
    }
  }

  async function fetchItem(id: number) {
    loading.value = true;
    error.value = null;
    try {
      item.value = await itemsApi.show(id);
    } catch (_e) {
      error.value = "取得に失敗しました";
    } finally {
      loading.value = false;
    }
  }

  async function createItem(params: ItemParams) {
    const created = await itemsApi.create(params);
    return created;
  }

  async function updateItem(id: number, params: Partial<ItemParams>) {
    const updated = await itemsApi.update(id, params);
    return updated;
  }

  async function deleteItem(id: number) {
    await itemsApi.delete(id);
  }

  return {
    items,
    item,
    loading,
    error,
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
  };
}
