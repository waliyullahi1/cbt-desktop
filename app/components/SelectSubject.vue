<template>

  <Teleport to="body">

    <!-- OVERLAY -->

    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm"
    >

      <!-- MODAL -->

      <div
        class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl"
      >

        <!-- ================================= -->
        <!-- HEADER -->
        <!-- ================================= -->

        <div
          class="flex items-center justify-between bg-primary px-6 py-1 text-white"
        >

          <h2 class="text-sm font-semibold">
            Select Subject
          </h2>


          <!-- CLOSE -->

          <button
            type="button"
            @click="closeModal"
            class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/20"
          >

            <Icon
              name="lucide:x"
              class="  text-2xl font-semibold "
            />

          </button>

        </div>


        <!-- ================================= -->
        <!-- CONTENT -->
        <!-- ================================= -->

        <div
          class="flex-1 overflow-y-auto p-3"
        >

          <!-- SELECT ALL -->

          <label
            class="mb-2 flex cursor-pointer items-center gap-3 border-b border-primary pb-2"
          >

            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
              class="h-4 w-4 cursor-pointer accent-blue-600"
            />

            <span
              class="text-[15px] font-semibold text-slate-800"
            >
              Select All
            </span>

          </label>


          <!-- ================================= -->
          <!-- SUBJECT LIST -->
          <!-- ================================= -->

          <div
            class="grid grid-cols-1 gap- sm:grid-cols-2"
          >

            <label
              v-for="subject in SUBJECTS"
              :key="subject"
              class="group flex cursor-pointer items-center gap-3 rounded-sm p-2 transition hover:bg-green-50"
            >

              <!-- CHECKBOX -->

              <input
                type="checkbox"
                :checked="isSelected(subject)"
                @change="toggleSubject(subject)"
                class="h-4 w-4 cursor-pointer bg-primary accen-green-600"
              />


              <!-- ICON -->

              <div
                :class="[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-sm',
                  getSubjectColor(subject).bg
                ]"
              >

                <Icon
                  :name="getSubjectIcon(subject)"
                  :class="[
                    'h-4 w-4',
                    getSubjectColor(subject).text
                  ]"
                />

              </div>


              <!-- SUBJECT NAME -->

              <span
                class="text-base font-medium text-slate-700"
              >

                {{ formatSubjectName(subject) }}

              </span>

            </label>

          </div>

        </div>


        <!-- ================================= -->
        <!-- FOOTER -->
        <!-- ================================= -->

        <div
          class="flex items-center justify-between border-t border-slate-200 bg-primary px-6 py-4"
        >

          <!-- SELECTED COUNT -->

          <span
            class="text-sm font-medium text-white"
          >

            {{ selectedSubjects.length }}
            selected

          </span>


          <!-- BUTTONS -->

          <div
            class="flex gap-3"
          >

            <!-- CANCEL -->

            <button
              type="button"
              @click="closeModal"
              class="rounded-sm bg-white px-5 py-1 font-semibold text-slate-700 shadow transition hover:bg-slate-100"
            >

              Cancel

            </button>


            <!-- OKAY -->

            <button
              type="button"
              @click="confirmSubjects"
              class="rounded-sm bg-blue-600 px-5 py-1 font-semibold text-white shadow transition hover:bg-blue-700"
            >

              Okay

            </button>

          </div>

        </div>

      </div>

    </div>

  </Teleport>

</template>


<script setup>

import {
  computed,
  ref,
  watch
} from 'vue'


/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({

  /*
   * Controls modal open / close
   *
   * Parent:
   *
   * <SelectSubject
   *   v-model="showSubjectModal"
   * />
   */

  modelValue: {
    type: Boolean,
    default: false
  },


  /*
   * Selected subjects from parent
   *
   * Example:
   *
   * [
   *   {
   *     id: 'biology',
   *     name: 'Biology',
   *     icon: 'lucide:dna'
   *   }
   * ]
   */

  modelSubjects: {
    type: Array,
    default: () => []
  }

})


/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits([

  /*
   * v-model
   */

  'update:modelValue',


  /*
   * Selected subjects
   */

  'update:modelSubjects',


  /*
   * User clicked confirm
   */

  'confirm'

])


/*
|--------------------------------------------------------------------------
| ALL SUBJECTS
|--------------------------------------------------------------------------
|
| Every subject has the same structure:
|
| id
| name
| icon
|
|--------------------------------------------------------------------------
*/

const SUBJECTS = [

  {
    id: 'accounting',
    name: 'Accounting',
    icon: 'lucide:calculator',
     
  },

  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: 'lucide:wheat'
  },

  {
    id: 'arabic',
    name: 'Arabic',
    icon: 'lucide:languages'
  },

  {
    id: 'biology',
    name: 'Biology',
    icon: 'lucide:dna'
  },

  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'lucide:flask-conical'
  },

  {
    id: 'christian-religious-studies',
    name: 'Christian Religious Studies',
    icon: 'lucide:church'
  },

  {
    id: 'civic-education',
    name: 'Civic Education',
    icon: 'lucide:landmark'
  },

  {
    id: 'commerce',
    name: 'Commerce',
    icon: 'lucide:shopping-cart'
  },

  {
    id: 'computer-studies',
    name: 'Computer Studies',
    icon: 'lucide:monitor'
  },

  {
    id: 'economics',
    name: 'Economics',
    icon: 'lucide:chart-no-axes-combined'
  },

  {
    id: 'english',
    name: 'English',
    icon: 'lucide:book-open'
  },

  {
    id: 'fine-art',
    name: 'Fine Art',
    icon: 'lucide:palette'
  },

  {
    id: 'french',
    name: 'French',
    icon: 'lucide:languages'
  },

  {
    id: 'geography',
    name: 'Geography',
    icon: 'lucide:globe-2'
  },

  {
    id: 'government',
    name: 'Government',
    icon: 'lucide:building-2'
  },

  {
    id: 'hausa',
    name: 'Hausa',
    icon: 'lucide:languages'
  },

  {
    id: 'history',
    name: 'History',
    icon: 'lucide:scroll-text'
  },

  {
    id: 'home-economics',
    name: 'Home Economics',
    icon: 'lucide:house'
  },

  {
    id: 'igbo',
    name: 'Igbo',
    icon: 'lucide:languages'
  },

  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'lucide:shield-check'
  },

  {
    id: 'literature-in-english',
    name: 'Literature in English',
    icon: 'lucide:book-text'
  },

  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'lucide:sigma'
  },

  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'lucide:megaphone'
  },

  {
    id: 'physics',
    name: 'Physics',
    icon: 'lucide:atom'
  }

]


/*
|--------------------------------------------------------------------------
| LOCAL SELECTED SUBJECTS
|--------------------------------------------------------------------------
*/

const selectedSubjects = ref([])


/*
|--------------------------------------------------------------------------
| COPY PARENT DATA INTO LOCAL DATA
|--------------------------------------------------------------------------
|
| This handles both:
|
| 1. Parent sends objects
|
| 2. Parent accidentally sends string IDs
|
|--------------------------------------------------------------------------
*/

watch(

  () => props.modelSubjects,

  (value) => {

    if (!Array.isArray(value)) {

      selectedSubjects.value = []

      return

    }


    selectedSubjects.value = value

      .map((subject) => {

        /*
         * If parent sends:
         *
         * "biology"
         *
         * Find the full subject object.
         */

        if (typeof subject === 'string') {

          return SUBJECTS.find(
            item => item.id === subject
          )

        }


        /*
         * If parent already sends
         * a complete object
         */

        if (
          subject &&
          typeof subject === 'object'
        ) {

          return subject

        }


        return null

      })

      .filter(Boolean)

  },

  {
    immediate: true,
    deep: true
  }

)


/*
|--------------------------------------------------------------------------
| CHECK IF ALL SUBJECTS ARE SELECTED
|--------------------------------------------------------------------------
*/

const allSelected = computed(() => {

  return (

    SUBJECTS.length > 0 &&

    selectedSubjects.value.length ===
    SUBJECTS.length

  )

})


/*
|--------------------------------------------------------------------------
| CHECK IF A SUBJECT IS SELECTED
|--------------------------------------------------------------------------
*/

const isSelected = (subject) => {

  return selectedSubjects.value.some(

    item => item.id === subject.id

  )

}


/*
|--------------------------------------------------------------------------
| SELECT / UNSELECT SUBJECT
|--------------------------------------------------------------------------
*/

const toggleSubject = (subject) => {

  /*
   * Check if already selected
   */

  const index = selectedSubjects.value.findIndex(

    item => item.id === subject.id

  )


  /*
   * If selected
   * remove it
   */

  if (index !== -1) {

    selectedSubjects.value.splice(
      index,
      1
    )

    return

  }


  /*
   * If not selected
   * add it
   */

  selectedSubjects.value.push({

    id: subject.id,

    name: subject.name,

    icon: subject.icon

  })

}


/*
|--------------------------------------------------------------------------
| SELECT / UNSELECT ALL
|--------------------------------------------------------------------------
*/

const toggleSelectAll = () => {

  /*
   * If everything is selected
   * remove everything
   */

  if (allSelected.value) {

    selectedSubjects.value = []

    return

  }


  /*
   * Otherwise select everything
   */

  selectedSubjects.value = [

    ...SUBJECTS

  ]

}


/*
|--------------------------------------------------------------------------
| CLOSE MODAL
|--------------------------------------------------------------------------
*/

const closeModal = () => {

  emit(
    'update:modelValue',
    false
  )

}


/*
|--------------------------------------------------------------------------
| CONFIRM SELECTED SUBJECTS
|--------------------------------------------------------------------------
*/

const confirmSubjects = () => {

  /*
   * Create a clean copy
   */

  const subjectsToSend =

    selectedSubjects.value.map(

      subject => ({

        id:
          subject.id,

        name:
          subject.name,

        icon:
          subject.icon

      })

    )


  /*
   * Send selected subjects
   * to parent using v-model
   */

  emit(

    'update:modelSubjects',

    subjectsToSend

  )


  /*
   * Also send confirm event
   */

  emit(

    'confirm',

    subjectsToSend

  )


  /*
   * Close modal
   */

  emit(

    'update:modelValue',

    false

  )

}


/*
|--------------------------------------------------------------------------
| FORMAT SUBJECT NAME
|--------------------------------------------------------------------------
|
| This function is useful if you ever have
| a subject ID and want to display it.
|
|--------------------------------------------------------------------------
*/

const formatSubjectName = (subject) => {

  /*
   * If subject is an object
   */

  if (
    subject &&
    typeof subject === 'object'
  ) {

    return subject.name || ''

  }


  /*
   * If subject is a string
   */

  if (
    typeof subject !== 'string'
  ) {

    return ''

  }


  return subject

    .replace(
      /-/g,
      ' '
    )

    .replace(
      /\b\w/g,
      char =>
        char.toUpperCase()
    )

}


/*
|--------------------------------------------------------------------------
| SUBJECT COLORS
|--------------------------------------------------------------------------
*/

const subjectColors = {

  accounting:
    ['bg-blue-100', 'text-blue-600'],

  agriculture:
    ['bg-green-100', 'text-green-600'],

  arabic:
    ['bg-orange-100', 'text-orange-600'],

  biology:
    ['bg-emerald-100', 'text-emerald-600'],

  chemistry:
    ['bg-purple-100', 'text-purple-600'],

  'christian-religious-studies':
    ['bg-red-100', 'text-red-600'],

  'civic-education':
    ['bg-indigo-100', 'text-indigo-600'],

  commerce:
    ['bg-yellow-100', 'text-yellow-600'],

  'computer-studies':
    ['bg-cyan-100', 'text-cyan-600'],

  economics:
    ['bg-teal-100', 'text-teal-600'],

  'english':
    ['bg-blue-100', 'text-blue-600'],

  'fine-art':
    ['bg-pink-100', 'text-pink-600'],

  french:
    ['bg-violet-100', 'text-violet-600'],

  geography:
    ['bg-lime-100', 'text-lime-600'],

  government:
    ['bg-slate-100', 'text-slate-600'],

  hausa:
    ['bg-amber-100', 'text-amber-600'],

  history:
    ['bg-stone-100', 'text-stone-600'],

  'home-economics':
    ['bg-rose-100', 'text-rose-600'],

  igbo:
    ['bg-green-100', 'text-green-600'],

  insurance:
    ['bg-sky-100', 'text-sky-600'],

  'literature-in-english':
    ['bg-fuchsia-100', 'text-fuchsia-600'],

  mathematics:
    ['bg-indigo-100', 'text-indigo-600'],

  marketing:
    ['bg-pink-100', 'text-pink-600'],

  physics:
    ['bg-cyan-100', 'text-cyan-600']

}


/*
|--------------------------------------------------------------------------
| GET SUBJECT COLOR
|--------------------------------------------------------------------------
*/

const getSubjectColor = (subject) => {

  /*
   * Support both:
   *
   * getSubjectColor(subject)
   *
   * and
   *
   * getSubjectColor('biology')
   */

  const subjectId =

    typeof subject === 'object'

      ? subject?.id

      : subject


  const colors =

    subjectColors[subjectId] ||

    [
      'bg-slate-100',
      'text-slate-600'
    ]


  return {

    bg:
      colors[0],

    text:
      colors[1]

  }

}


/*
|--------------------------------------------------------------------------
| GET SUBJECT ICON
|--------------------------------------------------------------------------
|
| Since the icon is already inside the
| subject object, we don't need another
| subjectIcons object.
|
|--------------------------------------------------------------------------
*/

const getSubjectIcon = (subject) => {

  /*
   * If subject is an object
   */

  if (
    subject &&
    typeof subject === 'object'
  ) {

    return (

      subject.icon ||

      'lucide:book-open'

    )

  }


  /*
   * If subject is an ID string
   */

  const foundSubject = SUBJECTS.find(

    item => item.id === subject

  )


  return (

    foundSubject?.icon ||

    'lucide:book-open'

  )

}


/*
|--------------------------------------------------------------------------
| EXPOSE SUBJECTS
|--------------------------------------------------------------------------
|
| Only needed if you want to use SUBJECTS
| outside this component.
|
|--------------------------------------------------------------------------
*/

defineExpose({

  SUBJECTS,

  selectedSubjects,

  toggleSubject,

  isSelected

})

</script>