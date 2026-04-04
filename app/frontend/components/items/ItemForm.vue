<script setup lang="ts">
import { ref } from "vue";
import type { Item, ItemParams } from "../../api/items";

const props = defineProps<{
  initial?: Item;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [params: ItemParams];
}>();

const title = ref(props.initial?.title ?? "");
const content = ref(props.initial?.content ?? "");
const tagNames = ref(props.initial?.tag_names ?? "");

function handleSubmit() {
  emit("submit", {
    title: title.value,
    content: content.value,
    tag_names: tagNames.value,
  });
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label for="item-title" class="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
      <input
        id="item-title"
        v-model="title"
        type="text"
        required
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
    <div>
      <label for="item-content" class="block text-sm font-medium text-gray-700 mb-1">内容</label>
      <textarea
        id="item-content"
        v-model="content"
        rows="6"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
    <div>
      <label for="item-tag-names" class="block text-sm font-medium text-gray-700 mb-1">
        タグ <span class="text-gray-400 font-normal">（カンマ区切り）</span>
      </label>
      <input
        id="item-tag-names"
        v-model="tagNames"
        type="text"
        placeholder="例: ruby, rails, memo"
        class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
    <div class="flex gap-2 pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ loading ? "保存中..." : "保存" }}
      </button>
      <RouterLink
        to="/items"
        class="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
      >キャンセル</RouterLink>
    </div>
  </form>
</template>
