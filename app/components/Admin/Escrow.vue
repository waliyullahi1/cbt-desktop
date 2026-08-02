<template>
<div class=" w-full bg-black/30 flex justify-center items-center  top-0 left-0 h-full fixed  ">
  <div class="bg-white max-w-4xl h-[80%] overflow-auto  rounded-2xl max border shadow-sm o">

    <!-- Header -->
    <div class="p-6 border-b">

      <div class="flex items-center gap-3">

        <div
          class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center"
        >
          <Icon
            name="heroicons:shield-check"
            class="w-7 h-7 text-green-600"
          />
        </div>

        <div>

          <h2 class="font-bold text-xl">
            Escrow Release Under Review
          </h2>

          <p class="text-gray-500 mt-1">
            Buyer has requested that the escrow funds be released.
          </p>

        </div>

      </div>

    </div>

    <!-- Notice -->
    <div
      class="bg-amber-50 border-b border-amber-200 p-6"
    >

      <div class="flex gap-3">

        <Icon
          name="heroicons:information-circle"
          class="w-6 h-6 text-amber-600 mt-1"
        />

        <div>

          <h3 class="font-semibold text-amber-900">
            Review Required
          </h3>
      
          <p class="text-sm text-amber-800 mt-2 leading-7">

            The buyer has submitted a request to release the escrow funds.

            Before releasing payment, please review:

            • Property inspection evidence

            • Payment history

            • Buyer & Seller information

            • Any disputes or complaints

            Funds should only be released after both parties have been verified.

          </p>

        </div>

      </div>

    </div>

    <!-- STEP 1 -->
    <div
      v-if="!processing"
      class="p-6"
    >

      <button
        @click="processing = true"
        class="w-full h-14 rounded-xl bg-primary text-white font-semibold"
      >
        Start Review
      </button>

    </div>

    <!-- STEP 2 -->
    <div
      v-else 
      class="space-y-8 p-6"
    >

      <!-- Buyer -->

      <div class="border rounded-xl p-5">

        <h3 class="font-bold mb-5">
          Buyer Information
        </h3>

        <div class="flex gap-4">

          <img
            :src="order?.buyer?.avatar  || defaultAvatar"
            class="w-20 h-20 rounded-full object-cover"
          >

          <div>

            <p class="font-semibold">
              {{ order?.buyer?.firstName }} {{ order?.buyer?.lastName }}
            </p>

            <p>{{ order?.buyer?.email }}</p>

            <p>{{ order?.buyer?.phone ||   order?.buyer?.whatsapp_no  || 'UNKNOWN' }}</p>

            <p>{{ order?.buyer?.location?.address }}, {{ order?.buyer?.location?.city }}, {{ order?.buyer?.location?.state }}</p>

          </div>

        </div>

      </div>
   
      <!-- Seller -->

      <div class="border rounded-xl p-5">

        <h3 class="font-bold mb-5">
          Seller Information
        </h3>

        <div class="flex gap-4">

          <img
            :src="order?.seller?.avatar  ||  defaultAvatar "
            class="w-20 h-20 rounded-full object-cover"
          >

          <div>

            <p class="font-semibold">
              {{ order?.seller?.firstName }} {{ order?.seller?.lastName }}
            </p>

            <p>{{ order?.seller?.email }}</p>

            <p>{{ order?.seller?.phone || order?.seller?.whatsapp_no || "UNKNOWN" }}</p>

           <p>{{ order?.seller?.location?.address }}, {{ order?.seller?.location?.city }}, {{ order?.seller?.location?.state }}</p>

          </div>

        </div>

      </div>

      <!-- Property -->

      <!-- <div class="border rounded-xl p-5">

        <h3 class="font-bold mb-4">
          Property
        </h3>

        <img
          :src="order.property.media.images[0].url"
          class="rounded-xl h-56 object-cover w-full"
        >

        <div class="mt-4">

          <p class="font-semibold text-lg">
            {{ order.property.title }}
          </p>

          <p class="text-gray-500 mt-2">
            {{ order.property.location.address }}
          </p>

        </div>

      </div> -->

      <!-- Payment -->

      <!-- <div class="border rounded-xl p-5">

        <h3 class="font-bold mb-4">
          Payment Summary
        </h3>

        <div class="space-y-2">

          <div class="flex justify-between">

            <span>Total Price</span>

            <strong>
              ₦{{ formatNaira(order.totalAmount) }}
            </strong>

          </div>

          <div class="flex justify-between">

            <span>Escrow Held</span>

            <strong>
              ₦{{ formatNaira(order.escrowAmount) }}
            </strong>

          </div>

          <div class="flex justify-between">

            <span>Paid</span>

            <strong>
              ₦{{ formatNaira(order.amountPaid) }}
            </strong>

          </div>

        </div>

      </div> -->

      <!-- Inspection -->

      <div class="border rounded-xl p-5">

        <h3 class="font-bold mb-4">
          Inspection Evidence
        </h3>

        <div
          class="grid grid-cols-3 gap-4"
        >

    
          <img
            v-for="img in order.inspectionEvidence"
            :key="img._id"
            :src="img.url"
            class="rounded-xl h-32 object-cover"
          >

        </div>

      </div> 

      <!-- Footer -->

       <div class="grid md:grid-cols-2 gap-4 mt-8">

      <button
        :disabled="loading ||  releasing"
        @click="realeaseFund"
        class="h-14 rounded-lg bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2"
      >

        <svg
          v-if="releasing"
          class="w-5 h-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        <span>
          {{ releasing ? "Loading..." : "Release Money" }}
        </span>

      </button>

      <button
       :disabled="loading || cancell"
        @click="$emit('cance')"
        class="h-14 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition"
      >
        <Icon
          name="heroicons:arrow-uturn-left"
          class="w-5 h-5 inline mr-2"
        />
        Request Refund
      </button>

    </div>


    </div>

  </div>
</div>
</template>

<script setup>
const defaultAvatar = '/image/icon/avatar.svg'
import { useRouter, useRoute, useRuntimeConfig } from '#app'

const { $toast } = useNuxtApp()
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  "close",
  "release",
  "reject"
])

const processing = ref(false)
const loading = ref(false)
const releasing = ref(false)
const cancell = ref(false)
const updateStatus = async (action) =>{
  try {
     const data  = await useApiFetch(
      `/order/status/${props.order._id}/${action}`,
      {
        method: "POST",
        
      }
    )
   if(!data.success){
    console.log(data);
    
    $toast.error(data?.message || "Something went wrong.")
    releasing.value = false
    loading.value = false
    return
   }
      $toast.success(message || "Money released successfully.")
    return data
  } catch (err) {
    console.log("Error object:", err)
  console.log("Status:", err.status)
  console.log("Backend response:", err.data)

  $toast.error(err.data?.message || "Something went wrong.")
     releasing.value = false
  }
  

   
    
}


const realeaseFund = async () =>{
  releasing.value = true
    loading.value = true
    await updateStatus('approveRelease')
      // window.location.reload();
      releasing.value = false
    loading.value = false
}
const formatNaira = (value) =>
  Number(value || 0).toLocaleString("en-NG")
</script>