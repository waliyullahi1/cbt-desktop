<template>
  <div class="mt-12 p-5 rounded-xl border border-gray-300">

    <div class="w-full">

      <!-- HEADER -->
      <h3 class="font-semibold text-xl">Company Details</h3>
      <p class="text-sm text-gray-600">
        Add your shop/company name and choose your location so users can find you.
      </p>

      <!-- OPEN FORM BUTTON -->
      <button
        v-if="!showForm"
        @click="showForm = true"
        class="mt-5 border rounded-lg text-sm px-4 py-2"
      >
        + Add Company
      </button>

      <!-- FORM -->
      <div v-if="showForm" class="mt-5 bg-white border rounded-xl p-6 space-y-4">

        <h4 class="font-semibold">Add Company Details</h4>

        <!-- COMPANY NAME -->
        <input
          v-model="form.shopName"
          placeholder="Shop / Company name"
          class="border w-full p-2 rounded"
        />

        <!-- DESCRIPTION -->
        <input
          v-model="form.description"
          placeholder="Describe your service"
          class="border w-full p-2 rounded"
        />

        <!-- TOGGLE -->
        <p class="text-sm">Choose location method</p>

        <div class="flex bg-gray-100 rounded overflow-hidden">
          <div
            class="flex-1 text-center p-2 cursor-pointer"
            :class="activeSection === 'map' ? 'bg-black text-white' : ''"
            @click="activeSection = 'map'"
          >
            Map
          </div>

          <div
            class="flex-1 text-center p-2 cursor-pointer"
            :class="activeSection === 'manual' ? 'bg-black text-white' : ''"
            @click="activeSection = 'manual'"
          >
            Manual
          </div>
        </div>

        <!-- MAP SECTION -->
        <client-only>
          <div v-if="activeSection === 'map'" id="map" class="h-64 rounded"></div>
        </client-only>

        <!-- MANUAL INPUT -->
        <div v-if="activeSection === 'manual'" class="space-y-2">
          <ListStateLGASelector
            v-model="form"
            label="Latitude"
            placeholder="e.g. 6.5244"/>
        </div>
        {{form}}

        <!-- SHOW VALUES -->
        <p class="text-xs text-gray-500">
          Lat: {{ form.latitude }} | Lng: {{ form.longitude }}
        </p>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-2">
          <button @click="showForm = false" class="px-3 py-1 border rounded">
            Cancel
          </button>

          <button @click="saveCompany" class="px-3 py-1 bg-black text-white rounded">
            Save
          </button>
        </div>

      </div>

      <!-- LIST -->
      <!-- <div class="mt-6 space-y-3">

        <div
          v-for="(item, i) in modelValue"
          :key="i"
          class="border rounded p-3"
        >
          <h4 class="font-medium">{{ item.shopName }}</h4>
          <p class="text-sm text-gray-500">{{ item.description }}</p>
          <p class="text-xs text-gray-400">
            {{ item.latitude }}, {{ item.longitude }}
          </p>
        </div>

      </div> -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/* PROPS */
const props = defineProps({
modelValue: {
  type: Object,
  default: () => ({
    shopName: '',
    description: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null
  })
}
})

const emit = defineEmits(['update:modelValue'])

/* STATE */
const showForm = ref(false)
const activeSection = ref('map')

const form = ref({
  shopName: '',
   description: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null
})

let map = null
let marker = null

/* INIT MAP */
onMounted(async () => {

  const L = (await import('leaflet')).default

  // fix marker icons
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map = L.map('map').setView([6.5244, 3.3792], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

  map.on('click', (e) => {

    const { lat, lng } = e.latlng

    form.value.latitude = lat
    form.value.longitude = lng

    if (marker) map.removeLayer(marker)

    marker = L.marker([lat, lng]).addTo(map)

  })
})

/* SAVE */
const saveCompany = () => {

  if (!form.value.shopName || !form.value.latitude) {
    alert('Fill all required fields')
    return
  }

  const updated = [...props.modelValue, { ...form.value }]
  emit('update:modelValue', updated)

  // reset
  form.value = {
    shopName: '',
    description: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null
  }

  showForm.value = false
}
</script>

<style>
#map {
  width: 100%;
}
</style>