 <template>
  <div>
    <div class="overflow-x-auto border border-black">
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
          Topics Details
          </h2>
        </div>
      </button>
      <Transition name="fade">
      <div v-show="open"   class="grid grid-cols-1 gap-4 p-4  mt-9">
            <div class="flex gap-2 items-center">
              <div class="bg-green-800 rounded-sm text-white px-4 py-1">
              Format
              </div>

              <select
                v-model="selectedSubject"
                class="border rounded-sm px-2 py-1 w-64"
              >
                <option value="">All Subjects</option>

                <option
                  v-for="subject in questions"
                  :key="subject.id"
                  :value="subject.id"
                >
                  {{ subject.name }}
                </option>
              </select>

            </div>
        <table class="w-2/3 border-collapse">
            <thead>
              <tr class="bg-[#F5F2D9]">
                <th
                  class="w-16 border border-black px-3 py-2 text-left font-semibold"
                >
                  Rank
                </th>

                <th
                  class="border border-black px-3 py-2 text-left font-semibold"
                >
                  Topic
                </th>

                <th
                  class="w-24 border border-black px-3 py-2 text-center font-semibold"
                >
                  Score
                </th>

                <th
                  class="w-36 border border-black px-3 py-2 text-center font-semibold"
                >
                  No. of Question
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in topics"
                :key="item.topic"
                class="hover:bg-gray-50"
              >
                <td class="border border-black px-3 py-2">
                  {{ index + 1 }}
                </td>

                <td class="border border-black px-3 py-2 uppercase">
                  {{ item.topic }}
                </td>

                <td class="border border-black px-3 py-2 text-center">
                  {{ item.correct }} / {{ item.total }}
                </td>

                <td class="border border-black px-3 py-2 text-center">
                  {{ item.total }}
                </td>
              </tr>
                {{}}
              <!-- <tr v-if="topics.length === 0">
                <td
                  colspan="4"
                  class="border border-black py-4 text-center text-gray-500"
                >
                  No topic data available.
                </td>
              </tr> -->
            </tbody>
          </table>
      </div>
      </Transition>
      
    </div>
    <div class="mt-8">
      <h2 class="mb-4 text-2xl font-bold text-slate-800">
        Performance By Question Difficulty Level
      </h2>

      <div class="overflow-hidden rounded border border-slate-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-[#F5F2D9]">
              <th class="border border-slate-400 px-3 py-2 text-left">
                Rank
              </th>

              <th class="border border-slate-400 px-3 py-2 text-left">
                Difficulty Level
              </th>

              <th class="border border-slate-400 px-3 py-2 text-center">
                Score
              </th>

              <th class="border border-slate-400 px-3 py-2 text-center">
                No. of Question
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item,index) in difficulties"
              :key="item.difficulty"
              class="hover:bg-slate-50"
            >
              <td class="border border-slate-300 px-3 py-2">
                {{ index + 1 }}
              </td>

              <td class="border border-slate-300 px-3 py-2">
                <span
                  class="rounded px-2 py-1 text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700':
                      item.difficulty === 'Basic',

                    'bg-yellow-100 text-yellow-700':
                      item.difficulty === 'Intermediate',

                    'bg-red-100 text-red-700':
                      item.difficulty === 'Advanced'
                  }"
                >
                  {{ item.difficulty }}
                </span>
              </td>

              <td class="border border-slate-300 px-3 py-2 text-center">
                {{ item.correct }} / {{ item.total }}
              </td>

              <td class="border border-slate-300 px-3 py-2 text-center">
                {{ item.total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 

<script setup lang="ts">
import { computed } from "vue";

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

const open = ref(true);
const selectedSubject = ref("");

const props = defineProps<{
  questions: Subject[];
}>();

const topics = computed(() => {
  const map = new Map<
    string,
    {
      topic: string;
      total: number;
      correct: number;
    }
  >();

  selectedQuestions.value.forEach((q) => {
    const topic = q.topic || "Unknown";

    if (!map.has(topic)) {
      map.set(topic, {
        topic,
        total: 0,
        correct: 0,
      });
    }

    const current = map.get(topic)!;

    current.total++;

    if (q.userAnswer === q.answer) {
      current.correct++;
    }
  });

  return [...map.values()];
});

const selectedQuestions = computed(() => {
  if (!selectedSubject.value) {
    return props.questions.flatMap(subject => subject.questions);
  }

  const subject = props.questions.find(
    s => s.id === selectedSubject.value
  );

  return subject ? subject.questions : [];
});

const difficulties = computed(() => {
  const map = new Map<
    string,
    {
      difficulty: string;
      total: number;
      correct: number;
    }
  >();

  selectedQuestions.value.forEach((q) => {
    const level = q.difficulty || "Unknown";

    if (!map.has(level)) {
      map.set(level, {
        difficulty: level,
        total: 0,
        correct: 0,
      });
    }

    const current = map.get(level)!;

    current.total++;

    if (q.userAnswer === q.answer) {
      current.correct++;
    }
  });

  // Optional order
  const order = {
    Advanced: 1,
    Intermediate: 2,
    Basic: 3,
    Unknown: 4,
  };

  return [...map.values()].sort(
    (a, b) =>
      (order[a.difficulty] ?? 99) -
      (order[b.difficulty] ?? 99)
  );
});
watch(
  () => props.questions,
  (subjects) => {
    if (subjects.length && !selectedSubject.value) {
      selectedSubject.value = subjects[0].id;
    }
  },
  { immediate: true }
);
</script>
