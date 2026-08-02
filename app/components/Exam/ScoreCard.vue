<template>
  <SummaryCard
  title="Score"
    icon="lucide:target"
    icon-color="text-indigo-600"
    icon-background=" bg-gradient-to-br from-indigo-100 to-blue-100"
  
  >
  <div class=" w-full">
    <!-- Header -->
    <!-- <div class="flex items-center gap-3">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100"
      >
        <Icon
          name="lucide:target"
          class="h-6 w-6 text-indigo-600"
        />
      </div>

      <div>
        <h2 class="text-lg font-bold text-slate-800">
          Score
        </h2>

        <p class="text-xs text-slate-500">
          Performance
        </p>
      </div>
    </div> -->

    <!-- Circle -->
    <div class="relative mx-auto mt-5 flex h-[120px] w-[120px] items-center justify-center">

      <svg
        class="-rotate-90"
        width="120"
        height="120"
      >
        <!-- Background -->
        <circle
          cx="60"
          cy="60"
          :r="radius"
          fill="none"
          stroke="#E5E7EB"
          stroke-width="10"
        />

        <!-- Progress -->
        <circle
          cx="60"
          cy="60"
          :r="radius"
          fill="none"
          stroke="url(#gradient)"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          class="transition-all duration-700"
        />

        <defs>
          <linearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color="#4F46E5"
            />

            <stop
              offset="100%"
              stop-color="#3B82F6"
            />
          </linearGradient>
        </defs>
      </svg>

      <!-- Center -->
      <div class="absolute hi text-center">

        <h3
          class="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-2xl font-extrabold text-transparent"
        >
          {{ percentage }}%
        </h3>

        <p class="text-xs text-slate-500">
          {{ score }} / {{ total }}
        </p>

      </div>

    </div>

    <!-- Bottom Stats -->
    <div
      class="mt-5  rounded-xl bg-slate-50 p-3"
    >

      <div class="flex items-center justify-between">

        <span class="text-sm text-slate-500">
          Result
        </span>

        <span
          class="rounded-full px-3 py-1 text-xs font-bold"
          :class="badgeClass"
        >
          {{ message }}
        </span>

      </div>

      <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

        <div
          class="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-700"
          :style="{ width: percentage + '%' }"
        />

      </div>

    </div>
</div>
  </SummaryCard>
</template>

<script setup>
import { computed } from "vue"
import SummaryCard from "./SummaryCard.vue"
const props = defineProps({
  score: {
    type: Number,
    default: 0
  },

  total: {
    type: Number,
    default: 100
  }
})

const radius = 50

const circumference = 2 * Math.PI * radius

const percentage = computed(() => {
  if (!props.total) return 0

  return Math.round((props.score / props.total) * 100)
})

const progressOffset = computed(() => {
  return circumference * (1 - percentage.value / 100)
})

const message = computed(() => {
  if (percentage.value >= 80) return "Excellent"
  if (percentage.value >= 60) return "Good"
  if (percentage.value >= 40) return "Average"
  return "Needs Work"
})

const badgeClass = computed(() => {
  if (percentage.value >= 80)
    return "bg-green-100 text-green-700"

  if (percentage.value >= 60)
    return "bg-blue-100 text-blue-700"

  if (percentage.value >= 40)
    return "bg-yellow-100 text-yellow-700"

  return "bg-red-100 text-red-700"
})
</script>