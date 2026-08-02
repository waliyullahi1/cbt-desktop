<template>
  <div class="mt-12 p-5 rounded-xl border border-gray-300">

    <!-- HEADER -->
    <h3 class="font-semibold text-xl">Skills and expertise</h3>

    <!-- ADD BUTTON -->
    <button
      v-if="!showSkillForm"
      @click="openSkillForm"
      class="mt-4 flex gap-3 border rounded-lg text-sm font-medium px-4 py-2"
    >
      <img src="/image/icon/plus.svg" class="w-4" />
      Add new
    </button>

    <!-- FORM -->
    <div
      v-if="showSkillForm"
      class="bg-white border mt-4 p-6 rounded-xl space-y-3"
    >
      <h4 class="font-semibold">Add Skill</h4>

      <!-- skill name -->
      <input
        v-model="skillForm.name"
        placeholder="Skill name (e.g. CSS, Vue, Python)"
        class="border w-full p-2 rounded"
      />

      <!-- level -->
      <select
        v-model="skillForm.level"
        class="border w-full p-2 rounded"
      >
        <option disabled value="">Select level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
        <option>Expert</option>
      </select>

      <div class="flex gap-2 justify-end pt-2">
        <button
          @click="closeSkillForm"
          class="px-3 py-1 border rounded"
        >
          Cancel
        </button>

        <button
          @click="saveSkill"
          class="px-3 py-1 bg-black text-white rounded"
        >
          Save
        </button>
      </div>
    </div>

    <!-- LIST -->
    <div class="grid grid-cols-3 gap-5 mt-6">

      <div
        v-for="(skill, i) in modelValue"
        :key="i"
        class="flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3"
      >
        <div>
          <h3 class="font-medium">{{ skill.name }}</h3>
          <p class="text-sm text-gray-500">{{ skill.level }}</p>
        </div>

        <button
          @click="removeSkill(i)"
          class="text-red-500 font-bold"
        >
          <img src="@/assets/images/icons/delete.svg" />
        </button>

      </div>

    </div>

    <p
      v-if="modelValue.length === 0"
      class="text-gray-400 text-sm mt-4"
    >
      No skills added yet
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'

/* ========================
PROPS
======================== */

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])


/* ========================
STATE
======================== */

const showSkillForm = ref(false)

const skillForm = ref({
  name: '',
  level: ''
})


/* ========================
FUNCTIONS
======================== */

const openSkillForm = () => {
  showSkillForm.value = true
}

const closeSkillForm = () => {
  showSkillForm.value = false
}

const saveSkill = () => {

  if (!skillForm.value.name || !skillForm.value.level) return

  const updatedSkills = [
    ...props.modelValue,
    { ...skillForm.value }
  ]

  emit('update:modelValue', updatedSkills)

  resetSkillForm()
}

const removeSkill = (index) => {

  const updatedSkills = [...props.modelValue]

  updatedSkills.splice(index, 1)

  emit('update:modelValue', updatedSkills)

}

const resetSkillForm = () => {

  skillForm.value = {
    name: '',
    level: ''
  }

  showSkillForm.value = false
}
</script>