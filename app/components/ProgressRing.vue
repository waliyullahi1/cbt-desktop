<template>
  <div class="relative flex h-10 w-10 items-center justify-center">
    <svg viewBox="0 0 40 40" class="h-10 w-10 -rotate-90">
      <circle cx="20" cy="20" r="16" fill="none" stroke-width="3.5" class="stroke-line" />
      <circle
        cx="20" cy="20" r="16" fill="none" stroke-width="3.5" stroke-linecap="round"
        :class="ringColorClass"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <span class="absolute font-['IBM_Plex_Mono',monospace] text-[10px] font-semibold" :class="textColorClass">
      {{ percent }}%
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, default: 0 }
})

const radius = 16
const circumference = 2 * Math.PI * radius

const offset = computed(() => {
  const clamped = Math.min(100, Math.max(0, props.percent))
  return circumference - (clamped / 100) * circumference
})

const ringColorClass = computed(() => {
  if (props.percent >= 70) return 'stroke-good'
  if (props.percent >= 40) return 'stroke-gold'
  if (props.percent > 0) return 'stroke-bad'
  return 'stroke-line'
})

const textColorClass = computed(() => {
  if (props.percent >= 70) return 'text-good'
  if (props.percent >= 40) return 'text-gold'
  if (props.percent > 0) return 'text-bad'
  return 'text-ink-soft'
})
</script>
