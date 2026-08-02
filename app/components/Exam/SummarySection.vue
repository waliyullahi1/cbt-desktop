<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

    <!-- Header -->
    <button
      class="flex w-full items-center justify-between bg-stone-100 px-6 py-3"
      @click="open = !open"
    >
      <div class="flex items-center gap-3">
        <Icon
          :name="open ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          class="text-xl"
        />

        <h2 class="text-lg font-bold">
          {{ title }}
        </h2>
      </div>
    </button>

    <Transition name="fade">
      <div
        v-show="open"
        class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3"
      >
        <ExamScoreCard
          :score="score"
          :total="total"
        />

        <ExamTimeCard
          :percent="timePercent"
          :time="time"
        />

        <ExamSpeedCard
          :speed="speed"
        />
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from "vue"

const open = ref(true)

defineProps({
  title: {
    type: String,
    default: "Summary"
  },

  score: {
    type: Number,
    default: 0
  },

  total: {
    type: Number,
    default: 100
  },

  time: {
    type: String,
    default: "00:00:00"
  },

  timePercent: {
    type: Number,
    default: 0
  },

  speed: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>