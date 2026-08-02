<template>
  <div class="mt-12 p-5 rounded-xl border border-gray-300 bg-white">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold text-xl">Social Media</h3>
        <p class="text-sm text-gray-500 mt-1">
          Connect with your audience on social platforms
        </p>
      </div>

      <button
        v-if="!editing"
        @click="editing = true"
        class="text-sm border px-4 py-1.5 rounded-lg hover:bg-gray-50"
      >
        Edit
      </button>
    </div>

    <!-- ================= VIEW MODE ================= -->
    <div v-if="!editing" class="mt-6 flex gap-6 text-2xl">

      <a v-if="modelValue.facebook" :href="modelValue.facebook" target="_blank">
        <Icon name="mdi:facebook" class="hover:text-blue-600" />
      </a>

      <a v-if="modelValue.instagram" :href="modelValue.instagram" target="_blank">
        <Icon name="mdi:instagram" class="hover:text-pink-600" />
      </a>

        <a v-if="modelValue.tiktok" :href="modelValue.tiktok" target="_blank">
        <Icon name="simple-icons:tiktok" class="text-black" />
        </a>

      <a v-if="modelValue.youtube" :href="modelValue.youtube" target="_blank">
        <Icon name="mdi:youtube" class="hover:text-red-600" />
      </a>

      <a v-if="modelValue.whatsapp" :href="modelValue.whatsapp" target="_blank">
        <Icon name="mdi:whatsapp" class="hover:text-green-600" />
      </a>

      <p v-if="isEmpty" class="text-gray-400 text-sm">
        No social media added
      </p>

    </div>

    <!-- ================= EDIT MODE ================= -->
    <div v-else class="mt-6 space-y-4">

      <div v-for="item in fields" :key="item.key" class="flex items-center gap-3">
        <Icon :name="item.icon" class="text-xl" />
        <input
          v-model="localValue[item.key]"
          type="text"
          :placeholder="item.placeholder"
          class="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-black"
        />
      </div>

      <!-- ACTIONS -->
      <div class="flex gap-2 justify-end pt-2">
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
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      tiktok: '',
      facebook: '',
      instagram: '',
      whatsapp: '',
      youtube: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const localValue = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => (localValue.value = { ...val })
)

const fields = [
  { key: 'facebook', icon: 'mdi:facebook', placeholder: 'Facebook URL' },
  { key: 'instagram', icon: 'mdi:instagram', placeholder: 'Instagram URL' },
  { key: 'tiktok', icon: 'simple-icons:tiktok', placeholder: 'TikTok URL' }, // ✅
  { key: 'youtube', icon: 'mdi:youtube', placeholder: 'YouTube URL' },
  { key: 'whatsapp', icon: 'mdi:whatsapp', placeholder: 'WhatsApp Link' }
]

const isEmpty = computed(() =>
  !Object.values(props.modelValue || {}).some(Boolean)
)

const save = () => {
  emit('update:modelValue', localValue.value)
  editing.value = false
}

const cancel = () => {
  localValue.value = { ...props.modelValue }
  editing.value = false
}
</script>