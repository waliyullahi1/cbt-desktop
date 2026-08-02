<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Question {
  topic?: string;
  difficulty?: "Basic" | "Intermediate" | "Advanced";
  answer: string;
  userAnswer?: string | null;
}

interface Subject {
  id: string;
  name: string;
  questions: Question[];
}

const props = defineProps<{
  questions: Subject[];
}>();

const open = ref(true);
const selectedSubject = ref("");

// Selected Subject Questions
const selectedQuestions = computed<Question[]>(() => {
  if (!selectedSubject.value) {
    return props.questions.flatMap(subject => subject.questions);
  }

  const subject = props.questions.find(
    subject => subject.id === selectedSubject.value
  );

  return subject ? subject.questions : [];
});

// ------------------------
// Topic Statistics
// ------------------------
const topics = computed(() => {
  const map = new Map<
    string,
    {
      topic: string;
      total: number;
      correct: number;
    }
  >();

  selectedQuestions.value.forEach((question) => {
    const topic = question.topic || "Unknown";

    if (!map.has(topic)) {
      map.set(topic, {
        topic,
        total: 0,
        correct: 0,
      });
    }

    const current = map.get(topic)!;

    current.total++;

    if (question.userAnswer === question.answer) {
      current.correct++;
    }
  });

  return [...map.values()].sort((a, b) => {
    if (b.correct !== a.correct) {
      return b.correct - a.correct;
    }

    return b.total - a.total;
  });
});

// ------------------------
// Difficulty Statistics
// ------------------------
const difficulties = computed(() => {
  const map = new Map<
    string,
    {
      difficulty: string;
      total: number;
      correct: number;
    }
  >();

  selectedQuestions.value.forEach((question) => {
    const difficulty = question.difficulty || "Unknown";

    if (!map.has(difficulty)) {
      map.set(difficulty, {
        difficulty,
        total: 0,
        correct: 0,
      });
    }

    const current = map.get(difficulty)!;

    current.total++;

    if (question.userAnswer === question.answer) {
      current.correct++;
    }
  });

  const order: Record<string, number> = {
    Advanced: 1,
    Intermediate: 2,
    Basic: 3,
    Unknown: 4,
  };

  return [...map.values()].sort(
    (a, b) => (order[a.difficulty] ?? 99) - (order[b.difficulty] ?? 99)
  );
});

// ------------------------
// Summary Cards
// ------------------------
const totalQuestions = computed(() => selectedQuestions.value.length);

const totalCorrect = computed(() =>
  selectedQuestions.value.filter(
    q => q.userAnswer !== null && q.userAnswer === q.answer
  ).length
);

const totalWrong = computed(() =>
  selectedQuestions.value.filter(
    q =>
      q.userAnswer !== null &&
      q.userAnswer !== undefined &&
      q.userAnswer !== q.answer
  ).length
);

const accuracy = computed(() => {
  if (!totalQuestions.value) return 0;

  return Math.round(
    (totalCorrect.value / totalQuestions.value) * 100
  );
});

// ------------------------
// Default Subject
// ------------------------
watch(
  () => props.questions,
  (subjects) => {
    if (subjects.length && !selectedSubject.value) {
      selectedSubject.value = subjects[0].id;
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="space-y-8">

    <!-- ===================================== -->
    <!-- TOPIC PERFORMANCE -->
    <!-- ===================================== -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <!-- Header -->
      <button
        class="flex w-full items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4"
        @click="open = !open"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
            <Icon
              name="lucide:book-open"
              class="text-2xl text-green-700"
            />
          </div>

          <div class="text-left">
            <h2 class="text-lg font-bold text-slate-800">
              Topic Performance
            </h2>

            <p class="text-sm text-slate-500">
              Performance by topic
            </p>
          </div>
        </div>

        <Icon
          :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
          class="text-xl text-slate-500"
        />
      </button>

      <Transition class="" name="fade">
        <div
          v-show="open"
          class="space-y-6 w-2/3 p-6"
        >
        
          <!-- Subject -->
          <div class="flex  flex-wrap items-center gap-4">
            <label class="font-semibold text-slate-700">
              Subject
            </label>

            <select
              v-model="selectedSubject"
              class="rounded-sm border border-slate-300 px-4 py-1 focus:border-green-600 focus:outline-none"
            >
              <option
                v-for="subject in questions"
                :key="subject.id"
                :value="subject.id"
              >
                {{ subject.name }}
              </option>
            </select>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b bg-slate-100">
                  <th class="px-5 py-1 text-left">#</th>
                  <th class="px-5 py-1 text-left">Topic</th>
                  <th class="px-5 py-1 text-center">Score</th>
                  <th class="px-5 py-1 text-center">Questions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item,index) in topics"
                  :key="item.topic"
                  class="border-b hover:bg-slate-50"
                >
                  <td class="px-5 py-1">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold">
                      {{ index + 1 }}
                    </div>
                  </td>

                  <td class="px-5 py-1 font-medium text-slate-700">
                    {{ item.topic }}
                  </td>

                  <td class="px-5 py-1 text-center">
                    <span class="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                      {{ item.correct }}/{{ item.total }}
                    </span>
                  </td>

                  <td class="px-5 py-1 text-center text-slate-600">
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


           <!-- ===================================== -->
          <!-- DIFFICULTY PERFORMANCE -->
          <!-- ===================================== -->
          <div class="rounded-sm border border-slate-200 bg-white shadow-sm">

            <div class="border-b border-slate-200 px-3 py-2">
              <div class="flex items-center gap-4">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                  <Icon
                    name="lucide:chart-column"
                    class="text-2xl text-indigo-700"
                  />
                </div>

                <div>
                  <h2 class="text-lg font-bold text-slate-800">
                    Difficulty Performance
                  </h2>

                  <p class="text-sm text-slate-500">
                    Performance by question difficulty
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-5 p-">

              <div
                v-for="(item,index) in difficulties"
                :key="item.difficulty"
                class="rounded-sm border border-slate-200 p-2"
              >
                <div class="mb-2 flex items-center justify-between">

                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold">
                      {{ index + 1 }}
                    </div>

                    <span
                      class="rounded-full px-3 py-1 text-xs font-bold"
                      :class="{
                        'bg-green-100 text-green-700': item.difficulty === 'Basic',
                        'bg-yellow-100 text-yellow-700': item.difficulty === 'Intermediate',
                        'bg-red-100 text-red-700': item.difficulty === 'Advanced'
                      }"
                    >
                      {{ item.difficulty }}
                    </span>
                  </div>

                  <div class="text-right">
                    <p class="text-lg font-bold">
                      {{ item.correct }}/{{ item.total }}
                    </p>

                    <p class="text-xs text-slate-500">
                      {{ item.total }} Questions
                    </p>
                  </div>

                </div>

                <div class="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="{
                      'bg-green-500': item.difficulty === 'Basic',
                      'bg-yellow-500': item.difficulty === 'Intermediate',
                      'bg-red-500': item.difficulty === 'Advanced'
                    }"
                    :style="{
                      width: `${item.total ? (item.correct / item.total) * 100 : 0}%`
                    }"
                  />
                </div>

              </div>

            </div>

          </div>
        </div>
      </Transition>

    </div>

   

  </div>
</template>