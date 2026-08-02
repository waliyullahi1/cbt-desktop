<template>
  <div class="min-h-screen bg-[#0b0b14] text-white flex">
  <SignIn v-if="auth?.showLoginModal"/> 
    <!-- SIDEBAR -->
    <NavigationAdminSidebar :links="sidebarLinks" />

    <!-- MAIN -->
    <main class="flex-1 overflow-hidden">

      <!-- TOPBAR -->
      <NavigationAdminTopbar
        :title="title"
        :subtitle="subtitle"
      />

      <!-- PAGE CONTENT -->
      <div class="p-6 overflow-y-auto h-[calc(100vh-80px)]">
        <slot />
      </div>

    </main>

  </div>
</template>

<script setup>


defineProps({
  title: { type: String, default: "Dashboard" },
  subtitle: { type: String, default: "Monitor system activity" }
})

const sidebarLinks = [
  { name: 'Dashboard', to: '/admin', icon: 'solar:home-2-bold' },
  { name: 'Users', to: '/admin/users', icon: 'solar:users-group-rounded-bold' },
  { name: 'Properties', to: '/admin/properties', icon: 'solar:buildings-2-bold' },
  { name: 'Reports', to: '/admin/reports', icon: 'solar:chart-bold' },
  { name: 'Account verifications', to: '/admin/verify-acc', icon: 'solar:verified-check-bold' },
  { name: 'Settings', to: '/admin/settings', icon: 'solar:settings-bold' },
  { name: 'Orders', to: '/admin/order', icon: 'solar:solar:bag-check-bold' }
]
</script>

