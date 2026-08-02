<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


    <!-- Header -->
    <button
      class="flex w-full items-center justify-between bg-stone-100 px-6 py-3"
      @click="open = !open"
    >
      <div class="flex items-center gap-3">
        <Icon
          :name="open ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          class="text-xl"
        />

        <h2 class="text-lg font-bold">
         Exam Details
        </h2>
      </div>
    </button>

    <Transition name="fade">
      <div
        v-show="open"
        class="grid grid-cols-1 gap-4 p-4 "
      >
       <div class="flex justify-between items-center mb-10">

        <div class="flex gap-2 items-center">

            <div class="bg-green-800 rounded-sm text-white px-4 py-1">
            Format
            </div>

            <select class="border rounded-sm px-2 py-1 w-64">
            <option>Slip</option>
            </select>

            </div>


          <button
                class="bg-blue-600 text-white px-6 py-1 rounded-sm"
            >
                Print
            </button>
        </div>
        <!-- Profile Section -->
            <div class="flex items-center">

      <!-- Profile -->

            <div class="w-1/4">
                <Icon
                name="lucide:user-round"
                class="text-green-600 text-[60px]"
                />
            </div>

            <!-- Title -->

            <div class="flex-1 text-center">
                <h1
                class="font-bold text-[15px]"
                style="font-family: Times New Roman"
                >
                UTME
                </h1>

                <h2
                class="font-bold text-[15px]"
                style="font-family: n"
                >
                Result Slip
                </h2>
            </div>

            <!-- Printed Date -->

            <div
                class="w-1/4 text-right font-bold"
                style="font-family: Tn"
            >
                Date Printed:
             
            </div>
 
        </div>

    <hr class="my-">
        

        <!-- Examination Details -->

    <div
      class="text-[16px]"
      style="font-family: Times New Roman"
    >

      <h2 class="font-bold text-[20px] mb-2">
        Examination Details
      </h2>

      <div class="space-y-">

        <div class="flex">
          <div class="w-40">
            Username:
          </div>

          <div>
            {{ appState.currentsuser }}
          </div>
        </div>

        <div class="flex">
          <div class="w-40">
            Subject(s):
          </div>

          <div>
           {{ examDetails.subjects.map(subject => subject.name).join(", ") }}
          </div>
        </div>

        <div class="flex">
          <div class="w-40">
            Exam Date:
          </div>

          <div>
             {{formatDate(startingDate)}}
          </div>
        </div>

      </div>

    </div>


        <!-- Candidate Result -->

    <div
      class="mt-12"
      style="font-family: Times New Roman"
    >

      <h2 class="font-bold text-[20px] mb-4">
        Candidate Result
      </h2>

      <table class="w-[700px]">

        <thead>

          <tr class="border-b">

            <th class="text-left text-[18px]">
              Subject
            </th>

            <th class="text-left text-[18px]">
              Score
            </th>

            <th class="text-left text-[18px]">
              Time Spent
            </th>

          </tr>

        </thead>

        <tbody>

            
           
          <tr
             v-for="subject  in examDetails.subjects"
            :key="subject.name"
          >
         
            <td class="py-1">
              {{ subject.name }}
            </td>

            <td>
              {{ Math.round(subject.score) }}
            </td>

            <td>
                {{ formatTotalTime(subject.questions)}}
            </td>
          </tr>

        </tbody>

        <tfoot>

          <tr class="border-t">

            <td class="pt-2">
              Aggregate
            </td>

            <td class="pt-2">
              Total:
             {{Math.round(examDetails.aggregate)}}/ {{ Math.round(examDetails.maxAggregate) }}
            </td>

            <td class="pt-2">
              Total: {{ formatTotalTime(examDetails.subjects.flatMap(s => s.questions)) }}             
            </td>

          </tr>

        </tfoot>

      </table>

    </div>


        
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from "vue"
const appState = useAppState()
const open = ref(true)

defineProps({
  title: {
    type: String,
    default: "Summary"
  },
  examDetails: {
    type: Object,
    default: null
  },
  startingDate:{
    type:String,
    default: '2sdfdfsdfs'
  }

})

function formatTotalTime(questions = []) {
  const totalSeconds = questions.reduce(
    (total, q) => total + (q.timeSpent || 0),
    0
  )

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`
  }

  return `${seconds} sec`
}

function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`
  }

  return `${seconds} sec`
}

const formatDate = (dateString) => {
  return new Date(dateString)
    .toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
}

// const totalAggregate = computed(() => {
//   return props.subjects.reduce((total, subject) => {
//     const score = subject.total
//       ? (subject.correct / subject.total) * 100
//       : 0

//     return total + score
//   }, 0)
// })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>