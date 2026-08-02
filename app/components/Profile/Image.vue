<template>
  <button  class="flex group  items-end relative">
    
    <img
      :src="preview || defaultAvatar"
      class="w-28 h-28 rounded-full border object-cover"
    />

    <label class="w-8 h-8 absolute bottom-0 right-0 bg-white border rounded-full flex items-center justify-center cursor-pointer">
      <input
        type="file"
        
        class="hidden"
        accept=".png,.jpg,.jpeg,.webp"
        @change="onFileChange"
      />
      📷 
    </label>
    <label class="absolute hidden group-hover:flex inset-0 bg-black/70  duration-700 items-center justify-center rounded-full">
      <input
        type="file"
        
        class="hidden"
        accept=".png,.jpg,.jpeg,.webp"
        @change="onFileChange"
      />
      <img src="/image/icon/white_cameral.svg" class=" w-8  text-white" />
    </label>

    <div v-if="loading" class="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
      Uploading...
    </div>
       

  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const { $toast } = useNuxtApp()

const preview = ref('')
const loading = ref(false)

const defaultAvatar = '/image/icon/avatar.svg'

/* =========================
LOAD USER PROFILE ON PAGE OPEN
========================= */

onMounted(async () => {

  try {

    const res = await fetch(`${config.public.api_url}/profile/avatar`, {
      credentials: 'include'
    })

    const data = await res.json()

    if (data.success && data.avatar) {
      preview.value = data.avatar
    }

  } catch (err) {
    console.error(err)
  }

})

/* =========================
UPLOAD AVATAR
========================= */

async function onFileChange(event) {

  const file = event.target.files[0]
  if (!file) return

  // Instant preview
  preview.value = URL.createObjectURL(file)

  loading.value = true

  const formData = new FormData()
  formData.append('avatar', file)

  try {

    const res = await fetch(`${config.public.api_url}/profile/upload-avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await res.json()

    if (data.success) {
      preview.value = data.avatar
      $toast.success('Avatar updated')
    } else {
      $toast.error(data.message)
    }

  } catch (err) {
    console.error(err)
    $toast.error('Upload failed')
  }

  loading.value = false
}
</script>