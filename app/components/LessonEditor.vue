<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Lesson {
  id?: string
  title: string
  topic?: string
  subtopic?: string
  difficulty?: string
  estimatedMinutes?: number
  syllabusReference?: string
  status?: string
  prerequisites?: string[]
  learningObjectives?: string[]
  introduction?: string

  concepts?: any[]
  formulas?: any[]
  workedExamples?: any[]
  jambQuestionPatterns?: string[]
  jambExamTechniques?: string[]
  commonMistakes?: any[]
  examShortcuts?: any[]
  practiceQuestions?: any[]
  quickRevision?: any
  masteryCheck?: any[]

  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    modelValue?: Lesson | null
  }>(),
  {
    modelValue: () => ({
      title: '',
      topic: '',
      subtopic: '',
      difficulty: '',
      estimatedMinutes: 20,
      syllabusReference: '',
      status: 'CORE',
      prerequisites: [],
      learningObjectives: [],
      introduction: '',
      concepts: [],
      formulas: [],
      workedExamples: [],
      jambQuestionPatterns: [],
      jambExamTechniques: [],
      commonMistakes: [],
      examShortcuts: [],
      practiceQuestions: [],
      quickRevision: {},
      masteryCheck: []
    })
  }
)

const emit = defineEmits<{
  'update:modelValue': [Lesson]
  save: [Lesson]
}>()

/* --------------------------------------------------
   STATE
-------------------------------------------------- */

const editing = ref(false)
const saving = ref(false)

const lesson = ref<Lesson>(clone(props.modelValue))

const originalLesson = ref<Lesson>(clone(props.modelValue))

const activeSection = ref<string | null>(null)

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function clone<T>(value: T): T {
  return structuredClone(value)
}

function emptyLesson(): Lesson {
  return {
    title: '',
    topic: '',
    subtopic: '',
    difficulty: '',
    estimatedMinutes: 20,
    syllabusReference: '',
    status: 'CORE',
    prerequisites: [],
    learningObjectives: [],
    introduction: '',
    concepts: [],
    formulas: [],
    workedExamples: [],
    jambQuestionPatterns: [],
    jambExamTechniques: [],
    commonMistakes: [],
    examShortcuts: [],
    practiceQuestions: [],
    quickRevision: {},
    masteryCheck: []
  }
}

function normalize(value?: Lesson | null): Lesson {
  const source = value || emptyLesson()

  return {
    ...emptyLesson(),
    ...clone(source),

    title: source.title || '',
    topic: source.topic || '',
    subtopic: source.subtopic || '',
    difficulty: source.difficulty || '',
    estimatedMinutes: source.estimatedMinutes || 20,

    prerequisites: Array.isArray(source.prerequisites)
      ? [...source.prerequisites]
      : [],

    learningObjectives: Array.isArray(source.learningObjectives)
      ? [...source.learningObjectives]
      : [],

    concepts: Array.isArray(source.concepts)
      ? [...source.concepts]
      : [],

    formulas: Array.isArray(source.formulas)
      ? [...source.formulas]
      : [],

    workedExamples: Array.isArray(source.workedExamples)
      ? [...source.workedExamples]
      : [],

    jambQuestionPatterns: Array.isArray(source.jambQuestionPatterns)
      ? [...source.jambQuestionPatterns]
      : [],

    jambExamTechniques: Array.isArray(source.jambExamTechniques)
      ? [...source.jambExamTechniques]
      : [],

    commonMistakes: Array.isArray(source.commonMistakes)
      ? [...source.commonMistakes]
      : [],

    examShortcuts: Array.isArray(source.examShortcuts)
      ? [...source.examShortcuts]
      : [],

    practiceQuestions: Array.isArray(source.practiceQuestions)
      ? [...source.practiceQuestions]
      : [],

    masteryCheck: Array.isArray(source.masteryCheck)
      ? [...source.masteryCheck]
      : []
  }
}

/* --------------------------------------------------
   WATCH PARENT
-------------------------------------------------- */

watch(
  () => props.modelValue,
  value => {
    if (!editing.value) {
      lesson.value = normalize(value)
    }
  },
  {
    deep: true
  }
)

/* --------------------------------------------------
   EDIT
-------------------------------------------------- */

function startEditing() {
  originalLesson.value = clone(lesson.value)

  editing.value = true

  activeSection.value = null
}

function cancelEditing() {
  lesson.value = clone(originalLesson.value)

  editing.value = false

  activeSection.value = null
}

function saveLesson() {
  saving.value = true

  const data = clone(lesson.value)

  emit('update:modelValue', data)

  emit('save', data)

  setTimeout(() => {
    saving.value = false
    editing.value = false
  }, 200)
}

/* --------------------------------------------------
   SECTION
-------------------------------------------------- */

function toggleSection(section: string) {
  activeSection.value =
    activeSection.value === section
      ? null
      : section
}

/* --------------------------------------------------
   ARRAY HELPERS
-------------------------------------------------- */

function addObjective() {
  lesson.value.learningObjectives ??= []

  lesson.value.learningObjectives.push('')
}

function removeObjective(index: number) {
  lesson.value.learningObjectives?.splice(index, 1)
}

function addPrerequisite() {
  lesson.value.prerequisites ??= []

  lesson.value.prerequisites.push('')
}

function removePrerequisite(index: number) {
  lesson.value.prerequisites?.splice(index, 1)
}

function addPattern() {
  lesson.value.jambQuestionPatterns ??= []

  lesson.value.jambQuestionPatterns.push('')
}

function removePattern(index: number) {
  lesson.value.jambQuestionPatterns?.splice(index, 1)
}

function addTechnique() {
  lesson.value.jambExamTechniques ??= []

  lesson.value.jambExamTechniques.push('')
}

function removeTechnique(index: number) {
  lesson.value.jambExamTechniques?.splice(index, 1)
}

/* --------------------------------------------------
   CONCEPTS
-------------------------------------------------- */

function addConcept() {
  lesson.value.concepts ??= []

  lesson.value.concepts.push({
    title: 'New Concept',
    explanation: '',
    examples: ['']
  })
}

function removeConcept(index: number) {
  lesson.value.concepts?.splice(index, 1)
}

function addConceptExample(concept: any) {
  concept.examples ??= []

  concept.examples.push('')
}

function removeConceptExample(
  concept: any,
  index: number
) {
  concept.examples?.splice(index, 1)
}

/* --------------------------------------------------
   FORMULAS
-------------------------------------------------- */

function addFormula() {
  lesson.value.formulas ??= []

  lesson.value.formulas.push({
    formula: '',
    variables: ''
  })
}

function removeFormula(index: number) {
  lesson.value.formulas?.splice(index, 1)
}

/* --------------------------------------------------
   WORKED EXAMPLES
-------------------------------------------------- */

function addWorkedExample() {
  lesson.value.workedExamples ??= []

  lesson.value.workedExamples.push({
    question: '',
    steps: [''],
    answer: '',
    difficulty: 'Foundation'
  })
}

function removeWorkedExample(index: number) {
  lesson.value.workedExamples?.splice(index, 1)
}

function addExampleStep(example: any) {
  example.steps ??= []

  example.steps.push('')
}

function removeExampleStep(
  example: any,
  index: number
) {
  example.steps?.splice(index, 1)
}

/* --------------------------------------------------
   PRACTICE QUESTIONS
-------------------------------------------------- */

function addPracticeQuestion() {
  lesson.value.practiceQuestions ??= []

  lesson.value.practiceQuestions.push({
    question: '',
    options: {
      A: '',
      B: '',
      C: '',
      D: ''
    },
    answer: 'A',
    solution: '',
    difficulty: 'Foundation'
  })
}

function removePracticeQuestion(index: number) {
  lesson.value.practiceQuestions?.splice(index, 1)
}
</script>


<template>

  <div class="min-h-full bg-slate-50">

    <!-- ==========================================
         FIXED TOP EDITOR BAR
    =========================================== -->

    <div
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"
    >

      <div
        class="mx-auto max-w-6xl px-4 py-3"
      >

        <!-- READ ONLY HEADER -->

        <div
          v-if="!editing"
          class="flex items-center justify-between gap-4"
        >

          <div class="min-w-0">

            <div class="flex items-center gap-2">

              <span
                v-if="lesson.id"
                class="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-500"
              >
                {{ lesson.id }}
              </span>

              <span
                class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
              >
                {{ lesson.status || 'CORE' }}
              </span>

            </div>

            <h1
              class="mt-1 truncate text-xl font-bold text-slate-900"
            >
              {{ lesson.title || 'Untitled Topic' }}
            </h1>

            <p class="text-sm text-slate-500">

              {{ lesson.topic }}

              <span v-if="lesson.subtopic">
                · {{ lesson.subtopic }}
              </span>

            </p>

          </div>


          <button
            type="button"
            class="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            @click="startEditing"
          >
            ✏️ Edit Topic
          </button>

        </div>


        <!-- EDITING HEADER -->

        <div v-else>

          <div class="mb-3 flex items-center justify-between">

            <div>

              <p
                class="text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                Editing Topic
              </p>

              <p class="text-sm text-slate-600">
                Changes are applied only when you click Save.
              </p>

            </div>

            <div class="flex gap-2">

              <button
                type="button"
                class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                @click="cancelEditing"
              >
                Cancel
              </button>

              <button
                type="button"
                class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                :disabled="saving"
                @click="saveLesson"
              >
                {{ saving ? 'Saving...' : 'Save Topic' }}
              </button>

            </div>

          </div>


          <!-- MAIN TOPIC FIELDS -->

          <div
            class="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
          >

            <label class="block lg:col-span-2">

              <span class="text-xs font-semibold text-slate-500">
                Lesson Title
              </span>

              <input
                v-model="lesson.title"
                type="text"
                class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
              />

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Topic
              </span>

              <input
                v-model="lesson.topic"
                type="text"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Subtopic
              </span>

              <input
                v-model="lesson.subtopic"
                type="text"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Difficulty
              </span>

              <select
                v-model="lesson.difficulty"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Foundation</option>
                <option>Intermediate</option>
                <option>JAMB Standard</option>
                <option>Advanced</option>
              </select>

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Minutes
              </span>

              <input
                v-model.number="lesson.estimatedMinutes"
                type="number"
                min="1"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Syllabus
              </span>

              <input
                v-model="lesson.syllabusReference"
                type="text"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />

            </label>


            <label>

              <span class="text-xs font-semibold text-slate-500">
                Status
              </span>

              <select
                v-model="lesson.status"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option>CORE</option>
                <option>OPTIONAL</option>
                <option>REVISION</option>
              </select>

            </label>

          </div>

        </div>

      </div>

    </div>


    <!-- ==========================================
         READ ONLY TOPIC
    =========================================== -->

    <div
      v-if="!editing"
      class="mx-auto max-w-5xl space-y-5 px-4 py-6"
    >

      <!-- INTRODUCTION -->

      <section
        v-if="lesson.introduction"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >

        <h2 class="mb-3 text-lg font-bold text-slate-900">
          Introduction
        </h2>

        <p
          class="whitespace-pre-line leading-7 text-slate-700"
        >
          {{ lesson.introduction }}
        </p>

      </section>


      <!-- CONCEPTS -->

      <section
        v-if="lesson.concepts?.length"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
      >

        <div class="border-b px-5 py-4">

          <h2 class="text-lg font-bold text-slate-900">
            Concepts
          </h2>

        </div>

        <div class="divide-y">

          <article
            v-for="(concept, index) in lesson.concepts"
            :key="index"
            class="p-5"
          >

            <h3 class="font-semibold text-slate-900">
              {{ concept.title }}
            </h3>

            <p
              class="mt-2 whitespace-pre-line leading-7 text-slate-700"
            >
              {{ concept.explanation }}
            </p>

            <div
              v-if="concept.examples?.length"
              class="mt-3 rounded-lg bg-slate-50 p-4"
            >

              <p class="mb-2 text-xs font-bold uppercase text-slate-400">
                Examples
              </p>

              <ul class="space-y-2">

                <li
                  v-for="(example, i) in concept.examples"
                  :key="i"
                  class="whitespace-pre-line text-sm text-slate-700"
                >
                  {{ example }}
                </li>

              </ul>

            </div>

          </article>

        </div>

      </section>


      <!-- FORMULAS -->

      <section
        v-if="lesson.formulas?.length"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >

        <h2 class="mb-4 text-lg font-bold">
          Formulas
        </h2>

        <div class="space-y-3">

          <div
            v-for="(formula, index) in lesson.formulas"
            :key="index"
            class="rounded-lg bg-slate-50 p-4"
          >

            <div class="font-mono text-lg">
              {{ formula.formula }}
            </div>

            <p class="mt-1 text-sm text-slate-500">
              {{ formula.variables }}
            </p>

          </div>

        </div>

      </section>


      <!-- WORKED EXAMPLES -->

      <section
        v-if="lesson.workedExamples?.length"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >

        <h2 class="mb-4 text-lg font-bold">
          Worked Examples
        </h2>

        <div class="space-y-4">

          <article
            v-for="(example, index) in lesson.workedExamples"
            :key="index"
            class="rounded-lg border p-4"
          >

            <p class="font-semibold">
              {{ example.question }}
            </p>

            <ol
              v-if="example.steps?.length"
              class="mt-3 list-decimal space-y-1 pl-6 text-sm text-slate-600"
            >

              <li
                v-for="(step, i) in example.steps"
                :key="i"
              >
                {{ step }}
              </li>

            </ol>

            <div
              v-if="example.answer"
              class="mt-3 rounded-lg bg-emerald-50 p-3 font-semibold text-emerald-800"
            >
              Answer: {{ example.answer }}
            </div>

          </article>

        </div>

      </section>


      <!-- PRACTICE -->

      <section
        v-if="lesson.practiceQuestions?.length"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >

        <h2 class="mb-4 text-lg font-bold">
          Practice Questions
        </h2>

        <div class="space-y-4">

          <article
            v-for="(question, index) in lesson.practiceQuestions"
            :key="index"
            class="rounded-lg border p-4"
          >

            <p class="font-medium">
              {{ index + 1 }}. {{ question.question }}
            </p>

            <div class="mt-3 grid gap-2 sm:grid-cols-2">

              <div
                v-for="letter in ['A','B','C','D']"
                :key="letter"
                class="rounded border p-2 text-sm"
              >
                <strong>{{ letter }}.</strong>
                {{ question.options?.[letter] }}

              </div>

            </div>

          </article>

        </div>

      </section>

    </div>


    <!-- ==========================================
         EDITOR
    =========================================== -->

    <div
      v-else
      class="mx-auto max-w-5xl space-y-4 px-4 py-6"
    >

      <!-- INTRODUCTION -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4 text-left"
          @click="toggleSection('introduction')"
        >

          <span class="font-bold">
            Introduction
          </span>

          <span>
            {{ activeSection === 'introduction' ? '−' : '+' }}
          </span>

        </button>

        <div
          v-if="activeSection === 'introduction'"
          class="border-t p-5"
        >

          <textarea
            v-model="lesson.introduction"
            rows="7"
            class="w-full rounded-lg border p-3 leading-6 outline-none focus:border-slate-500"
            placeholder="Write the introduction..."
          />

        </div>

      </section>


      <!-- LEARNING OBJECTIVES -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('objectives')"
        >

          <span class="font-bold">
            Learning Objectives
          </span>

          <span>
            {{ activeSection === 'objectives' ? '−' : '+' }}
          </span>

        </button>

        <div
          v-if="activeSection === 'objectives'"
          class="space-y-3 border-t p-5"
        >

          <div
            v-for="(_, index) in lesson.learningObjectives"
            :key="index"
            class="flex gap-2"
          >

            <input
              v-model="lesson.learningObjectives![index]"
              class="flex-1 rounded-lg border px-3 py-2 text-sm"
              placeholder="Learning objective"
            />

            <button
              type="button"
              class="px-3 text-red-500"
              @click="removeObjective(index)"
            >
              ×
            </button>

          </div>

          <button
            type="button"
            class="rounded-lg border border-dashed px-4 py-2 text-sm"
            @click="addObjective"
          >
            + Add Objective
          </button>

        </div>

      </section>


      <!-- CONCEPTS -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('concepts')"
        >

          <span class="font-bold">
            Concepts
            <span class="ml-1 text-xs text-slate-400">
              ({{ lesson.concepts?.length || 0 }})
            </span>
          </span>

          <span>
            {{ activeSection === 'concepts' ? '−' : '+' }}
          </span>

        </button>


        <div
          v-if="activeSection === 'concepts'"
          class="space-y-4 border-t p-5"
        >

          <article
            v-for="(concept, index) in lesson.concepts"
            :key="index"
            class="rounded-xl border bg-slate-50 p-4"
          >

            <div class="mb-3 flex justify-between">

              <span class="text-xs font-bold text-slate-400">
                CONCEPT {{ index + 1 }}
              </span>

              <button
                type="button"
                class="text-sm text-red-500"
                @click="removeConcept(index)"
              >
                Delete
              </button>

            </div>


            <input
              v-model="concept.title"
              class="mb-3 w-full rounded-lg border px-3 py-2 font-semibold"
              placeholder="Concept title"
            />


            <textarea
              v-model="concept.explanation"
              rows="7"
              class="w-full rounded-lg border p-3"
              placeholder="Explanation"
            />


            <div class="mt-4">

              <p class="mb-2 text-sm font-semibold">
                Examples
              </p>

              <div
                v-for="(_, exampleIndex) in concept.examples"
                :key="exampleIndex"
                class="mb-2 flex gap-2"
              >

                <textarea
                  v-model="concept.examples[exampleIndex]"
                  rows="3"
                  class="flex-1 rounded-lg border p-3 text-sm"
                />

                <button
                  type="button"
                  class="text-red-500"
                  @click="removeConceptExample(concept, exampleIndex)"
                >
                  ×
                </button>

              </div>

              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm"
                @click="addConceptExample(concept)"
              >
                + Example
              </button>

            </div>

          </article>


          <button
            type="button"
            class="w-full rounded-lg border-2 border-dashed py-3 text-sm font-semibold"
            @click="addConcept"
          >
            + Add Concept
          </button>

        </div>

      </section>


      <!-- FORMULAS -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('formulas')"
        >

          <span class="font-bold">
            Formulas
          </span>

          <span>
            {{ activeSection === 'formulas' ? '−' : '+' }}
          </span>

        </button>

        <div
          v-if="activeSection === 'formulas'"
          class="space-y-3 border-t p-5"
        >

          <div
            v-for="(formula, index) in lesson.formulas"
            :key="index"
            class="grid gap-3 rounded-lg border p-4 md:grid-cols-2"
          >

            <input
              v-model="formula.formula"
              class="rounded-lg border px-3 py-2 font-mono"
              placeholder="Formula"
            />

            <input
              v-model="formula.variables"
              class="rounded-lg border px-3 py-2"
              placeholder="Variables"
            />

            <button
              type="button"
              class="text-left text-sm text-red-500"
              @click="removeFormula(index)"
            >
              Delete Formula
            </button>

          </div>

          <button
            type="button"
            class="rounded-lg border px-4 py-2 text-sm"
            @click="addFormula"
          >
            + Add Formula
          </button>

        </div>

      </section>


      <!-- WORKED EXAMPLES -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('workedExamples')"
        >

          <span class="font-bold">
            Worked Examples
          </span>

          <span>
            {{ activeSection === 'workedExamples' ? '−' : '+' }}
          </span>

        </button>


        <div
          v-if="activeSection === 'workedExamples'"
          class="space-y-4 border-t p-5"
        >

          <article
            v-for="(example, index) in lesson.workedExamples"
            :key="index"
            class="rounded-xl border bg-slate-50 p-4"
          >

            <div class="mb-3 flex justify-between">

              <span class="text-xs font-bold text-slate-400">
                EXAMPLE {{ index + 1 }}
              </span>

              <button
                type="button"
                class="text-sm text-red-500"
                @click="removeWorkedExample(index)"
              >
                Delete
              </button>

            </div>


            <textarea
              v-model="example.question"
              rows="3"
              class="mb-3 w-full rounded-lg border p-3"
              placeholder="Question"
            />


            <p class="mb-2 text-sm font-semibold">
              Solution Steps
            </p>


            <div
              v-for="(_, stepIndex) in example.steps"
              :key="stepIndex"
              class="mb-2 flex gap-2"
            >

              <textarea
                v-model="example.steps[stepIndex]"
                rows="2"
                class="flex-1 rounded-lg border p-3 text-sm"
                :placeholder="`Step ${stepIndex + 1}`"
              />

              <button
                type="button"
                class="text-red-500"
                @click="removeExampleStep(example, stepIndex)"
              >
                ×
              </button>

            </div>


            <button
              type="button"
              class="mb-3 rounded-lg border px-3 py-2 text-sm"
              @click="addExampleStep(example)"
            >
              + Step
            </button>


            <input
              v-model="example.answer"
              class="mb-3 w-full rounded-lg border px-3 py-2"
              placeholder="Final answer"
            />


            <select
              v-model="example.difficulty"
              class="rounded-lg border px-3 py-2 text-sm"
            >
              <option>Foundation</option>
              <option>Intermediate</option>
              <option>JAMB Standard</option>
            </select>

          </article>


          <button
            type="button"
            class="w-full rounded-lg border-2 border-dashed py-3 text-sm font-semibold"
            @click="addWorkedExample"
          >
            + Add Worked Example
          </button>

        </div>

      </section>


      <!-- PRACTICE QUESTIONS -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('practice')"
        >

          <span class="font-bold">
            Practice Questions
            <span class="ml-1 text-xs text-slate-400">
              ({{ lesson.practiceQuestions?.length || 0 }})
            </span>
          </span>

          <span>
            {{ activeSection === 'practice' ? '−' : '+' }}
          </span>

        </button>


        <div
          v-if="activeSection === 'practice'"
          class="space-y-4 border-t p-5"
        >

          <article
            v-for="(question, index) in lesson.practiceQuestions"
            :key="index"
            class="rounded-xl border bg-slate-50 p-4"
          >

            <div class="mb-3 flex justify-between">

              <span class="text-xs font-bold text-slate-400">
                QUESTION {{ index + 1 }}
              </span>

              <button
                type="button"
                class="text-sm text-red-500"
                @click="removePracticeQuestion(index)"
              >
                Delete
              </button>

            </div>


            <textarea
              v-model="question.question"
              rows="3"
              class="mb-3 w-full rounded-lg border p-3"
              placeholder="Question"
            />


            <div class="grid gap-2 sm:grid-cols-2">

              <label
                v-for="letter in ['A','B','C','D']"
                :key="letter"
                class="flex items-center gap-2"
              >

                <span
                  class="w-6 font-bold"
                >
                  {{ letter }}
                </span>

                <input
                  v-model="question.options[letter]"
                  class="w-full rounded-lg border px-3 py-2"
                  :placeholder="`Option ${letter}`"
                />

              </label>

            </div>


            <div class="mt-3 grid gap-2 sm:grid-cols-2">

              <select
                v-model="question.answer"
                class="rounded-lg border px-3 py-2"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>

              <select
                v-model="question.difficulty"
                class="rounded-lg border px-3 py-2"
              >
                <option>Foundation</option>
                <option>Intermediate</option>
                <option>JAMB Standard</option>
              </select>

            </div>


            <textarea
              v-model="question.solution"
              rows="3"
              class="mt-3 w-full rounded-lg border p-3"
              placeholder="Solution / explanation"
            />

          </article>


          <button
            type="button"
            class="w-full rounded-lg border-2 border-dashed py-3 text-sm font-semibold"
            @click="addPracticeQuestion"
          >
            + Add Practice Question
          </button>

        </div>

      </section>


      <!-- LEARNING OBJECTIVES / PREREQUISITES ETC -->

      <section class="rounded-xl border bg-white shadow-sm">

        <button
          type="button"
          class="flex w-full items-center justify-between px-5 py-4"
          @click="toggleSection('advanced')"
        >

          <span class="font-bold">
            Other Topic Information
          </span>

          <span>
            {{ activeSection === 'advanced' ? '−' : '+' }}
          </span>

        </button>


        <div
          v-if="activeSection === 'advanced'"
          class="space-y-6 border-t p-5"
        >

          <!-- Prerequisites -->

          <div>

            <p class="mb-2 font-semibold">
              Prerequisites
            </p>

            <div
              v-for="(_, index) in lesson.prerequisites"
              :key="index"
              class="mb-2 flex gap-2"
            >

              <input
                v-model="lesson.prerequisites![index]"
                class="flex-1 rounded-lg border px-3 py-2"
              />

              <button
                type="button"
                class="text-red-500"
                @click="removePrerequisite(index)"
              >
                ×
              </button>

            </div>

            <button
              type="button"
              class="rounded-lg border px-3 py-2 text-sm"
              @click="addPrerequisite"
            >
              + Prerequisite
            </button>

          </div>


          <!-- JAMB PATTERNS -->

          <div>

            <p class="mb-2 font-semibold">
              JAMB Question Patterns
            </p>

            <div
              v-for="(_, index) in lesson.jambQuestionPatterns"
              :key="index"
              class="mb-2 flex gap-2"
            >

              <input
                v-model="lesson.jambQuestionPatterns![index]"
                class="flex-1 rounded-lg border px-3 py-2"
              />

              <button
                type="button"
                class="text-red-500"
                @click="removePattern(index)"
              >
                ×
              </button>

            </div>

            <button
              type="button"
              class="rounded-lg border px-3 py-2 text-sm"
              @click="addPattern"
            >
              + JAMB Pattern
            </button>

          </div>


          <!-- JAMB TECHNIQUES -->

          <div>

            <p class="mb-2 font-semibold">
              JAMB Exam Techniques
            </p>

            <div
              v-for="(_, index) in lesson.jambExamTechniques"
              :key="index"
              class="mb-2 flex gap-2"
            >

              <input
                v-model="lesson.jambExamTechniques![index]"
                class="flex-1 rounded-lg border px-3 py-2"
              />

              <button
                type="button"
                class="text-red-500"
                @click="removeTechnique(index)"
              >
                ×
              </button>

            </div>

            <button
              type="button"
              class="rounded-lg border px-3 py-2 text-sm"
              @click="addTechnique"
            >
              + Exam Technique
            </button>

          </div>

        </div>

      </section>


      <!-- SAVE AT BOTTOM -->

      <div
        class="flex justify-end gap-3 border-t pt-5"
      >

        <button
          type="button"
          class="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium"
          @click="cancelEditing"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
          @click="saveLesson"
        >
          Save Topic
        </button>

      </div>

    </div>

  </div>

</template>