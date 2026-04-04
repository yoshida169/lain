import { ref } from "vue";
import { type Tag, tagsApi } from "../api/tags";

export function useTags() {
  const tags = ref<Tag[]>([]);
  const loading = ref(false);

  async function fetchTags() {
    loading.value = true;
    try {
      tags.value = await tagsApi.index();
    } finally {
      loading.value = false;
    }
  }

  return { tags, loading, fetchTags };
}
