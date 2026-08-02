<template>
  <ExamSummaryCard
    title="Speed"
    icon="lucide:gauge"
    icon-color="text-orange-500"
    icon-background="bg-orange-100"
  >
    <div class="relative flex justify-center">

      <svg
        width="170"
        height="100"
        viewBox="0 0 170 100"
      >
        <!-- Background Arc -->
        <path
          d="M20 85 A65 65 0 0 1 150 85"
          stroke="#E5E7EB"
          stroke-width="10"
          fill="none"
          stroke-linecap="round"
        />

        <!-- Progress Arc -->
        <path
          d="M20 85 A65 65 0 0 1 150 85"
          stroke="url(#speedGradient)"
          stroke-width="10"
          fill="none"
          stroke-linecap="round"
          pathLength="100"
          :stroke-dasharray="100"
          :stroke-dashoffset="100 - speedPercent"
          class="transition-all duration-700"
        />

        <defs>
          <linearGradient
            id="speedGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stop-color="#F59E0B"
            />
            <stop
              offset="100%"
              stop-color="#FB923C"
            />
          </linearGradient>
        </defs>
      </svg>

      <!-- Center -->
      <div
        class="absolute inset-0 top-6 flex flex-col items-center"
      >
        <Icon
          name="lucide:gauge"
          class="mb-1 h-6 w-6 text-orange-500"
        />

        <h2
          class="text-2xl font-black text-orange-500"
        >
          {{ speed.toFixed(1) }}
        </h2>

        <p
          class="text-xs text-slate-500"
        >
          score/min
        </p>
      </div>

    </div>

    <template #footer>

      <div
        class="mt-4 rounded-xl bg-orange-50 p-3"
      >
        <div class="flex items-center gap-3">

          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100"
          >
            <Icon
              name="lucide:zap"
              class="h-4 w-4 text-orange-500"
            />
          </div>

          <div>

            <p
              class="text-sm font-semibold text-orange-700"
            >
              {{ message }}
            </p>

            <p
              class="text-xs text-orange-600"
            >
              {{ speed.toFixed(1) }} score every minute
            </p>

          </div>

        </div>
      </div>

    </template>

  </ExamSummaryCard>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  speed: {
    type: Number,
    default: 0
  }
})

const speedPercent = computed(() =>
  Math.min(props.speed * 10, 100)
)

const message = computed(() => {
  if (props.speed >= 8)
    return "Excellent speed!"

  if (props.speed >= 6)
    return "Very good speed."

  if (props.speed >= 4)
    return "Average speed."

  return "Needs improvement."
})
</script>