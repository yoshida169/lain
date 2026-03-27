<script setup lang="ts">
const props = defineProps<{
  message?: string;
  type?: 'success' | 'error';
}>();
</script>

<template>
  <div
    v-if="message"
    :class="[
      'px-4 py-2 rounded text-sm mb-4',
      type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700',
    ]"
  >
    {{ message }}
  </div>
</template>
