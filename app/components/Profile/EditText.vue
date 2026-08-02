<template>
  <div class="flex items-center gap-1">

    <!-- VIEW MODE -->
    <div v-if="!editing" class="flex items-center gap-1">

      <h4
        class="sm:text-md text-sm font-medium"
        :class="!modelValue ? 'text-gray-400 italic' : ''"
      >
        {{ modelValue || placeholder }}
      </h4>

      <button class="w-6 h-5" @click="editing = true">
        <img src="/image/icon/edit.svg" class="w-3" />
      </button>

    </div>


    <!-- EDIT MODE -->
    <div v-else class="flex items-center gap-2">

      <input
        v-model="localValue"
        :placeholder="placeholder"
        class="border rounded px-2 py-1 text-sm"
      />

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
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Add text'
  }
})

const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

const save = () => {
  emit('update:modelValue', localValue.value)
  editing.value = false
}

const cancel = () => {
  localValue.value = props.modelValue
  editing.value = false
}
</script>