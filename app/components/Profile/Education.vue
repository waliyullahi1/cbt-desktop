<template>
  <div class="mt-12 relative flex justify-between h-fit p-5 rounded-xl border border-gray-300">

    <div class="w-full">

      <!-- HEADER -->
      <h3 class="font-semibold text-xl">Education</h3>
      <p class="text-sm text-gray-600">
        Back up your skills and qualifications with educational degrees.
      </p>

      <!-- ADD BUTTON -->
      <button
        v-if="!showEduForm"
        @click="openEduForm"
        class="mt-5 flex gap-3 border rounded-lg text-sm font-medium px-4 py-2"
      >
        + Add education
      </button>


      <!-- FORM -->
      <div
        v-if="showEduForm"
        class="bg-white border mt-4 p-6 rounded-xl space-y-3"
      >
        <h4 class="font-semibold">Add Education</h4>

        <input
          v-model="eduForm.school"
          placeholder="School name"
          class="border w-full p-2 rounded"
        />

        <select
          v-model="eduForm.level"
          class="border w-full p-2 rounded"
        >
          <option disabled value="">Select education level</option>
          <option>B.Sc.</option>
          <option>M.Sc.</option>
          <option>MBA</option>
          <option>BFA</option>
          <option>MFA</option>
          <option>PhD</option>
        </select>

        <input
          v-model="eduForm.degree"
          placeholder="Course of study"
          class="border w-full p-2 rounded"
        />

        <input
          v-model="eduForm.year"
          type="date"
          class="border w-full p-2 rounded"
        />

        <div class="flex gap-2 justify-end pt-2">
          <button
            @click="closeEduForm"
            class="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            @click="saveEducation"
            class="px-3 py-1 bg-black text-white rounded"
          >
            Save
          </button>
        </div>
      </div>


      <!-- LIST -->
      <div class="mt-6 space-y-3">

        <div
          v-for="(item, i) in modelValue"
          :key="i"
          class="flex justify-between border rounded-lg px-4 py-3"
        >
          <div>
            <h4 class="font-medium">{{ item.school }}</h4>
            <p class="text-sm text-gray-500">
              {{ item.level }} • {{ item.degree }}
            </p>
            <p class="text-sm text-gray-400">{{ item.year }}</p>
          </div>

          <button
            @click="removeEducation(i)"
            class="text-red-500"
          >
            <img src="@/assets/images/icons/delete.svg" />
          </button>
        </div>

        <p
          v-if="modelValue.length === 0"
          class="text-gray-400 text-sm"
        >
          No education added yet
        </p>

      </div>

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

const showEduForm = ref(false)

const eduForm = ref({
  school: '',
  level: '',
  degree: '',
  year: ''
})


/* =========================
FUNCTIONS
========================= */

const openEduForm = () => {
  showEduForm.value = true
}

const closeEduForm = () => {
  showEduForm.value = false
}

const saveEducation = () => {

  if (!eduForm.value.school.trim()) return

  const updated = [
    ...props.modelValue,
    { ...eduForm.value }
  ]

  emit('update:modelValue', updated)

  resetForm()
}

const removeEducation = (index) => {

  const updated = [...props.modelValue]

  updated.splice(index, 1)

  emit('update:modelValue', updated)
}

const resetForm = () => {

  eduForm.value = {
    school: '',
    level: '',
    degree: '',
    year: ''
  }

  showEduForm.value = false
}
</script>