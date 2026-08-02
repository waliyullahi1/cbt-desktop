<template>
  <div class="flex w-full items-center gap-1">

    <!-- VIEW MODE -->
    <button
      v-if="!editing"
      @click="openSelect"
      class="flex w-full items-center gap-1"
    >
      <h4
        class="text-md font-medium"
        :class="!modelValue ? 'text-gray-400 italic' : ''"
      >
        {{ modelValue || placeholder }}
      </h4>

      <!-- EDIT ICON -->
      <div class="w-6 h-5 flex items-center justify-center">
        <img
          src="/image/icon/edit.svg"
          class="w-3"
          alt="edit"
        />
      </div>
    </button>

    <!-- SELECT MODE -->
    <div v-else class="flex items-center gap-2">

      <select
        v-model="localValue"
        class="border rounded px-2 py-1 text-sm"
      >
        <option disabled value="">
          {{ placeholder }}
        </option>

        <option
          v-for="(option, i) in options"
          :key="i"
          :value="option"
        >
          {{ option }}
        </option>
      </select>

      <button
        @click="save"
        class="px-2 py-1 bg-black text-white rounded text-xs"
      >
        Save
      </button>

      <button
        @click="cancel"
        class="px-2 py-1 border rounded text-xs"
      >
        Cancel
      </button>

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

  options: {
    type: Array,
    default: () => []
  },

  placeholder: {
    type: String,
    default: 'Select option'
  }
})

const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const localValue = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val || ''
  }
)

const openSelect = () => {
  editing.value = true
}

const save = () => {
  emit('update:modelValue', localValue.value)
  editing.value = false
}

const cancel = () => {
  localValue.value = props.modelValue || ''
  editing.value = false
}
</script>