<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const current = ref(0)

const images = computed(() => props.data?.images || [])

const next = () => {
  if (current.value < images.value.length - 1) {
    current.value++
  }
}

const prev = () => {
  if (current.value > 0) {
    current.value--
  }
}

const setImage = (i) => {
  current.value = i
}
</script>

<template>
    <div>
  
  <div class="rounded-sm overflow-hidden bg-white mx-2  relative">

          <!-- PRICE -->
          <div class="absolute top-2 left-2 z-10">
            <UiTypographyP class="bg-red-600/70   px-3 py-1 text-white text-xs rounded">
            {{ data.price }}
            </UiTypographyP>
          </div>

          <!-- IMAGE -->
          <div
            class="bg-no-repeat bg-center bg-cover h-48 flex justify-center items-center"
            :style="{ backgroundImage: `url(${data.images[current]})` }"
          >
                <button
            v-if="data.images.length > 1"
            @click="prev"
            class="absolute left-3 mt-10  h-7 w-7 -translate-y-1/2 bg-white/80  rounded-full shadow"
        >
            ‹
        </button>

        <button
            v-if="data.images.length > 1"
            @click="next"
            class="absolute right-3 mt-10  -translate-y-1/2 bg-white/80 h-7 w-7 rounded-full shadow"
        >
            ›
        </button>
        </div>

          <!-- CONTENT -->
          <div class="px-2 py-2 mt-3">

            <!-- AGENT + TYPE -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <div class="bg-black rounded-full overflow-hidden">
                  <img
                    src="@/assets/images/professionor.jpg"
                    class="w-7 h-7 object-cover"
                    alt=""
                  />
                </div>

                <div>
                  <p class="text-[12px] font-semibold text-secondary leading-tight">
                    {{ data.name }}
                    <br />
                    <small class="text-black text-[11px]">
                      {{ data.role }}
                    </small>
                  </p>
                </div>
              </div>

              <span class="bg-secondary text-white rounded-lg px-2 py-1 text-xs">
                {{ data.type }}
              </span>
            </div>

            <!-- TITLE -->
            <UiTypographyH3 class="text-sm mt-3">
              {{ data.title }}
            </UiTypographyH3>

            <!-- DESCRIPTION -->
            <UiTypographyP class="mt-2 text-[12px] text-gray-600 line-clamp-3">
               
               {{ data.description?.slice(0,80) }}..

            </UiTypographyP>

            <!-- FEATURES -->
            <div class="mt-3 flex gap-3 text-[11px] text-gray-700">

              <div v-if="data?.features?.bedrooms" class="flex gap-1 items-center">
                <img src="/image/icon/bed.svg" class="w-4" />
                <span>{{data.features.bedrooms}} Beds</span>
              </div>

              <div v-if="data?.features?.bathrooms" class="flex gap-1 items-center">
                <img src="/image/icon/bath.svg" class="w-4" />
                <span>{{ data.features.bathrooms }} Baths</span>
              </div>

              <div v-if="data?.features?.area" class="flex gap-1 items-center">
                <img src="/image/icon/location.svg" class="w-4" />
                <span>{{ data.features.area }}</span>
              </div>
            </div>

            <!-- DATE -->
            <span class="text-slate-500 text-[11px] block mt-2">
              Updated {{ data.updatedAt }}
            </span>
          </div>
        </div>
    </div>
</template>
