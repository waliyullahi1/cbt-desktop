<template>
  <div class=" exam-history flex h-full min-h-0 flex-col overflow-hidden bg-app-bg">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <header
      class="shrink-0 flex h-14 items-center justify-between
             bg-primary px-4 text-white shadow-md sm:px-6"
    >

      <!-- Title -->
      <div class="flex items-center gap-3">

        <div
          class="flex h-10 w-10 items-center justify-center
                 rounded-xl bg-white/10"
        >
          <Icon
            name="lucide:graduation-cap"
            class="h-6 w-6"
          />
        </div>

        <div>
          <h1 class="text-sm font-bold sm:text-lg">
            Practice for UTME
          </h1>

          <!-- <p class="hidden text-xs text-green-100 sm:block">
            Select your subjects and start practicing
          </p> -->
        </div>

      </div>


      <!-- Home -->
      <button
        type="button"
        @click="goHome"
        class="group flex h-10 w-10 items-center justify-center
               rounded-xl transition hover:bg-white/10"
        title="Go Home"
      >

        <Icon
          name="lucide:house"
          class=" text-2xl  transition-transform
                 group-hover:scale-110"
        />

      </button>

    </header>


    <!-- ================================================= -->
    <!-- MAIN -->
    <!-- ================================================= -->

    <main class="min-h-0 bg-[#fffdf8]  pb-20 flex-1">

      <!-- ================================================= -->
      <!-- TOP CONTROL BAR -->
      <!-- ================================================= -->

      <section
        class="mb-2 flex flex-col gap-4 rounded-sm border
               border-slate-200 bg-white p-2 shadow-sm
               md:flex-row md:items-center md:justify-between"
      >

        <!-- Select subjects -->
        <div class="flex items-center gap-3">

          <div
            class="flex h-7 w-7 items-center justify-center
                   rounded-sm bg-primary/20  text-primary"
          >
            <Icon
              name="lucide:layers-3"
              class="h-5 w-5"
            />
          </div>

          <div>
            <!-- <p class="text-xs text-slate-500">
              Exam Setup
            </p> -->
             <div>

            <button  @click="openSubjectModal()" class="text-sm  px-2 py-1 rounded-sm bg-primary f text-white">
              Select Subject 
            </button>

            

          </div>

            <!-- <h2 class="font-bold text-slate-900">
              Select Subjects
            </h2> -->
          </div>

        </div>


        <!-- User + Start -->
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center"
        >

          <!-- User -->
          <div class="flex items-center gap-2">

            <Icon
              name="lucide:user-round"
              class="h-5 w-5 text-slate-500"
            />

            <label
              for="user"
              class="text-sm font-semibold text-slate-700"
            >
              User
            </label>
  
                <input
                  id="user"
                  v-model="appState.currentsuser"
                  list="subjects"
                  class="rounded-sm border border-slate-300
                        bg-white px-4 py-1 text-sm font-medium
                        outline-none transition
                        focus:border-green-600
                        focus:ring-2 focus:ring-green-100"
                />

                <datalist id="subjects">
                  <option
                    v-for="option in  appState.users  || []"
                    :key="option"
                    :value="option"
                  />
                </datalist>

          </div>


          <!-- Start -->
          <button
            type="button"
            @click="startExam"
            class="flex items-center justify-center gap-2
                   rounded-sm  bg-primary px-4 py-1
                   text-sm font-semibold text-white
                   shadow-sm transition
                    hover:bg-primary/40
                   active:scale-95"
          >

            <Icon
              name="lucide:play"
              class="h-4 w-4"
            />

            Start Exam

          </button>

        </div>

      </section>


      <!-- ================================================= -->
      <!-- SUBJECT GRID -->
      <!-- ================================================= -->

      <section class=" overflow-y-scroll  mb-32   h-full">

       


        <div
          class="grid grid-cols-1 gap-4 px-2
                 md:grid-cols-3
                 xl:grid-cols-3"
        >

          <!-- SUBJECT CARD -->
          <article
            v-for="subject in selectedSubjects"
            :key="subject.id"
            class="group relative overflow  
                   rounded-sm border border-slate-200
                   bg-[#fffdf8] shadow-sm transition
                   hover:-translate-y-1
                   hover:shadow-lg"
          >

            <!-- Card Header -->
            <div
              class="flex items-center justify-between
                     border-b border-slate-500 bg-[#f8f9fa] p-1"
            >

              <div class="flex items-center gap-3">

                <!-- Subject Icon -->
                <div
                  class="flex h-5 w-5 items-center
                         justify-center rounded-sm"
                  :class="subject.iconBg"
                >

                  <Icon
                    :name="subject.icon"
                    class=" text-xl"
                    :class="subject.iconColor"
                  />

                </div>


                <div>

                  <h3
                    class="font-bold text-[16px] text-slate-900"
                  >
                    {{ subject.name }}
                  </h3>

                  <p class="text-xs text-slate-500">
                    {{ subject.description }}
                  </p>

                </div>

              </div>


              <!-- Selected checkbox -->
              <button
                type="button"
                @click="toggleSubject(subject)"
                class="flex h-5 w-5 items-center
                       justify-center rounded-full
                       transition"
                :class="
                  isSelected(subject)
                    ? 'bg-primary -600 text-white'
                    : 'bg-slate-100 text-slate-400'
                "
              >

                <Icon
                  :name="
                    isSelected(subject)
                      ? 'lucide:minus'
                       : 'lucide:plus'
                  "
                  class=" -3 text-sm 5"
                />

              </button>

            </div>


            <!-- Card Body -->
            <div class="space-y-4 p-4">

              <!-- YEAR -->
              <div class=" flex items-center  gap-2">

                <label
                  class="mb-1.5 flex items-center gap-2
                         text-sm font-semibold text-slate-600"
                >

                  <Icon
                    name="lucide:calendar-days"
                    class="h-4 w-4 text-blue-600"
                  />

                  Year

                </label>
              <!-- {{getSubjectDetails(subject)?.topics}} ffff -->

                <div class="relative w-full">

                  <select
                    v-model="subject.year"
                    class="  w-full appearance-none rounded-sm
                           border border-slate-200
                           bg-slate-50 px-3 py-1
                           text-sm font-medium
                           outline-none transition
                           focus:border-blue-600
                           focus:bg-white
                           focus:ring-2
                           focus:ring-blue-100"
                  >
                  <option value="all">
                    All
                  </option>

                    <option
                      v-for="year in getSubjectDetails(subject)?.years"
                      :key="year"
                      :value="year"
                    >
                      {{ year }}
                    </option>

                  </select>

                  <Icon
                    name="lucide:chevron-down"
                    class="pointer-events-none
                           absolute right-3 top-1/2
                           h-6 w-6
                           -translate-y-1/2
                           text-slate-400"
                  />

                </div>

              </div>

             
              <!-- QUESTIONS -->
                <div class=" flex gap-2 ">

                  <label
                    class="mb-1.5 flex items-center gap-2
                          text-sm  whitespace-nowrap  wrap-normal n font-semibold text-slate-600"
                  >

                    <Icon
                      name="lucide:list-ordered"
                      class="h-4 w-4 text-green-600"
                    />

                    No Questions

                  </label>


                  <div class="relative w-full">

                    <select
                      v-model=" subject.questions"
                      class="w-full appearance-none rounded-sm
                            border border-slate-200
                            bg-slate-50 px-3 py-1
                            text-sm font-medium
                            outline-none transition
                            focus:border-blue-600
                            focus:bg-white
                            focus:ring-2
                            focus:ring-green-100"
                    >

                      <option
                        v-for="number in subject.questionOptions"
                        :key="number"
                        :value="number"
                      >
                        {{ number }} Questions
                      </option>

                    </select>

                    <Icon
                      name="lucide:chevron-down"
                      class="pointer-events-none
                            absolute right-3 top-1/2
                            h-4 w-4
                            -translate-y-1/2
                            text-slate-400"
                    />

                  </div>

                </div>


                <!-- TOPIC -->
                <div>

                  <div
                    class="mb-1.5 flex items-center
                          justify-between"
                  >

                    <label
                      class="flex items-center gap-2
                            text-xs font-semibold
                            text-slate-600"
                    >

                      <Icon
                        name="lucide:folder-open"
                        class="h-4 w-4 text-green-600"
                      />

                      Topic

                    </label>
                    <p>
                       {{
                          !subject.topics ||
                          subject.topics.length === 0 ||
                          subject.topics.length === getSubjectDetails(subject)?.topics?.length
                            ? "All"
                            : `${subject.topics.length} Topics`
                        }}
                      </p>
                    

                    <!-- Edit Topic -->
                    <button
                      type="button"
                      @click="openTopicModal(subject)"
                      class="flex h-8 w-8 items-center
                            justify-center rounded-full
                            bg-green-50 text-green-600
                            transition hover:bg-green-100"
                      title="Edit Topic"
                    >

                    

                      <Icon
                        name="lucide:pencil"
                        class="h-4 w-4"
                      />

                    </button>
                    
                    <TopicSelector
  v-if="activeSubject"
  v-model="showTopicModal"
  v-model:modelTopics="activeSubject.topics"
  :topics="getSubjectDetails(activeSubject)?.topics || []"
/>
                  </div>


                  

                </div>
              
            </div>

          </article>

        </div>

      </section>


      <!-- ================================================= -->
      <!-- OPTIONS -->
      <!-- ================================================= -->

     

    </main>

     <section class=" shrink-0 h- z-10
             border-t border-slate-200
             bg-white  ">
        <div class="mb- flex items-center gap-1">

          <div class="h-px flex-1 bg-slate-200"></div>

          <div
            class="flex items-center gap-2
                  rounded-full bg-white
                    -sm"
          >

            <Icon
              name="lucide:settings-2"
              class="h-5 w-5 text-primary"
            />

            <h2 class="text-sm font-bold text-slate-700">
              Exam Options
            </h2>

          </div>

          <div class="h-px flex-1 bg-slate-200"></div>

        </div>


        <div
          class="grid grid-cols-1 gap
                lg:grid-cols-3"
        >

          <!-- MODE -->
          <div
            class="rounded-sm border 
                  border-slate-200 bg-white p-1
                  sm"
          >

            <label
              class="mb-1 flex items-center gap-2
                    text-sm font-bold text-slate-700"
            >

              <Icon
                name="lucide:monitor-play"
                class="h-4 w-4 text-primary"
              />

              Select Mode

            </label>


            <select
              v-model="examMode"
              class="w-full rounded-sm
                    border border-slate-200
                    bg-slate-50 px-3 py-2
                    text-sm font-medium
                    outline-none focus:border-green-600
                    focus:ring-2 focus:ring-green-100"
            >

              <option value="practice">
                Practice
              </option>

              <option value="exam">
                Examination
              </option>

              <option value="timed">
                Timed Practice
              </option>

            </select>

          </div>


          <!-- DURATION -->
          <div
            class="rounded-sm border
                  border-slate-200 bg-white p-2
                  shadow-sm"
          >

            <label
              class="mb-1 flex items-center gap-2
                    text-sm font-bold text-slate-700"
            >

              <Icon
                name="lucide:timer"
                class="h-4 w-4 text-primary"
              />

              Exam Duration

            </label>


            <div class="relative">

              <input
                v-model="examDuration"
                type="time"
                step="1"
                class="w-full rounded-xl
                      border border-slate-200
                      bg-slate-50 px-3 py-1
                      text-sm font-medium
                      outline-none
                      focus:border-green-600
                      focus:ring-2
                      focus:ring-green-100"
              />

            </div>

          </div>


          <!-- CHECKBOXES -->
          <div
            class="rounded-sm border
                  border-slate-200 bg-white p-1
                  shadow-sm"
          >

            <div class="space-y-1">

              <!-- Shuffle Questions -->
              <label
                class="flex cursor-pointer
                      items-center justify-between"
              >

                <div class="flex items-center gap-3">

                  <div
                    class="flex h-6 w-6 items-center
                          justify-center rounded-lg
                          bg-blue-50 text-blue-600"
                  >

                    <Icon
                      name="lucide:shuffle"
                      class="h-4 w-4"
                    />

                  </div>

                  <span
                    class="text-sm font-semibold
                          text-slate-700"
                  >
                    Shuffle Questions
                  </span>

                </div>


                <input
                  v-model="shuffleQuestions"
                  type="checkbox"
                  class="h-4 w-4 rounded
                        border-slate-300
                        text-green-600
                        accent-green-600"
                />

              </label>


              <!-- Shuffle Options -->
              <label
                class="flex cursor-pointer
                      items-center justify-between"
              >

                <div class="flex items-center gap-3">

                  <div
                    class="flex h-6 w-6 items-center
                          justify-center rounded-lg
                          bg-purple-50 text-purple-600"
                  >

                    <Icon
                      name="lucide:list-restart"
                      class="h-4 w-4"
                    />

                  </div>

                  <span
                    class="text-sm font-semibold
                          text-slate-700"
                  >
                    Shuffle Options
                  </span>

                </div>


                <input
                  v-model="shuffleOptions"
                  type="checkbox"
                  class="h-4 w-4 rounded
                        border-slate-300
                        text-green-600
                        accent-green-600"
                />

              </label>

            </div>

          </div>

        </div>


        <!-- INSTRUCTIONS -->
        <!-- <div class="mt-4 flex justify-end">

          <button
            type="button"
            @click="showInstructions = true"
            class="flex items-center gap-2
                  rounded-xl border
                  border-slate-300 bg-white
                  px-5 py-2.5
                  text-sm font-bold text-slate-700
                  transition hover:border-green-500
                  hover:bg-green-50"
          >

            <Icon
              name="lucide:circle-help"
              class="h-5 w-5 text-green-600"
            />

            Instructions

          </button>

        </div> -->

      </section>


    <!-- ================================================= -->
    <!-- TOPIC MODAL -->
    <!-- ================================================= -->
<!-- 
    <Teleport to="body">

      <div
        v-if="topicSubject"
        class="fixed inset-0 z-50 flex
               items-center justify-center
               bg-black/50 p-4 backdrop-blur-sm"
      >

        <div
          class="w-full max-w-md
                 rounded-2xl bg-white
                 p-6 shadow-2xl"
        >

          <div
            class="mb-5 flex items-center
                   justify-between"
          >

            <div>

              <h2 class="font-bold text-slate-900">
                Select Topic
              </h2>

              <p class="text-xs text-slate-500">
                {{ topicSubject.name }}
              </p>

            </div>


            <button
              @click="topicSubject = null"
              class="flex h-9 w-9 items-center
                     justify-center rounded-full
                     bg-slate-100
                     hover:bg-slate-200"
            >

              <Icon
                name="lucide:x"
                class="h-5 w-5"
              />

            </button>

          </div>


          <div class="space-y-2">

            <button
              v-for="topic in topics"
              :key="topic"
              @click="selectTopic(topic)"
              class="flex w-full items-center
                     justify-between rounded-xl
                     border border-slate-200
                     p-3 text-left text-sm
                     font-medium transition
                     hover:border-green-500
                     hover:bg-green-50"
            >

              {{ topic }}

              <Icon
                name="lucide:chevron-right"
                class="h-4 w-4 text-slate-400"
              />

            </button>

          </div>

        </div>

      </div>

    </Teleport> -->


    <!-- ================================================= -->
    <!-- INSTRUCTIONS MODAL -->
    <!-- ================================================= -->

    <Teleport to="body">

      <div
        v-if="showInstructions"
        class="fixed inset-0 z-50 flex
               items-center justify-center
               bg-black/50 p-4 backdrop-blur-sm"
      >

        <div
          class="w-full max-w-lg
                 rounded-2xl bg-white
                 p-6 shadow-2xl"
        >

          <div
            class="mb-5 flex items-center
                   justify-between"
          >

            <h2 class="text-xl font-bold">
              Exam Instructions
            </h2>

            <button
              @click="showInstructions = false"
              class="flex h-9 w-9 items-center
                     justify-center rounded-full
                     bg-slate-100"
            >

              <Icon
                name="lucide:x"
                class="h-5 w-5"
              />

            </button>

          </div>


          <div class="space-y-3 text-sm text-slate-600">

            <p>
              <Icon
                name="lucide:check-circle"
                class="mr-2 inline h-4 w-4 text-green-600"
              />
              Select the subjects you want to practice.
            </p>

            <p>
              <Icon
                name="lucide:clock"
                class="mr-2 inline h-4 w-4 text-green-600"
              />
              Complete the examination before the timer ends.
            </p>

            <p>
              <Icon
                name="lucide:shuffle"
                class="mr-2 inline h-4 w-4 text-green-600"
              />
              You can shuffle questions and answer options.
            </p>

          </div>


          <button
            @click="showInstructions = false"
            class="mt-6 w-full rounded-xl
                   bg-green-700 py-3
                   text-sm font-bold text-white
                   hover:bg-green-800"
          >
            Got It
          </button>

        </div>

      </div>

    </Teleport>

    <!-- ================================================= -->
    <!-- SUBJECT SELECTOR MODAL -->
    <!-- ================================================= -->

<SelectSubject
  v-model="showSubjectModal"
  v-model:modelSubjects="selectedSubjects"
/>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import subjectsdetails  from '~/data/subjectdetail.js'
import questions from '~/data/questions.js'
/*
|--------------------------------------------------------------------------
| Emits
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['gohome'])
const appState = useAppState()
/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

const users = [
  'WAHEED',
  'Student 2',
  'Student 3'
]
/*
|--------------------------------------------------------------------------
| SAVE  User Name
|--------------------------------------------------------------------------
*/

const selectedUser = ref('WAHEED')
const saveUser = () => {
  const name = (appState.value.currentsuser || '').trim()

  if (!name || name.toLowerCase() === 'unknown') {
    return
  }

  if (!appState.value.users) {
    appState.value.users = []
  }

  const exists = appState.value.users.some(
    user => user.toLowerCase() === name.toLowerCase()
  )

  if (!exists) {
    appState.value.users.push(name)
  }
  console.log(appState.value.users,'ppState.value.users');
  
  appState.value.currentsuser = name
}




const showSubjectModal = ref(false)
const showTopicModal = ref(false)
const activeSubject = ref(null)

const openTopicModal = (subject) => {
  activeSubject.value = subject
  showTopicModal.value = true
}
const selectedSubjects = ref([
   {
    id: 'english',
    name: 'English',
    icon: 'lucide:book-open'
  }
])
/*
|--------------------------------------------------------------------------
| Exam Settings
|--------------------------------------------------------------------------
*/

const examMode = ref('practice')

const examDuration = ref('02:00:00')

const shuffleQuestions = ref(true)

const shuffleOptions = ref(true)

/*
|--------------------------------------------------------------------------
| All Available Subjects
|--------------------------------------------------------------------------
*/

const SUBJECTS = [
  'accounting',
  'agriculture',
  'arabic',
  'biology',
  'chemistry',
  'christian-religious-studies',
  'civic-education',
  'commerce',
  'computer-studies',
  'economics',
  'english',
  'fine-art',
  'french',
  'geography',
  'government',
  'hausa',
  'history',
  'home-economics',
  'igbo',
  'insurance',
  'literature-in-english',
  'mathematics',
  'marketing',
  'physics'
]

/*
|--------------------------------------------------------------------------
| Subject Icons
|--------------------------------------------------------------------------
*/

const subjectIcons = {

  accounting:
    'lucide:calculator',

  agriculture:
    'lucide:wheat',

  arabic:
    'lucide:languages',

  biology:
    'lucide:dna',

  chemistry:
    'lucide:flask-conical',

  'christian-religious-studies':
    'lucide:church',

  'civic-education':
    'lucide:landmark',

  commerce:
    'lucide:shopping-cart',

  'computer-studies':
    'lucide:monitor',

  economics:
    'lucide:chart-no-axes-combined',

  'english':
    'lucide:book-open',

  'fine-art':
    'lucide:palette',

  french:
    'lucide:languages',

  geography:
    'lucide:globe-2',

  government:
    'lucide:building-2',

  hausa:
    'lucide:languages',

  history:
    'lucide:scroll-text',

  'home-economics':
    'lucide:house',

  igbo:
    'lucide:languages',

  insurance:
    'lucide:shield-check',

  'literature-in-english':
    'lucide:book-text',

  mathematics:
    'lucide:sigma',

  marketing:
    'lucide:megaphone',

  physics:
    'lucide:atom'

}


const getSubjectDetails = (subject) => {
   console.log(subject )
  
  return subjectsdetails.find(
    item => item.id === subject.id
  )
}


// selectedSubjects.value.push({
//   id: subject.id,
//   name: subject.name,
//   icon: subject.icon,

//   // Latest year automatically selected
//   year: details?.years?.at(-1) || null,

//   // Default topic
//   topic: 'All',

//   // Default questions
//   questions: 20
// })
/*
|--------------------------------------------------------------------------
| Subject Colors
|--------------------------------------------------------------------------
*/

const subjectColors = {

  accounting: {
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },

  agriculture: {
    bg: 'bg-green-100',
    text: 'text-green-600'
  },

  arabic: {
    bg: 'bg-orange-100',
    text: 'text-orange-600'
  },

  biology: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600'
  },

  chemistry: {
    bg: 'bg-purple-100',
    text: 'text-purple-600'
  },

  'christian-religious-studies': {
    bg: 'bg-red-100',
    text: 'text-red-600'
  },

  'civic-education': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600'
  },

  commerce: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600'
  },

  'computer-studies': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600'
  },

  economics: {
    bg: 'bg-teal-100',
    text: 'text-teal-600'
  },

  'english': {
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },

  'fine-art': {
    bg: 'bg-pink-100',
    text: 'text-pink-600'
  },

  french: {
    bg: 'bg-violet-100',
    text: 'text-violet-600'
  },

  geography: {
    bg: 'bg-lime-100',
    text: 'text-lime-600'
  },

  government: {
    bg: 'bg-slate-100',
    text: 'text-slate-600'
  },

  hausa: {
    bg: 'bg-amber-100',
    text: 'text-amber-600'
  },

  history: {
    bg: 'bg-stone-100',
    text: 'text-stone-600'
  },

  'home-economics': {
    bg: 'bg-rose-100',
    text: 'text-rose-600'
  },

  igbo: {
    bg: 'bg-green-100',
    text: 'text-green-600'
  },

  insurance: {
    bg: 'bg-sky-100',
    text: 'text-sky-600'
  },

  'literature-in-english': {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-600'
  },

  mathematics: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600'
  },

  marketing: {
    bg: 'bg-pink-100',
    text: 'text-pink-600'
  },

  physics: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600'
  }

}

/*
|--------------------------------------------------------------------------
| Format Subject Name
|--------------------------------------------------------------------------
*/

const formatSubjectName = (subject) => {

  return subject
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

}

/*
|--------------------------------------------------------------------------
| Get Subject Icon
|--------------------------------------------------------------------------
*/

const getSubjectIcon = (subject) => {

  return (
    subjectIcons[subject] ||
    'lucide:book-open'
  )

}

/*
|--------------------------------------------------------------------------
| Get Subject Color
|--------------------------------------------------------------------------
*/

const getSubjectColor = (subject) => {

  return (
    subjectColors[subject] || {
      bg: 'bg-slate-100',
      text: 'text-slate-600'
    }
  )

}

/*
|--------------------------------------------------------------------------
| Selected Subjects
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| Check If Subject Is Selected
|--------------------------------------------------------------------------
*/

const isSelected = (subject) => {
  return selectedSubjects.value.some(
    item => item.id === subject.id
  )
}

/*
|--------------------------------------------------------------------------
| Toggle One Subject
|--------------------------------------------------------------------------
*/
const createSubject = (subject) => {
  const details = getSubjectDetails(subject)

  return {
    ...subject,
    year: details?.years?.at(-1) ?? "all",
    topics: [], // <-- add this
    questions: subject.subject === "englisH" ? 60 : 40,
    questionOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100]
  }
}
const toggleSubject = (subject) => {

  if (
    isSelected(subject)
  ) {

    selectedSubjects.value =
      selectedSubjects.value.filter(
        item => item !== subject
      )

  } else {

    // selectedSubjects.value.push(
    //   subject
    // )
    selectedSubjects.value.push(createSubject(subject))

  }

}

/*
|--------------------------------------------------------------------------
| Subject Modal
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| Open Subject Modal
|--------------------------------------------------------------------------
*/

const openSubjectModal = () => {

  showSubjectModal.value = true

}


// const openSubjectModal = () => {
//   showSubjectModal.value = true
// }

const handleSubjectsConfirmed = (subjects) => {
  console.log('DATA FROM SELECT SUBJECT:', subjects)

  selectedSubjects.value = subjects
}
/*
|--------------------------------------------------------------------------
| Close Subject Modal
|--------------------------------------------------------------------------
*/

const closeSubjectModal = () => {

  showSubjectModal.value = false

}

/*
|--------------------------------------------------------------------------
| Select All Subjects
|--------------------------------------------------------------------------
*/

const selectAllSubjects = computed({

  get() {

    return (
      selectedSubjects.value.length ===
      SUBJECTS.length
    )

  },

  set(value) {

    if (value) {

      selectedSubjects.value = [
        ...SUBJECTS
      ]

    } else {

      selectedSubjects.value = []

    }

  }

})

/*
|--------------------------------------------------------------------------
| Toggle Select All
|--------------------------------------------------------------------------
*/

const toggleSelectAll = () => {

  if (
    selectedSubjects.value.length ===
    SUBJECTS.length
  ) {

    selectedSubjects.value = []

  } else {

    selectedSubjects.value = [
      ...SUBJECTS
    ]

  }

}

/*
|--------------------------------------------------------------------------
| Confirm Subjects
|--------------------------------------------------------------------------
*/

const confirmSubjects = () => {

  console.log(
    'Selected Subjects:',
    selectedSubjects.value
  )

  showSubjectModal.value = false

}

/*
|--------------------------------------------------------------------------
| Topic
|--------------------------------------------------------------------------
*/

const topicSubject = ref(null)

const topics = [

  'All',

  'Algebra',

  'Geometry',

  'Probability',

  'Statistics',

  'Grammar',

  'Comprehension',

  'Organic Chemistry'

]

/*
|--------------------------------------------------------------------------
| Open Topic
|--------------------------------------------------------------------------
*/

const editTopic = (subject) => {

  topicSubject.value = subject

}

/*
|--------------------------------------------------------------------------
| Select Topic
|--------------------------------------------------------------------------
*/

const selectTopic = (topic) => {
  
  if (
    topicSubject.value
  ) {

    topicSubject.value.topic =
      topic

  }

  topicSubject.value = null

}

/*
|--------------------------------------------------------------------------
| Instructions
|--------------------------------------------------------------------------
*/

const showInstructions = ref(false)
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

// const shuffleArray = (array) => {
//   const shuffled = [...array]

//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(
//       Math.random() * (i + 1)
//     )

//     ;[
//       shuffled[i],
//       shuffled[j]
//     ] = [
//       shuffled[j],
//       shuffled[i]
//     ]
//   }

//   return shuffled
// }

function shuffleArray(array) {
  const arr = [...array] // Copy to avoid mutating original

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

function shuffleQuestionOptions(question) {
  // Keep only options that actually exist
  const entries = Object.entries(question.options)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")

  // Correct answer text
  const correctText = question.options[question.answer]

  // Fisher-Yates shuffle
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[entries[i], entries[j]] = [entries[j], entries[i]]
  }

  const newOptions = {}
  let newAnswer = ""

  entries.forEach(([, value], index) => {
    // Generate keys: a, b, c, d, e, f, g, h...
    const key = String.fromCharCode(97 + index)

    newOptions[key] = value

    if (value === correctText) {
      newAnswer = key
    }
  })

  return {
    ...question,
    options: newOptions,
    answer: newAnswer,
    userAnswer:null,

  }
}



const startExam = async () => {
  appState.value.reviewQuestions = false
  if (
    selectedSubjects.value.length === 0
  ) {
    alert(
      'Please select at least one subject.'
    )

    return
  }
 appState.value.selectedSubjects =  selectedSubjects.value 

  // Save exam settings
  appState.value.examSettings = {
    mode: examMode.value,

    duration:
      examDuration.value,

    shuffleQuestions:
      shuffleQuestions.value,

    shuffleOptions:
      shuffleOptions.value
  }


 
  let examQuestions = []

 for (const subject of appState.value.selectedSubjects) {
      console.log(subject, 'subject');
  // Get all questions for this subject
let subjectQuestions = questions.filter(
  question =>
    question.subject === subject.id &&
    question.year === subject.year
   
    // (subject.topics.length === 0 ||
    //   subject.topics.includes(question.topic))
)
if(!subjectQuestions){
  subjectQuestions = questions.filter(
  question =>
    question.subject === subject.id
   
    // (subject.topics.length === 0 ||
    //   subject.topics.includes(question.topic))
)
}
  // Shuffle question order
  if (shuffleQuestions.value) {
    subjectQuestions = shuffleArray(subjectQuestions)
  }

  // Take only the required number of questions
  subjectQuestions = subjectQuestions.slice(
    0,
    subject.questions
  )

  // Shuffle options if enabled
  if (shuffleOptions.value) {
    subjectQuestions = subjectQuestions.map(question =>
      shuffleQuestionOptions(question)
    )
  }

  // Append to final exam
  examQuestions.push(...subjectQuestions)
}

console.log(examQuestions);


  appState.value.examQuestions = examQuestions
    // appState.value.isHome =
  //   false
  saveUser()

  // Go to exam
  await navigateTo('/exam')
}



/*
|--------------------------------------------------------------------------
| Go Home
|--------------------------------------------------------------------------
*/
onMounted(() => {

console.log(appState.value.selectedSubjects, 'appState.value.selectedSubjects');
// appState.value.selectedSubjects =    selectedSubjects.value

if (appState.value.selectedSubjects.length > 0) {
  selectedSubjects.value = appState.value.selectedSubjects

      examDuration.value =appState.value.examSettings.duration 
      shuffleQuestions.value = appState.value.examSettings.shuffleQuestions 

      shuffleOptions.value = appState.value.examSettings.shuffleOptions 
}

})

import { watch } from "vue"

watch(
  selectedSubjects,
  (subjects) => {
    subjects.forEach((subject) => {
      const details = getSubjectDetails(subject)

      // default year
      if (!subject.year) {
        subject.year =
          details?.years?.[details.years.length - 1] || "all"
      }

      // default topic
      if (!subject.topic) {
        subject.topic =
          details?.topics?.[0] || "All"
      }

      // default questions
// Default questions
        if (!subject.questions) {
          subject.questions =
            subject.id === "english" ? 60 : 40
        }
       

      
      
      if (!subject.questionOptions) {
        subject.questionOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      }
    })
  },
  {
    immediate: true,
    deep: true
  }
)
const goHome = () => {

  emit('gohome')

}

</script>
<style scoped>
.exam-history {
  --bg: #f6f3ec;
  --surface: #fffdf8;
  --ink: #201f22;
  --ink-soft: #6b665c;
  --line: #e6e0d2;
  --navy: #24304a;
  --navy-soft: #3c4c6e;
  --gold: #b9873b;
  --good: #3f7a5c;
  --good-bg: #e7f0e8;
  --bad: #ab5137;
  --bad-bg: #f7e9e2;
  --mid-bg: #f4ecda;
 
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
}
</style>