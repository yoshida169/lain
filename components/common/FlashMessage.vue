<script setup lang="ts">
const props = defineProps<{
  message?: string;
  type?: 'success' | 'error';
}>();
</script>