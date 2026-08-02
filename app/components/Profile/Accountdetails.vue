<template>

  <!-- Overlay -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >

    <div
      v-if="show"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="closeModal"
    />

  </Transition>

  <!-- Modal -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-8 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-8 scale-95"
  >

    <div
      v-if="show"
      class="fixed left-1/2 top-1/2 z-50 w-[95%] overflow-y-auto h-[95%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white shadow-[0_40px_80px_rgba(0,0,0,.18)]"
    >

      <!-- Header -->
      <div class="relative border-b-2 bg-gradient-to-r f px-2 sm:px-8 py-4 te">

        <button
          @click="closeModal"
          class="absolute right-6 top-6 flex  items-center justify-center rounded-xl bg-white/20 transition hover:bg-white/30"
        >
          <Icon
            name="lucide:x"
            class="h-8 w-8"
          />
        </button>

        <div class="flex items-center gap-4">

          

          <div>

            <div class="text-xl flex items-center gap-2  font-bold">
               
                <Icon
                name="lucide:landmark"
                class="sm:h-5 sm:w-5 w-3 h-3"
              />
             
            
              Add Bank Account
            </div>

            <p class=" text-sm  text-gray-700">
              Add a verified bank account for withdrawals.
            </p>

          </div>

          
        </div>

      </div>
       <!-- Header -->
       <div class=" bg-amber-200   text-[13px] textm px-4 py-1 text-justify roundd w-full ">
       <span class=" font-semibold">Important:</span> The bank account you add must belong to you and must match the name used during your NIN identity verification (KYC). We cannot release funds to bank accounts that do not match your verified identity.
       </div>
        
        <div
          
            class="mx-3 mt-4 rounded-xl border p-4"
            :class="{
              'border-amber-200 bg-amber-50': bankAccount?.status === 'PENDING',
              'border-green-200 bg-green-50': bankAccount?.status === 'VERIFIED',
              'border-red-200 bg-red-50': bankAccount?.status === 'REJECTED'
            }"
          >

            
            <div class="flex items-start justify-between">

              <div>

                <p class="font-semibold text-gray-900">
                  Bank Account Status
                </p>

                <p class="mt-1 text-sm text-gray-600">
                  {{ bankAccount?.bankName }}
                </p>

                <p class="text-sm text-gray-600">
                  {{ bankAccount?.accountName }}
                </p>

                <p class="text-sm text-gray-500">
                  ****{{ bankAccount?.accountNumber.slice(-4) }}
                </p>

              </div>

              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="{
                  'bg-amber-100 text-amber-700': bankAccount?.status === 'PENDING',
                  'bg-green-100 text-green-700': bankAccount?.status === 'VERIFIED',
                  'bg-red-100 text-red-700': bankAccount?.status === 'REJECTED'
                }"
              >
                {{ bankAccount?.status }}
              </span>

            </div>

            <!-- Pending -->
            <div
              v-if="bankAccount?.status === 'PENDING'"
              
              class="mt-4 flex items-start gap-2 text-sm text-amber-700"
            >
              <Icon name="lucide:clock-3" class="mt-0.5 h-5 w-5" />

              <p>
                Your bank account has been submitted and is awaiting admin verification.
                Withdrawals will be enabled after approval.
              </p>
            </div>

            <!-- Verified -->
            <div
              v-else-if="bankAccount?.status === 'VERIFIED'"
              class="mt-4 flex items-start gap-2 text-sm text-green-700"
            >
              <Icon name="lucide:badge-check" class="mt-0.5 h-5 w-5" />

              <p>
                Your bank account has been verified. You can now receive withdrawals.
              </p>
            </div>
       
            <!-- Rejected -->
            <div
              v-else-if="bankAccount?.status === 'REJECTED'"
              class="mt-4 flex items-start gap-2 text-sm text-red-700"
            >
              <Icon name="lucide:circle-alert" class="mt-0.5 h-5 w-5" />

              <div>
                <p>
                  Your bank account was rejected.
                </p>
                 {{bankAccount.rejectionReason}}
                <p
                  v-if="bankAccount.rejectionReason"
                  class="mt-1 text-xs"
                >
                  Reason: {{ bankAccount?.rejectionReason }}
                </p>
              </div>

            </div>

          </div>







      <!-- Body -->
     
      <div      class="space-y-7 p-3 sm:p-8">
       {{bankAccount?.status}}
        <!-- Bank -->
        <div>

          <label class="mb-2 block text-sm font-semibold text-gray-700">

            Bank

          </label>

          <div class="relative">

            <button
              @click="bankDropdown = !bankDropdown"
              class="flex w-full items-center justify-between text-sm rounded-md border border-gray-200 bg-white px-3 py-2 transition hover:border-green-400"
            >

              <div class="flex items-center gap-3">

                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100">

                  <Icon
                    name="lucide:building-2"
                    class="h-4 w-4 text-green-600"
                  />

                </div>

                <div class="text-left">

                  <p
                    v-if="selectedBank"
                    class="font-semibold text-gray-800"
                  >
                    {{ selectedBank.name }}
                  </p>

                  <p
                    v-else
                    class="text-gray-400"
                  >
                    Select Bank
                  </p>

                </div>

              </div>

              <Icon
                name="lucide:chevrons-up-down"
                class="h-5 w-5 text-gray-400"
              />

            </button>

            <!-- Dropdown -->

            <div
              v-if="bankDropdown"
              class="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-md border bg-white shadow-xl"
            >

              <!-- Search -->

              <div class="border-b p-2">

                <div class="relative">

                  <Icon
                    name="lucide:search"
                    class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    v-model="search"
                    type="text" 
                    placeholder="Search bank..."
                    class="w-full text-sm rounded-md border bg-gray-50 py-3 pl-12 pr-4 outline-none focus:border-green-500"
                  >

                </div>

              </div>

              <!-- Bank List -->

              <div class="max-h-64 overflow-y-auto">

                <button
                  v-for="bank in filteredBanks"
                  :key="bank.code"
                  @click="selectBank(bank)"
                  class="flex w-full items-center justify-between border-b text-sm px-5 py-2 text-left transition hover:bg-green-50"
                >

                  <div>

                    <p class="font-medium  text-gray-800">

                      {{ bank.name }} <span class="text-xs text-gray-400"> {{ bank.code }}</span>

                    </p>

                    

                  </div>

                  <Icon
                    v-if="selectedBank?.code===bank.code"
                    name="lucide:check"
                    class="h-5 w-5 text-green-600"
                  />

                </button>

              </div>

            </div>

          </div>

        </div>

        <!-- Account Number -->

        <div>

          <label class="mb-2 block text-sm font-semibold text-gray-700">

            Account Number

          </label>

          <div class="relative">

            <input
              v-model="accountNumber"
              maxlength="10"
              placeholder="Enter 10-digit account number"
              class="w-full  text-sm border rounded-md border-gray-200 px-3 py-3 pr-14 outline-none transition focus:border-green-500"
            >

            <div
              class="absolute right-4 top-1/2 -translate-y-1/2"
            >

              <Icon
                v-if="loading"
                name="svg-spinners:90-ring"
                class="h-6 w-6 text-green-600"
              />

              <Icon
                v-else-if="verified"
                name="lucide:badge-check"
                class="h-6 w-6 text-green-600"
              />

            </div>

          </div>

          <p class="mt-2 text-xs text-gray-500">

            Enter the account number exactly as registered.

          </p>

        </div>

        <!-- Account Name -->

        <div>

          <label class="mb-2 block text-sm font-semibold text-gray-700">

            Account Name

          </label>

          <div
            class="flex min-h-[40px] items-center rounded-md text-sm border bg-gray-50 px-5"
          >

            <template v-if="loading">

              <div class="flex items-center gap-3">

                <Icon
                  name="svg-spinners:90-ring"
                  class="h-5 w-5 text-green-600"
                />

                <span class="text-gray-500">

                  Verifying account...

                </span>

              </div>

            </template>

            <template v-else-if="verified || bankAccount">

              <div class="flex w-full items-center justify-between">

                <div>

                  <p class="font-semibold text-gray-800">

                    {{accountName || bankAccount?.accountName }}

                  </p>

                  <p class="mt-1 text-xs text-green-600">

                    Verified account

                  </p>

                </div>

                <Icon
                  name="lucide:badge-check"
                  class="h-7 w-7 text-green-600"
                />

              </div>

            </template>

            <template v-else>

              <span class="text-gray-400">

                Account name will appear automatically

              </span>

            </template>

          </div>

        </div>

        <!-- Error -->

        <div
          v-if="!bankAccount?.accountName  && error"
          class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
        >

          <div class="flex items-start gap-3">

            <Icon
              name="lucide:circle-alert"
              class="mt-0.5 h-5 w-5 text-red-500"
            />

            <div>

              <p class="font-medium text-red-700">

                Verification Failed

              </p>

              <p class="mt-1 text-sm text-red-600">

                {{ error }}

              </p>

            </div>

          </div>

        </div>

        <!-- Success -->

        <div
          v-if=" verified"
          class="rounded-2xl border border-green-200 bg-green-50 px-5 py-4"
        >

          <div class="flex items-start gap-3">

            <Icon
              name="lucide:circle-check-big"
              class="mt-0.5 h-5 w-5 text-green-600"
            />

            <div>

              <p class="font-semibold text-green-700">

                Account Verified

              </p>

              <p class="mt-1 text-sm text-green-600">

                This bank account is ready to receive withdrawals.

              </p>

            </div>

          </div>

        </div>

      </div>

      <!-- Footer -->

      <div class="flex flex-col-reverse gap-3 border-t bg-gray-50 p-6 sm:flex-row sm:justify-end">

        <button
          @click="closeModal"
          class="rounded-2xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
        >

          Cancel

        </button>
      
        <button
          :disabled=" !bankAccount?.accountName  && !verified || saving   "
          @click="saveBankAccount"
          class="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Icon
            v-if="saving"
            name="svg-spinners:90-ring"
            class="h-5 w-5"
          />

          <Icon
            v-else
            name="lucide:save"
            class="h-5 w-5"
          />

          <span>

            {{ saving ? 'Saving...' : 'Save Bank Account' }}

          </span>

        </button>

      </div>

    </div>

  </Transition>

</template>

<script setup>
import { ref, computed, watch } from "vue"

const emit = defineEmits(["close", "saved"])

/* ===========================================
STATE
=========================================== */

const show = ref(true)

const saving = ref(false)

const loading = ref(false)

const verified = ref(false)

const error = ref("")

const search = ref("")

const bankDropdown = ref(false)

const selectedBank = ref(null)

const accountNumber = ref("")
const bankAccount = ref(null)
const accountName = ref("")

/* ===========================================
BANK LIST
(Replace with API later)
=========================================== */

const banks = ref([
  {
    name: "Access Bank",
    code: "044"
  },
  {
    name: "Citibank",
    code: "023"
  },
  {
    name: "Ecobank",
    code: "050"
  },
  {
    name: "Fidelity Bank",
    code: "070"
  },
  {
    name: "First Bank",
    code: "011"
  },
  {
    name: "FCMB",
    code: "214"
  },
  {
    name: "GTBank",
    code: "058"
  },
  {
    name: "Keystone Bank",
    code: "082"
  },
  {
    name: "Moniepoint",
    code: "50515"
  },
  {
    name: "Opay",
    code: "999991"
  },
  {
    name: "PalmPay",
    code: "999992"
  },
  {
    name: "Polaris Bank",
    code: "076"
  },
  {
    name: "Providus Bank",
    code: "101"
  },
  {
    name: "Stanbic IBTC",
    code: "221"
  },
  {
    name: "Sterling Bank",
    code: "232"
  },
  {
    name: "UBA",
    code: "033"
  },
  {
    name: "Union Bank",
    code: "032"
  },
  {
    name: "Unity Bank",
    code: "215"
  },
  {
    name: "Wema Bank",
    code: "035"
  },
  {
    name: "Zenith Bank",
    code: "057"
  }
])

const loadbanks = async () => {

  try {

    loading.value = true
    error.value = null

    const response = await useApiFetch('/payout/banks', {
      method: 'GET'
    })
    console.log(response);
    
    banks.value = response?.data?.banks || response?.data || {}

   

    if (!response?.success) {
      error.value =  'Failed to load profile'
      throw createError({
        statusCode: 500,
        statusMessage: response?.message || 'Failed to fetch properties',
         
      })
    }
  } catch (err) {

    console.error('Load Profile Error:', err)

    error.value ='Failed to load profile'

  } finally {

    loading.value = false

  }

}
/* ===========================================
FILTER BANKS
=========================================== */
const loadBankAccount = async () => {
  try {
    const res = await useApiFetch("/payout/bank-details", {
      method: "GET",
    })
  console.log(res.data.data);
  
    if (res.success && res.data.data) {
      bankAccount.value = res.data.data

      selectedBank.value = {
        name: res.data.data.bankName,
        code: res.data.data.bankCode,

      }

      accountNumber.value = res.data.data.accountNumber
      accountName.value = res.data.data.accountName
      accountName
      verified.value = true
    }

  } catch (err) {
    console.log(err)
  }
}
loadBankAccount()
onMounted(() => {
  loadbanks()
 
})
const filteredBanks = computed(() => {

  if (!search.value) {
    return banks.value
  }

  return banks.value.filter(bank =>
    bank.name.toLowerCase().includes(search.value.toLowerCase())
  )

})

/* ===========================================
SELECT BANK
=========================================== */

const selectBank = bank => {

  selectedBank.value = bank

  bankDropdown.value = false

  search.value = ""

  verified.value = false

  accountName.value = ""

  error.value = ""

}




/* ===========================================
VERIFY ACCOUNT
=========================================== */

watch(accountNumber, async value => {

  verified.value = false

  accountName.value = ""

  error.value = ""

  if (!selectedBank.value) {
    return
  }

  if (value.length !== 10) {
    return
  }

  loading.value = true

  try {

    
    // ======================================
    // Replace this section with your backend
    // ======================================

    const res = await useApiFetch("/payout/banks/verify", {
      method: "POST",
      body: {
        bankCode: selectedBank.value.code,
        accountNumber: value
      }
    })

    if (!res.success) {
    
      throw new Error(res.message)
       verified.value = false
    }
    console.log(res);
    
    accountName.value = res.data.account_name


    // Demo only
    await new Promise(resolve => setTimeout(resolve, 1500))
        accountName.value = res.data.account.account_name  || "UNKNOWN"
   

    verified.value = true

  }
  catch (err) {
    
    error.value = err.message || "Unable to verify account."

    verified.value = false
    if ( accountName.value) {
       
    }

  }
  finally {

    loading.value = false

  }

})

/* ===========================================
SAVE ACCOUNT
=========================================== */

const saveBankAccount = async () => {

  if (!verified.value && !bankAccount.value ) return

  saving.value = true

  try {

  
    // ======================================
    // Save to backend
    // ======================================
  console.log(accountName.value,'accountName.value');
  
    await useApiFetch("/payout/save-bank-account",{
      method:"POST",
      body:{
        bankName:selectedBank.value.name,
        bankCode:selectedBank.value.code,
        accountNumber:accountNumber.value,
        accountName:accountName.value || bankAccount.value.accountName
      }
    })


    await new Promise(resolve => setTimeout(resolve, 1200))

    emit("saved", {
      bankName: selectedBank.value.name,
      bankCode: selectedBank.value.code,
      accountNumber: accountNumber.value,
      accountName: accountName.value
    })

    show.value = false

    emit("close")

  }
  catch (err) {

    error.value = err.message || "Unable to save account."

  }
  finally {

    saving.value = false

  }

}

/* ===========================================
CLOSE
=========================================== */

const closeModal = () => {

  show.value = false

  emit("close")

}
</script>