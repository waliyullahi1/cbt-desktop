<script setup>
import { useRouter, useRoute } from 'vue-router'
import {  ArrowLeft  } from 'lucide-vue-next'

const props = defineProps({
  fallback: {
    type: String,
    default: '/agents'
  },
  label: {
    type: String,
    default: 'Back'
  }
})

const router = useRouter()
const route = useRoute()

const goBack = () => {
  // 🔥 best: if we stored previous route
  if (route.query.from) {
    router.push(route.query.from)
    return
  }

  // normal browser back
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.fallback)
  }
}
</script>

<template>
  <button
    @click="goBack"
    class="flex items-center  py-3  text-[14px] font-semibold text-gray-600 hover:text-black"
  >
     <ArrowLeft class="  w-5" /> {{ label }}
  </button>
</template>