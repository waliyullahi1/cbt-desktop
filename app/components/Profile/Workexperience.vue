<template>
  <div class="mt-12 p-5 rounded-xl border border-gray-300">

    <!-- HEADER -->
    <h3 class="font-semibold text-xl">Work Experience</h3>

    <p class="text-sm text-gray-600">
      Add your job history and achievements to give clients insight into your expertise.
    </p>

    <!-- ADD BUTTON -->
    <button
      v-if="!showWorkForm"
      @click="openWorkForm"
      class="mt-5 flex gap-3 border rounded-lg text-sm font-medium px-4 py-2"
    >
      + Add new
    </button>


    <!-- FORM -->
    <div
      v-if="showWorkForm"
      class="bg-white border mt-4 p-6 rounded-xl space-y-3"
    >
      <h4 class="font-semibold">Add Work Experience</h4>

      <input
        v-model="workForm.company"
        placeholder="Company name"
        class="border w-full p-2 rounded"
      />

      <input
        v-model="workForm.role"
        placeholder="Job title / Role"
        class="border w-full p-2 rounded"
      />

      <div class="flex gap-3">
        <input
          v-model="workForm.start"
          type="date"
          class="border w-full p-2 rounded"
        />

        <input
          v-model="workForm.end"
          type="date"
          class="border w-full p-2 rounded"
        />
      </div>

      <textarea
        v-model="workForm.description"
        placeholder="Describe what you did..."
        rows="3"
        class="border w-full p-2 rounded"
      />

      <div class="flex gap-2 justify-end pt-2">
        <button
          @click="closeWorkForm"
          class="px-3 py-1 border rounded"
        >
          Cancel
        </button>

        <button
          @click="saveWork"
          class="px-3 py-1 bg-black text-white rounded"
        >
          Save
        </button>
      </div>
    </div>


    <!-- LIST -->
    <div class="mt-6 space-y-4">

      <div
        v-for="(item, i) in modelValue"
        :key="i"
        class="border rounded-lg p-4 flex justify-between"
      >
        <div>
          <h4 class="font-semibold">{{ item.role }}</h4>
          <p class="text-sm text-gray-600">{{ item.company }}</p>

          <p class="text-xs text-gray-400">
            {{ item.start }} → {{ item.end || 'Present' }}
          </p>

          <p class="text-sm mt-2 text-gray-600">
            {{ item.description }}
          </p>
        </div>

        <button
          @click="removeWork(i)"
          class="text-red-500"
        >
          <img src="@/assets/images/icons/delete.svg" />
        </button>
      </div>

      <p
        v-if="modelValue.length === 0"
        class="text-gray-400 text-sm"
      >
        No work experience added yet
      </p>

    </div>

  </div>
</template>



<script setup>
import { ref } from 'vue'

/* =========================
PROPS
========================= */

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])


/* =========================
STATE
========================= */

const showWorkForm = ref(false)

const workForm = ref({
  company: '',
  role: '',
  start: '',
  end: '',
  description: ''
})


/* =========================
FUNCTIONS
========================= */

const openWorkForm = () => {
  showWorkForm.value = true
}

const closeWorkForm = () => {
  showWorkForm.value = false
}

const saveWork = () => {

  if (!workForm.value.company || !workForm.value.role) return

  const updated = [
    ...props.modelValue,
    { ...workForm.value }
  ]

  emit('update:modelValue', updated)

  resetWorkForm()
}

const removeWork = (index) => {

  const updated = [...props.modelValue]

  updated.splice(index, 1)

  emit('update:modelValue', updated)
}

const resetWorkForm = () => {

  workForm.value = {
    company: '',
    role: '',
    start: '',
    end: '',
    description: ''
  }

  showWorkForm.value = false
}
</script>