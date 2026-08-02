<template>
<div class="  top-0 left-0  flex justify-center items-center  fixed  bg-black/35 w-full h-full">
  <div class="rounded-xl h-[80%] overflow-y-auto bg-white border shadow-sm">

    <!-- Header -->
    <div class="border-b p-5 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">
          Verify Bank Account
        </h2>
        <p class="text-sm text-gray-500">
          Review the user's KYC and bank details before approval.
        </p>
      </div>

      <span
        class="px-3 py-1 rounded-full text-xs font-semibold"
        :class="{
          'bg-amber-100 text-amber-700': details?.bank?.status === 'PENDING',
          'bg-green-100 text-green-700': details?.bank?.status === 'VERIFIED',
          'bg-red-100 text-red-700': details?.bank?.status === 'REJECTED'
        }"
      >
        {{ details?.bank?.status }}
      </span>
    </div>

    <div
      v-if="loading"
      class="p-8 text-center"
    >
      Loading...
    </div>

    <div
      v-else-if="details"
      class="p-6 space-y-6"
    >

      <!-- User -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-3">
          User Information
        </h3>

        <div class="grid sm:grid-cols-1 gap-4">

          <div>
            <p class="text-xs text-gray-500">Full Name</p>
            <p class="font-medium">
              {{ details.user.firstName }}
              {{ details.user.lastName }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Email</p>
            <p>{{ details.user.email }}</p>
          </div>

        </div>
      </div>

      <!-- KYC -->
      <div class="border rounded-lg p-4">

        <h3 class="font-semibold mb-3">
          KYC Details
        </h3>

        <div class="grid sm:grid-cols-1 gap-4">

          <div>
            <p class="text-xs text-gray-500">NIN Name</p>
            <p class="font-medium">
              {{ details.kyc.fullName }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500">NIN Number</p>
            <p>{{ details.kyc.nin }}</p>
          </div>

        </div>

      </div>

      <!-- Bank -->
      <div class="border rounded-lg p-4">

        <h3 class="font-semibold mb-3">
          Bank Details
        </h3>

        <div class="grid sm:grid-cols-2 gap-4">

          <div>
            <p class="text-xs text-gray-500">Bank</p>
            <p>{{ details.bank.bankName }}</p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Account Number</p>
            <p>{{ details.bank.accountNumber }}</p>
          </div>

          <div class="sm:col-span-2">
            <p class="text-xs text-gray-500">Account Name</p>
            <p class="font-semibold">
              {{ details.bank.accountName }}
            </p>
          </div>

        </div>

      </div>

      <!-- Compare -->
      <div
        class="rounded-lg border p-4"
        :class="nameMatched
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'"
      >

        <div class="flex items-center gap-2">

          <Icon
            :name="nameMatched
              ? 'lucide:badge-check'
              : 'lucide:circle-alert'"
            class="h-5 w-5"
          />

          <span class="font-semibold">

            {{
              nameMatched
                ? 'Names Match'
                : 'Names Do Not Match'
            }}

          </span>

        </div>

      </div>

      <!-- Reject Note -->

      <div v-if="details.bank.status !== 'VERIFIED'">

        <label class="font-medium">
          Admin Note
        </label>

        <textarea
          v-model="note"
          rows="4"
          placeholder="Reason for rejection (required only if rejecting)"
          class="mt-2 w-full rounded-lg border p-3"
        />

      </div>

      <!-- Actions -->

      <div
        v-if="details.bank.status === 'PENDING'"
        class="flex justify-end gap-4"
      >

        <button
          @click="rejectBank"
          class="rounded-lg bg-red-600 px-6 py-3 text-white"
        >
          Reject
        </button>

        <button
          @click="approveBank"
          class="rounded-lg bg-green-600 px-6 py-3 text-white"
        >
          Approve
        </button>

      </div>

    </div>

  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
const { $toast } = useNuxtApp()
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(["updated"])

const loading = ref(false)

const note = ref("")

const details = ref(null)

const nameMatched = computed(() => {

  if (!details.value) return false

  return (
    details.value.kyc.fullName
      ?.trim()
      .toLowerCase() ===
    details.value.bank.accountName
      ?.trim()
      .toLowerCase()
  )

})

const loadDetails = async () => {

  loading.value = true

  try {

    const res = await useApiFetch(
      `/payout/bank-account/${props.userId}`
    )
    console.log(res.data.data);
    
    details.value = res.data.data

  } finally {

    loading.value = false

  }

}

const approveBank = async () => {
   console.log(details.value.bank._id, 'details.value.bank._id');
   console.log(details.value, 'details.value');
  const res =  await useApiFetch(
    `/payout/bank-account/${details.value.bank._id}/status`,
    {
      method: "PATCH",
      body: {
            status: "ACTIVE",
            reason: note.value,
        },
    }
  )
    $toast.success(res.data.message)
  emit("updated")

  loadDetails()

}

const rejectBank = async () => {

  if (!note.value.trim()) {
    return alert("Enter rejection reason.")
  }

 const res =  await useApiFetch(
    `/payout/bank-account/${details.value.bank._id}/status`,
    {
      method: "PATCH",
       
      body: {
        reason: note.value,
         status: "REJECTED",
      }
    }
  )
   $toast.success(res.data.message)
  emit("updated")

  loadDetails()

}

onMounted(loadDetails)
</script>