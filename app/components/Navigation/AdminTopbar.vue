<template>
  <header
    class="h-20 border-b border-white/10 px-6 flex items-center justify-between bg-[#0d0d18]"
  >
    <div>
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <p class="text-sm text-gray-400">{{ subtitle }}</p>
    </div>

    <div class="flex items-center gap-4">
      <button class="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon name="solar:bell-bold" class="text-xl" />
      </button>

      <button class="h-11 w-11 rounded-full bg-emerald-500 flex items-center justify-center">
        <Icon name="solar:add-circle-bold" class="text-2xl" />
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Dashboard" },
  subtitle: { type: String, default: "Admin panel" }
})
</script>