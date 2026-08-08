<template>
<div class=" h- h-dvh w-dvw  overflow-hidden  ">
  <NuxtLayout>

    <NuxtPage />
  </NuxtLayout>
  </div>
</template>
<script setup>
import { initializeDatabase,  getDictDB} from "~/platforms"

onMounted(async () => {
    await getDictDB()
    await initializeDatabase()

})
</script>
