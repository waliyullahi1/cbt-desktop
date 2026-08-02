<script setup>
defineProps({ data: Object })
</script>

<template>
  <div class="bg-white rounded-xl border p-4 text-sm text-gray-600">
    🕒 {{ data.text }}
  </div>
</template>
