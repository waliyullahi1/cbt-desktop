<template>
  <div class=" p-5 rounded-xl border border-gray-300 bg-white">

    <!-- HEADER -->
    <div class="sm:flex items-center justify-between">

      <div class="w-full">
        <h3 class="font-semibold text-xl text-red-600">
          Suspend Property
        </h3>

        <p class="text-sm text-gray-500 mt-1">
          Suspend this property and provide a reason to the owner
        </p>
      </div>

      <!-- EDIT BUTTON -->
      <div class=" flex justify-end">

        <button
          v-if="!editing"
          @click="editing = true"
          class="border rounded-lg px-3 py-2 hover:bg-gray-50 transition"
        >
          <img
            src="/image/icon/edit.svg"
            class="w-3"
          >
        </button>

      </div>

    </div>

    <!-- VIEW MODE -->
    <div v-if="!editing" class="mt-5">

      <div
        v-if="modelValue"
        class="bg-red-50 border border-red-200 rounded-xl p-4"
      >
        <p class="text-sm text-gray-700 whitespace-pre-line">
          {{ modelValue }}
        </p>
      </div>

      <div
        v-else
        class="border border-dashed rounded-xl p-6 text-center bg-gray-50"
      >
        <p class="text-gray-400 italic text-sm">
          No suspension reason added
        </p>
      </div>

    </div>

    <!-- EDIT MODE -->
    <div v-else class="mt-5 space-y-4">

      <textarea
        v-model="reason"
        rows="6"
        class="w-full border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Explain why this property is being suspended..."
      />

      <!-- ACTIONS -->
      <div class="flex gap-2 justify-end">

        <button
          @click="cancel"
          class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          :disabled="loading"
          @click="suspend"
          class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {{ loading ? 'Suspending...' : 'Suspend Property' }}
        </button>

         <button
          :disabled="loading"
          @click="activate_property" v-if="suspended.isSuspended"
          class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {{ loading ? 'Reactivate...' : 'Reactivate Property' }}
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

  propertyId: {
    type: String,
    required: true
  },
  suspended:{}
})

const emit = defineEmits([
  'update:modelValue',
  'suspended'
])

const { $toast } = useNuxtApp()

/* =========================================
   STATE
========================================= */

const editing = ref(false)

const loading = ref(false)

const reason = ref(props.modelValue || '')



/* =========================================
   WATCH
========================================= */

watch(
  () => props.modelValue,
  (val) => {
    reason.value = val || ''
  }
)

/* =========================================
   SUSPEND
========================================= */

const suspend = async () => {

  try {

    if (!reason.value.trim()) {

      $toast.error(
        'Please provide suspension reason'
      )

      return
    }

    loading.value = true

    const res = await useApiFetch(
      `/admin/property/status/${props.propertyId}`,
      {
        method: 'PATCH',

        body: {
          status: 'suspended',
          reason: reason.value
        }
      }
    )

    if (!res.success) {

      throw new Error(
        res.message ||
        'Failed to suspend property'
      )
    }

    emit(
      'update:modelValue',
      reason.value
    )

    emit('suspended')

    editing.value = false

    $toast.success(
      'Property suspended successfully'
    )

  } catch (err) {

    console.log(err)

    $toast.error(
      err?.message ||
      'Failed to suspend property'
    )

  } finally {

    loading.value = false

  }

}

const activate_property = async () => {

  try {

    if (!reason.value.trim()) {

      $toast.error(
        'Please provide suspension reason'
      )

      return
    }

    loading.value = true

    const res = await useApiFetch(
      `/admin/property/status/${props.propertyId}`,
      {  method: 'PATCH',    body: {status: 'approved', }  }
    )

    if (!res.success) {

      throw new Error(
        res.message ||
        'Failed to suspend property'
      )
    }

    emit(
      'update:modelValue',
      reason.value
    )

    emit('suspended')

    editing.value = false

    $toast.success(
      'Property Reactivate  successfully'
    )

  } catch (err) {

    console.log(err)

    $toast.error(
      err?.message ||
      'Failed to reactivate property'
    )

  } finally {

    loading.value = false

  }

}

/* =========================================
   CANCEL
========================================= */

const cancel = () => {

  reason.value = props.modelValue || ''

  editing.value = false

}
</script>