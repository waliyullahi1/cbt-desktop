<template>
  <div class="flex gap-1 items-center">

    <img src="/image/icon/message1.svg" />

    <!-- VIEW MODE -->
    <div v-if="!editing" class="flex items-center gap-2">

      <h4 v-if="modelValue.length" class="text-sm font-medium">
        Speaks {{ modelValue.join(', ') }}
      </h4>

      <h4 v-else class="text-sm text-gray-400">
        Add language
      </h4>

      <img
        src="/image/icon/edit.svg"
        class="w-3 cursor-pointer"
        @click="startEdit"
      />

    </div>


    <!-- EDIT MODE -->
    <div v-else class="border p-3 rounded-lg bg-white shadow-sm space-y-2">

      <div class="flex gap-2 items-center">

        <select
          v-model="newLanguage"
          class="border p-1 rounded text-sm"
        >
          <option disabled value="">Select language</option>
          <option>English</option>
          <option>French</option>
          <option>Yoruba</option>
          <option>Hausa</option>
          <option>Igbo</option>
          <option value="other">Other</option>
        </select>

        <input
          v-if="newLanguage === 'other'"
          v-model="customLanguage"
          placeholder="Type language"
          class="border p-1 rounded text-sm"
        />

        <button
          @click="addLanguage"
          class="px-2 py-1 bg-black text-white rounded text-sm"
        >
          Add
        </button>

      </div>


      <!-- LANGUAGE LIST -->
      <div class="flex flex-wrap gap-2">

        <div
          v-for="(lang, i) in tempLanguages"
          :key="i"
          class="flex items-center gap-2 border px-2 py-1 rounded text-sm"
        >
          {{ lang }}

          <button
            class="text-red-500"
            @click="removeLanguage(i)"
          >
            ✕
          </button>

        </div>

      </div>


      <!-- ACTIONS -->
      <div class="flex justify-end gap-2 pt-2">

        <button
          @click="cancelEdit"
          class="px-3 py-1 border rounded text-sm"
        >
          Cancel
        </button>

        <button
          @click="saveLanguages"
          class="px-3 py-1 bg-black text-white rounded text-sm"
        >
          Save
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const editing = ref(false)

const tempLanguages = ref([])

const newLanguage = ref('')
const customLanguage = ref('')

/* START EDIT */
const startEdit = () => {
  tempLanguages.value = [...props.modelValue]
  editing.value = true
}

/* ADD */
const addLanguage = () => {

  let language = newLanguage.value

  if (language === 'other') {
    language = customLanguage.value.trim()
  }

  if (!language) return

  if (!tempLanguages.value.includes(language)) {
    tempLanguages.value.push(language)
  }

  newLanguage.value = ''
  customLanguage.value = ''
}

/* REMOVE */
const removeLanguage = (index) => {
  tempLanguages.value.splice(index, 1)
}

/* SAVE */
const saveLanguages = () => {
  emit('update:modelValue', tempLanguages.value)
  editing.value = false
}

/* CANCEL */
const cancelEdit = () => {
  editing.value = false
}
</script>