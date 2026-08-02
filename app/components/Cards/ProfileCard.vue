<script setup>
defineProps({ data: Object })
</script>

<template>
  <div class="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center">

    <img
      :src="data.avatar"
      class="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
    />

    <h3 class="font-semibold">{{ data.name }}</h3>
    <p class="text-gray-500 text-sm">{{ data.job }}</p>

    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
      View Profile
    </button>
  </div>
</template>
