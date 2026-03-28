<script setup lang="ts">
import type { Tag } from "../../api/tags";

const props = defineProps<{
  tags: Tag[];
  selected: string[];
}>();

const emit = defineEmits<{
  change: [selected: string[]];
}>();

function toggle(name: string) {
  const next = props.selected.includes(name)
    ? props.selected.filter((t) => t !== name)
    : [...props.selected, name];
  emit("change", next);
}
</script>

<template>
  <div class="flex gap-2 flex-wrap mb-6">
    <button
      v-for="tag in tags"
      :key="tag.id"
      :class="[
        'px-3 py-1 text-sm rounded-full border transition-colors',
        selected.includes(tag.name)
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400',
      ]"
      @click="toggle(tag.name)"
    >
      {{ tag.name }}
    </button>
  </div>
</template>
