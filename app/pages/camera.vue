<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import { getCurrentWindow } from "@tauri-apps/api/window"

const appWindow = getCurrentWindow()
const appState = useAppState()

const currentSubject = ref({})
const currentQuestion  = ref({})
const activeSubject = ref(
  appState.value.selectedSubjects?.[0]?.id || null
)
const groupedSubjects = ref([])
const selectSubject = (subject) => {
  activeSubject.value = subject.id

  const selectedSubject =
    groupedSubjects.value.find(
      item => item.id === subject.id
    )
  
  currentSubject.value =  selectedSubject ?? null
    currentQuestion.value =  currentSubject.value.questions[ currentSubject.value.currentQuestion] 
    
}
const goToQuestion = (index) => {
  try {
     console.log(
    "AFTER NAVIGATION",
    JSON.stringify(appState.value.selectedSubjects)
  )
    currentQuestion.value = currentSubject.value.questions[index]
    console.log(currentSubject.value);
   currentSubject.value.currentQuestion= index + 1
   
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (!appState.value.selectedSubjects?.length) return
     console.log(
    "AFTER NAVIGATION",
    JSON.stringify(appState.value.selectedSubjects)
  )
  activeSubject.value =
    appState.value.selectedSubjects[0].id

  let globalIndex = 1

    groupedSubjects.value = appState.value.selectedSubjects.map(subject => {

      const subjectQuestions =   appState.value.examQuestions.filter(q => q.subject === subject.id).map(question => ({
            ...question,
            index: globalIndex++,
            answered: false
          }))

      return {
        ...subject,
        currentQuestion: subjectQuestions.length
            ? subjectQuestions[0].index
            : null,
        answered: 0,
        questions: subjectQuestions
      }
    })

    currentSubject.value = groupedSubjects.value[0] 
    currentQuestion.value = currentSubject.value.questions[0]
    console.log( groupedSubjects.value);
    
})


  

 
  
//   await appWindow.setDecorations(false)
//   await appWindow.setResizable(false)
//   await appWindow.setFullscreen(true)
//   await appWindow.setAlwaysOnTop(true)

const leave = async ()=> {
     await navigateTo('/')
}
onBeforeUnmount(async () => {
 
//   await appWindow.setFullscreen(false)
//   await appWindow.setDecorations(true)
//   await appWindow.setResizable(true)
//   await appWindow.setAlwaysOnTop(false)
})






</script>

<template>
  <div class="min-h-screen w-screen bg-white">

    <NavigationExamNavBar />

    <!-- Subject Tabs -->
    <div
      class="flex items-end h-16 px-14 border-b-2 border-b-primary overflow-x-auto"
    >
      <button
        v-for="subject in appState?.selectedSubjects || 20 "
        :key="subject.id"
        @click="selectSubject(subject)"
        :class="[
          'pt-3 pb-1 px-7 flex items-end text-sm font-bold whitespace-nowrap',
          activeSubject === subject.id
            ? 'exam-tab text-white'
            : 'text-primary'
        ]"
      >
        {{ subject?.name || 'no define' }}
      </button>
    </div>
    <!-- {{appState?.selectedSubjects}} -->
  <!-- {{groupedQuestions || 'no define' }} -->
    <!-- Main -->
    <main class="flex w-full min-h-[calc(100vh-64px)]">

      <!-- Left -->
           <section
              class="w-1/4  border-r border-slate-200 p-4 overflow-y-auto"
            >
              <div class="flex justify-between text-gray-500 font-semibold mb-6">
                <h3 class="font- text-sm">
               
                  Attempt: {{ currentSubject?.length }}/{{ currentSubject?.questions?.length }}
                </h3>

               
              </div>
              

               
              
              
                <div class="grid grid-cols-5 gap-3">
                  <!-- <button
                    v-for="question in subjectQuestions"
                    :key="question.examNumber"
                    @click="goToQuestion(question.examNumber)"
                    :class="[
                      'h-16 rounded-xl font-bold text-lg transition-all',

                      currentQuestion === question.examNumber
                        ? 'border-4 border-blue-500 bg-blue-100 text-blue-700'

                        : answeredQuestions.includes(question.examNumber)
                          ? 'bg-green-100 text-green-700'

                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    ]"
                  >

                  :class="[
                          'h-12 rounded-sm   text-sm transition-all',

                          currentQuestion === question.examNumber
                            ? 'border- border-blue-500 bg-blue-100 text-blue-700'

                            : answeredQuestions.includes(question.examNumber)
                              ? 'bg-green-100 text-green-700'

                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        ]"
                    {{ question.examNumber }}
                  </button> -->

                      <button
                        v-for="(question, index) in currentSubject.questions"
                        :key="question.id"
                        @click="goToQuestion(index)"
                        :class="[
                          'h-12 rounded-sm   text-sm transition-all',

                          currentSubject.currentQuestion === index + 1
                            ? 'border-2 border-blue-500 bg-blue-100 text-blue-700'
                             : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        ]"
                        
                      >
                        {{ index + 1 }} 
                      </button>
                </div>
              
            </section>

      <!-- Right -->
      <section class="flex-1 bg-white">
       <h3 class=" font-semibold text-gr text-[16px]">
                  Question: {{ currentSubject?.currentQuestion }}/{{  currentSubject?.questions?.length }} 
                </h3>
        <!-- Content -->
        {{currentQuestion}}
      </section>

    </main>

  </div>
</template>

<style>
.exam-tab{
    

    background-image:url("~/assets/images/icons/tab1.svg"); 
    background-repeat:no-repeat;
    background-size:100% 100%;
    background-position:center;

    border:none;
    
   
}


</style>

