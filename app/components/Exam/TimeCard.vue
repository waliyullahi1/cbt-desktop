<template>
  <SummaryCard
    title="Time Spent"
    icon="lucide:clock-3"
    icon-color="text-emerald-600"
    icon-background="bg-emerald-100"
  >
    <div class="flex justify-center">

      <div class="relative h-[145px] w-[145px]">

        <svg
          class="-rotate-90"
          width="145"
          height="145"
        >
          <!-- Background -->
          <circle
            cx="72.5"
            cy="72.5"
            r="56"
            fill="none"
            stroke="#E5E7EB"
            stroke-width="10"
          />

          <!-- Progress -->
          <circle
            cx="72.5"
            cy="72.5"
            r="56"
            fill="none"
            stroke="url(#timeGradient)"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            class="transition-all duration-700"
          />

          <defs>
            <linearGradient
              id="timeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stop-color="#10B981"
              />

              <stop
                offset="100%"
                stop-color="#34D399"
              />
            </linearGradient>
          </defs>
        </svg>

        <!-- Center -->
        <div
          class="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div
            class="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100"
          >
            <Icon
              name="lucide:clock-3"
              class="h-5 w-5 text-emerald-600"
            />
          </div>

          <h2
            class="font-mono text-lg font-black text-slate-800"
          >
            {{ time }}
          </h2>

          <p class="text-[11px] text-slate-500">
            Duration
          </p>
        </div>

      </div>

    </div>

    <template #footer>

      <div
        class="mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100"
        >
          <Icon
            name="lucide:timer"
            class="h-4 w-4 text-emerald-600"
          />
        </div>

        <div>
          <p
            class="text-sm font-semibold text-emerald-700"
          >
            Great pace!
          </p>

          <p
            class="text-xs text-emerald-600"
          >
            You're managing your time well.
          </p>
        </div>

      </div>

    </template>

  </SummaryCard>
</template>

<script setup>
import { computed } from "vue"
import SummaryCard from "./SummaryCard.vue"

const props = defineProps({
  percent: {
    type: Number,
    default: 0
  },

  time: {
    type: String,
    default: "00:00:00"
  }
})

const radius = 56

const circumference = 2 * Math.PI * radius

const progressOffset = computed(() => {
  return circumference * (1 - props.percent / 100)
})
</script>