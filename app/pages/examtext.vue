<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue"
import { getCurrentWindow } from "@tauri-apps/api/window"

const appWindow = getCurrentWindow()
const appState = useAppState()

// SUBJECTS
const activeSubject = ref(
  appState.selectedSubjects?.[0]?.id || null
)

const selectSubject = (subject) => {
  activeSubject.value = subject.id
}

// QUESTIONS
const totalQuestions = 40

const currentQuestion = ref(11)

const answeredQuestions = ref([1, 4, 11, 14])

const questions = computed(() =>
  Array.from({ length: totalQuestions }, (_, i) => i + 1)
)

const goToQuestion = (questionNumber) => {
  currentQuestion.value = questionNumber
}

// DEMO QUESTION
const question = ref({
  text: "The most common mode of transportation in Nigeria is?",
  options: [
    { id: "A", text: "Ocean" },
    { id: "B", text: "Road" },
    { id: "C", text: "Rail" },
    { id: "D", text: "Air" }
  ]
})

const selectedAnswer = ref("B")

const selectAnswer = (option) => {
  selectedAnswer.value = option
}

const leave = async () => {
  await navigateTo("/")
}

onMounted(async () => {
  // await appWindow.setDecorations(false)
  // await appWindow.setResizable(false)
  // await appWindow.setFullscreen(true)
})

onBeforeUnmount(async () => {
  // await appWindow.setFullscreen(false)
  // await appWindow.setDecorations(true)
})
</script>

<template>
  <div class="h-dvh flex flex-col bg-white overflow-hidden">

    <!-- TOP BAR -->
    <NavigationExamNavBar />

    <!-- SUBJECT TABS -->
    <div
      class="flex items-end h-16 px-14 border-b-2 border-b-primary overflow-hidden"
    >
      <button
        v-for="subject in appState.selectedSubjects"
        :key="subject.id"
        @click="selectSubject(subject)"
        :class="[
          'pt-3 pb-1 px-8 flex items-end text-sm font-bold',
          activeSubject === subject.id
            ? 'exam-tab text-white'
            : 'text-primary'
        ]"
      >
        {{ subject.name }}
      </button>
    </div>

    <!-- MAIN -->
    <main class="flex flex-1 overflow-hidden">

      <!-- LEFT PANEL -->
      <section
        class="w-[420px] border-r border-slate-200 p-4 overflow-y-auto"
      >
        <div class="flex justify-between mb-6">
          <h3 class="font-bold text-xl">
            Attempt:
            {{ answeredQuestions.length }}/{{ totalQuestions }}
          </h3>

          <h3 class="font-bold text-xl">
            Question:
            {{ currentQuestion }}/{{ totalQuestions }}
          </h3>
        </div>

        <div class="grid grid-cols-5 gap-3">
          <button
            v-for="questionNumber in questions"
            :key="questionNumber"
            @click="goToQuestion(questionNumber)"
            :class="[
              'h-16 rounded-xl font-bold text-lg transition-all',

              currentQuestion === questionNumber
                ? 'border-4 border-blue-500 bg-blue-100 text-blue-700'

                : answeredQuestions.includes(questionNumber)
                  ? 'bg-blue-100 text-slate-800'

                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            ]"
          >
            {{ questionNumber }}
          </button>
        </div>
      </section>

      <!-- RIGHT PANEL -->
      <section class="flex-1 p-10 overflow-y-auto">

        <div class="max-w-3xl mx-auto">

          <h2 class="text-3xl font-bold mb-10">
            {{ question.text }}
          </h2>

          <div class="space-y-8">

            <label
              v-for="option in question.options"
              :key="option.id"
              class="flex items-center gap-6 cursor-pointer"
            >
              <span class="text-4xl font-bold w-12">
                {{ option.id }}
              </span>

              <input
                type="radio"
                name="answer"
                :value="option.id"
                v-model="selectedAnswer"
                class="w-7 h-7"
              />

              <span class="text-2xl">
                {{ option.text }}
              </span>
            </label>

          </div>

          <div class="mt-12 flex gap-4">
            <button
              class="px-8 py-3 rounded-lg bg-primary text-white font-bold"
            >
              Previous
            </button>

            <button
              class="px-8 py-3 rounded-lg bg-primary text-white font-bold"
            >
              Next
            </button>

            <button
              @click="leave"
              class="px-8 py-3 rounded-lg bg-red-500 text-white font-bold"
            >
              End Exam
            </button>
          </div>

        </div>

      </section>

    </main>
  </div>
</template>

<style scoped>
.exam-tab {
  background-image: url("~/assets/images/icons/tab1.svg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  border: none;
  min-width: 180px;
  height: 56px;
}
</style>