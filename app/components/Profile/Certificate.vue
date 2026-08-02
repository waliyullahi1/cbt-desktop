<template>
  <div class="mt-12 relative flex justify-between h-fit p-5 rounded-xl border border-gray-300">

    <div class="w-full">

      <!-- HEADER -->
      <h3 class="font-semibold text-xl">Certifications</h3>
      <p class="text-sm text-gray-600">
        Showcase your mastery with certifications earned in your field.
      </p>

      <!-- ADD BUTTON -->
      <button
        v-if="!showCertForm"
        @click="openCertForm"
        class="mt-5 flex gap-3 border rounded-lg text-sm font-medium px-4 py-2"
      >
        + Add certificate
      </button>


      <!-- FORM -->
      <div
        v-if="showCertForm"
        class="mt-5 bg-white border rounded-xl p-6 space-y-3"
      >
        <h4 class="font-semibold">Add Certificate</h4>

        <input
          v-model="certForm.certificate"
          placeholder="Certificate or Award"
          class="border w-full p-2 rounded"
        />

        <input
          v-model="certForm.place"
          placeholder="Received from (School, Organization, etc)"
          class="border w-full p-2 rounded"
        />

        <input
          v-model="certForm.year"
          type="date"
          class="border w-full p-2 rounded"
        />

        <div class="flex gap-2 justify-end pt-2">
          <button
            @click="closeCertForm"
            class="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            @click="saveCert"
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
            <h4 class="font-medium">{{ item.certificate }}</h4>
            <p class="text-sm text-gray-500">{{ item.place }}</p>
            <p class="text-sm text-gray-400">{{ item.year }}</p>
          </div>

          <button
            @click="removeCert(i)"
            class="text-red-500"
          >
            <img src="@/assets/images/icons/delete.svg" />
          </button>
        </div>

        <p
          v-if="modelValue.length === 0"
          class="text-gray-400 text-sm"
        >
          No certificates added yet
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

const showCertForm = ref(false)

const certForm = ref({
  certificate: '',
  place: '',
  year: ''
})


/* =========================
FUNCTIONS
========================= */

const openCertForm = () => {
  showCertForm.value = true
}

const closeCertForm = () => {
  showCertForm.value = false
}

const saveCert = () => {

  if (!certForm.value.certificate.trim()) return

  const updated = [
    ...props.modelValue,
    { ...certForm.value }
  ]

  emit('update:modelValue', updated)

  resetForm()
}

const removeCert = (index) => {

  const updated = [...props.modelValue]

  updated.splice(index, 1)

  emit('update:modelValue', updated)
}

const resetForm = () => {
  certForm.value = {
    certificate: '',
    place: '',
    year: ''
  }

  showCertForm.value = false
}
</script>