<template>
  <aside
    class="w-[210px] border-r border-white/10 bg-[#0d0d18] hidden lg:flex flex-col justify-between"
  >
    <div>
      <!-- LOGO -->
      <div class="h-20 flex items-center px-8 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon name="solar:buildings-2-bold" class="text-emerald-400 text-2xl" />
          </div>

          <div>
            <p class="font-bold text-sm">Admin Panel</p>
            <p class="text-xs text-gray-400">Property Management</p>
          </div>
        </div>
      </div>

      <!-- MENU -->
      <div class="px-4 py-6 space-y2">
        <NuxtLink
          v-for="item in links"
          :key="item.name"
          :to="item.to"
          class="sidebar-link"
        >
          <Icon :name="item.icon" class="text-md " />
          <span class=" text-sm">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- USER -->
    <div class="p-5 border-t border-white/10">
      <div class="flex items-center gap-3">
        <div class="h-12 w-12 rounded-full overflow-hidden border border-white/10">
          <img src="/image/icon/avatar.svg" class="w-full h-full object-cover" />
        </div>

        <div>
          <p class="font-medium">Admin</p>
          <p class="text-sm text-gray-400">Super Administrator</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  links: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all;
}
</style>