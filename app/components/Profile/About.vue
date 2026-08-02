<template>
  <div class="mt-12 p-5 rounded-xl border border-gray-300 bg-white">

    <!-- HEADER -->
    <div class="sm:flex items-center justify-between">

      <div>
        <h3 class="font-semibold text-xl">About</h3>

        <p class="text-sm text-gray-500 mt-1">
          Tell people about yourself and your experience
        </p>
      </div>

      <div class="flex items-center gap-2">

        <!-- AI GENERATE -->
        <button
          v-if="editing"
          @click="generateAI"
          :disabled="loadingAI"
          class="flex  sm:w-fit justify-center items whitespace-normal text-nowrap w-full items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
        >

          <!-- ICON -->
          <svg
            v-if="!loadingAI"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>

          <!-- LOADING -->
          <svg
            v-else
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />

            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>

          {{ loadingAI ? 'Generating...' : 'Generate AI About' }}
        </button>

        <!-- EDIT -->
         <div class=" w-full  flex justify-end ">
        <button
          v-if="!editing"
          @click="editing = true"
          class="border md:flex justify-end items-end rounded-lg px-3 py-2 hover:bg-gray-50 transition"
        >
          <img src="/image/icon/edit.svg" class="w-3" />
        </button>

        </div>

      </div>

    </div>

    <!-- VIEW MODE -->
    <div v-if="!editing" class="mt-5">

      <p
        v-if="modelValue"
        class="text-sm leading-relaxed text-gray-700 whitespace-pre-line"
      >
        {{ modelValue }}
      </p>

      <div
        v-else
        class="border border-dashed rounded-xl p-6 text-center bg-gray-50"
      >
        <p class="text-gray-400 italic text-sm">
          Add description about yourself
        </p>
      </div>

    </div>

    <!-- EDIT MODE -->
    <div v-else class="mt-5 space-y-4">

      <textarea
        v-model="localValue"
        rows="6"
        class="w-full border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Tell people about yourself..."
      ></textarea>

      <!-- AI TIP -->
      <p class="text-xs text-gray-400">
        AI can generate a professional bio using your role, skills, and experience.
      </p>

      <!-- ACTIONS -->
      <div class="flex gap-2 justify-end">

        <button
          @click="cancel"
          class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          @click="save"
          class="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Save
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },

  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const loadingAI = ref(false)
const localValue = ref(props.modelValue)

/* =========================================
   WATCH MODEL
========================================= */

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  }
)

/* =========================================
   SAVE
========================================= */

const save = () => {
  emit('update:modelValue', localValue.value)
  editing.value = false
}

/* =========================================
   CANCEL
========================================= */

const cancel = () => {
  localValue.value = props.modelValue
  editing.value = false
}

/* =========================================
   GENERATE AI ABOUT
========================================= */

const generateAI = async () => {
  try {
    loadingAI.value = true

    // USER PAYLOAD
    const payload = {
      name: props.user?.name || '',
      title: props.user?.title || 'Professional',
      category: props.user?.category || '',
      experience: props.user?.experience || '',

      location: {
        state: props.user?.location?.state || 'Nigeria',
        country: props.user?.location?.country || ''
      },

      skills: props.user?.skills || [],
      languages: props.user?.languages || []
    }

    // API CALL
    const res = await $fetch('/api/ai/about-generate', {
      method: 'POST',

      body: {
        user: payload
      }
    })

    console.log(res)

    if (res?.success) {
      localValue.value = res.data
    }

  } catch (error) {
    console.log(error)
  } finally {
    loadingAI.value = false
  }
}
</script>