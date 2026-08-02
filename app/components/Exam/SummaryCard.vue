<template>
  <div
    class="rounded-2xl  border-slate-200 bg-white p-5 -sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Header -->
    <div class="mb-5 flex items-center gap-3">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl"
        :class="iconBackground"
      >
        <Icon
          :name="icon"
          class="h- text-xl w-6"
          :class="iconColor"
        />
      </div>

      <div>
        <h2 class="text-sm font-bold text-slate-800">
          {{ title }}
        </h2>

        <p class="text-xs text-slate-500">
          Exam Summary
        </p>
      </div>
    </div>

    <!-- Body -->
    <div class="flex justify-center">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="mt-5">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: "lucide:circle"
  },
  iconColor: {
    type: String,
    default: "text-blue-600"
  },
  iconBackground: {
    type: String,
    default: "bg-blue-100"
  }
})
</script>