<template>
  <div class="exam-history">
    <!-- ========================================= -->
    <!-- HEADER -->
    <!-- ========================================= -->
    <header class="eh-header">
      <div class="eh-header__brand">
        <span class="eh-header__mark">
          <Icon name="lucide:scroll-text" />
        </span>
        <div>
          <h1 class="eh-header__title">Exam Record</h1>
          <p class="eh-header__sub">Every practice attempt, on file</p>
        </div>
      </div>
 
      <button type="button" class="eh-header__home" @click="goHome" aria-label="Go home">
        <Icon name="lucide:house" />
      </button>
    </header>
 
    <!-- ========================================= -->
    <!-- MAIN -->
    <!-- ========================================= -->
    <main class="eh-main">
 
      <!-- EMPTY STATE -->
      <div v-if="!histories?.length" class="eh-empty">
        <div class="eh-empty__mark">
          <Icon name="lucide:scroll-text" />
        </div>
        <h2 class="eh-empty__title">No record yet</h2>
        <p class="eh-empty__sub">Finish a practice exam and it'll be filed here.</p>
      </div>
 
      <!-- HISTORY LIST -->
      <ul v-else class="ticket-list">
        <li v-for="exam in sortedHistories" :key="exam.id" class="ticket">
 
          <!-- TOP: identity + score seal -->
          <div class="ticket__top">
            <div class="ticket__meta">
              <span class="ticket__eyebrow">
                {{ examTypeLabel(exam) }} &middot; {{ formatDate(exam.createdAt) }}
              </span>
 
              <h2 class="ticket__title">{{ titleFor(exam) }}</h2>
 
              <div v-if="subjectsFor(exam).length" class="ticket__chips">
                <span v-for="s in subjectsFor(exam)" :key="s" class="chip">
                  {{ formatSubject(s) }}
                </span>
              </div>
            </div>
 
            <div class="seal" :class="bandClass(exam.percentage)">
              <span class="seal__ring">
                <span class="seal__pct">
                  {{ hasNumber(exam.percentage) ? Math.round(exam.percentage) : '—' }}<small v-if="hasNumber(exam.percentage)">%</small>
                </span>
                <span class="seal__agg">{{ formatAggregate(exam) }}</span>
              </span>
            </div>
          </div>
 
          <!-- PERFORATION -->
          <div class="ticket__perforation" role="presentation"></div>
 
          <!-- STATS -->
          <dl class="ticket__stats">
            <div class="stat">
              <dt>Questions</dt>
              <dd>{{ exam.total ?? '—' }}</dd>
            </div>
            <div class="stat">
              <dt>Answered</dt>
              <dd>{{ exam.answered ?? '—' }}</dd>
            </div>
            <div class="stat">
              <dt>Unanswered</dt>
              <dd>{{ exam.unanswered ?? '—' }}</dd>
            </div>
            <div class="stat stat--good">
              <dt>Correct</dt>
              <dd>{{ exam.correct ?? '—' }}</dd>
            </div>
            <div class="stat stat--bad">
              <dt>Wrong</dt>
              <dd>{{ exam.wrong ?? '—' }}</dd>
            </div>
            <div class="stat">
              <dt>Time spent</dt>
              <dd>{{ timeFor(exam) }}</dd>
            </div>
          </dl>
 
          <!-- ACTIONS -->
          <div class="ticket__actions">
            <button type="button" class="btn btn--primary" @click="view(exam.id)">
              <Icon name="lucide:eye" />
              View result
            </button>
 
            <button type="button" class="btn btn--ghost" @click="$emit('review', exam.id)">
              <Icon name="lucide:list-checks" />
              Review answers
            </button>
 
            <button type="button" class="btn btn--danger" @click="deleteHistory(exam.id)">
              <Icon name="lucide:trash-2" />
              Delete
            </button>
          </div>
 
        </li>
      </ul>
 
    </main>
  </div>
</template>
 
<script setup>
import { computed } from 'vue'
 const appState = useAppState()
const emit = defineEmits(['gohome', 'view', 'review'])
 
const {
  histories,
  load, 
  loadOne,
  remove
} = useExamHistory()
 
await load()
 
const sortedHistories = computed(() => {
  return [...histories.value].sort(
    (a, b) => new Date(b.createdAt?.replace(' ', 'T')) - new Date(a.createdAt?.replace(' ', 'T'))
  )
})
 
// ---- display helpers -------------------------------------------------
 
const hasNumber = (n) => typeof n === 'number' && !Number.isNaN(n)
 
const formatSubject = (s) =>
  String(s)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
 
const subjectsFor = (exam) => {
  if (exam.subjects?.length) return exam.subjects
  if (!exam.questions?.length) return []
  return [...new Set(exam.questions.map((q) => q.subject).filter(Boolean))]
}
 
const examTypeLabel = (exam) => exam.examType || exam.mode || 'Practice'
 
const titleFor = (exam) => {
  const subjects = subjectsFor(exam)
  if (!subjects.length) return 'Practice Exam'
  const names = subjects.map(formatSubject)
  if (names.length <= 3) return names.join(' \u2022 ')
  return `${names.slice(0, 2).join(' \u2022 ')} +${names.length - 2} more`
}
 
const formatDate = (raw) => {
  if (!raw) return 'Unknown date'
  const d = new Date(String(raw).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return raw
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${date} \u00b7 ${time}`
}
 
const round1 = (n) => Math.round(n * 10) / 10
 
const formatAggregate = (exam) => {
  if (!hasNumber(exam.aggregate) || !hasNumber(exam.maxAggregate)) return 'No aggregate'
  return `${round1(exam.aggregate)} / ${round1(exam.maxAggregate)}`
}
 
const formatSeconds = (secs) => {
  const s = Math.max(0, Math.round(secs || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}
 
const timeFor = (exam) => {
  if (exam.timeSpent) return exam.timeSpent
  if (hasNumber(exam.durationUsed)) return formatSeconds(exam.durationUsed)
  return '—'
}
 
const bandClass = (pct) => {
  if (!hasNumber(pct)) return 'seal--none'
  if (pct >= 70) return 'seal--good'
  if (pct >= 50) return 'seal--mid'
  return 'seal--low'
}
 
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
import { ref } from 'vue'

const selectedSubjects = ref([])

const view = async (id) => {
  try {
    const exam = await loadOne(id)

    // ----------------------------------------
    // Make sure questions is an array
    // ----------------------------------------
    const questions = Array.isArray(exam.questions)
      ? exam.questions
      : []

    // ----------------------------------------
    // Get subjects that actually have questions
    // ----------------------------------------
    const subjectMap = questions.reduce(
      (groups, question) => {
        const subject = question.subject

        if (!subject) return groups

        if (!groups[subject]) {
          groups[subject] = {
            id: subject,
            name: subject,

            total: 0,
            answered: 0,
            unanswered: 0,
            correct: 0,
            wrong: 0,

            questions: []
          }
        }

        // Add question
        groups[subject].questions.push(question)

        // Total
        groups[subject].total++

        // Answered
        if (
          question.userAnswer !== null &&
          question.userAnswer !== undefined &&
          question.userAnswer !== ""
        ) {
          groups[subject].answered++
        } else {
          groups[subject].unanswered++
        }

        // Correct / Wrong
        if (question.isCorrect) {
          groups[subject].correct++
        } else if (
          question.userAnswer !== null &&
          question.userAnswer !== undefined &&
          question.userAnswer !== ""
        ) {
          groups[subject].wrong++
        }

        return groups
      },
      {}
    )

    // ----------------------------------------
    // Convert object -> array
    // ----------------------------------------
    exam.subjects = Object.values(subjectMap)

    // ----------------------------------------
    // Optional: calculate score for each subject
    // ----------------------------------------
    exam.subjects = exam.subjects.map(subject => ({
      ...subject,

      score:
        subject.total > 0
          ? Number(
              (
                (subject.correct / subject.total) *
                100
              ).toFixed(2)
            )
          : 0,

      maxScore: subject.total
    }))

    console.log(exam.subjects);
    
  appState.value.selectedSubjectsView =  exam.subjects
 appState.value.examQuestionsView  = exam.questions
  appState.value.reviewQuestions = true
  appState.value.examResult = exam 
 console.log(appState.value.selectedSubjectsView, 'appState.value.selectedSubjectsView ');
 
    // ----------------------------------------
    // Continue with your existing logic
    // ----------------------------------------
    // selectedExam.value = exam
    // selectedSubject.value = exam.subjects[0]
  await navigateTo('/exam')
  } catch (error) {
    console.error(
      "Failed to load exam:",
      error
    )

    alert("Unable to load exam history.")
  }
}
// ---- actions -----------------------------------------------------------
 
const goHome = () => emit('gohome')
 
const deleteHistory = async (id) => {
  const confirmed = confirm('Delete this exam history?')
  if (!confirmed) return
  await remove(id)
}
</script>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
 
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
 
/* ---------- header ---------- */
 
.eh-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.75rem;
  padding: 0 1.25rem;
  background: var(--navy);
  color: #f4efe2;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}
 
.eh-header__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
 
.eh-header__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(244, 239, 226, 0.12);
  font-size: 1.1rem;
}
 
.eh-header__title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
 
.eh-header__sub {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: rgba(244, 239, 226, 0.65);
}
 
.eh-header__home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}
 
.eh-header__home:hover {
  background: rgba(244, 239, 226, 0.12);
  transform: translateY(-1px);
}
 
/* ---------- main / empty state ---------- */
 
.eh-main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.25rem 1rem 5rem;
}
 
.eh-empty {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}
 
.eh-empty__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  margin-bottom: 1.1rem;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--gold);
  font-size: 1.75rem;
}
 
.eh-empty__title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
}
 
.eh-empty__sub {
  margin: 0.4rem 0 0;
  font-size: 0.875rem;
  color: var(--ink-soft);
}
 
/* ---------- ticket list ---------- */
 
.ticket-list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
 
.ticket {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1.1rem;
  box-shadow: 0 1px 2px rgba(36, 48, 74, 0.04);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
 
.ticket:hover {
  box-shadow: 0 10px 24px -12px rgba(36, 48, 74, 0.22);
  transform: translateY(-1px);
}
 
.ticket__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 1.35rem;
}
 
.ticket__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gold);
}
 
.ticket__title {
  margin: 0.3rem 0 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--navy);
}
 
.ticket__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.65rem;
}
 
.chip {
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--ink-soft);
}
 
/* score seal, the signature element */
 
.seal {
  flex-shrink: 0;
  transform: rotate(-3deg);
}
 
.seal__ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  outline: 1px solid currentColor;
  outline-offset: 3px;
  font-family: 'IBM Plex Mono', monospace;
}
 
.seal__pct {
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1;
}
 
.seal__pct small {
  font-size: 0.65rem;
  font-weight: 500;
  margin-left: 1px;
}
 
.seal__agg {
  margin-top: 0.15rem;
  font-size: 0.55rem;
  font-weight: 500;
  opacity: 0.85;
  white-space: nowrap;
}
 
.seal--good { color: var(--good); }
.seal--mid { color: var(--gold); }
.seal--low { color: var(--bad); }
.seal--none { color: var(--ink-soft); }
 
/* ticket-stub perforation */
 
.ticket__perforation {
  position: relative;
  height: 0;
  border-top: 2px dashed var(--line);
  margin: 0 1.25rem;
}
 
.ticket__perforation::before,
.ticket__perforation::after {
  content: '';
  position: absolute;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--bg);
}
 
.ticket__perforation::before { left: -1.5rem; }
.ticket__perforation::after { right: -1.5rem; }
 
/* stats */
 
.ticket__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 1.1rem 1.25rem 0;
}
 
.stat {
  padding: 0.65rem 0.75rem;
  border-radius: 0.65rem;
  background: var(--bg);
}
 
.stat dt {
  font-size: 0.68rem;
  color: var(--ink-soft);
  margin: 0 0 0.2rem;
}
 
.stat dd {
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--navy);
}
 
.stat--good { background: var(--good-bg); }
.stat--good dd { color: var(--good); }
.stat--bad { background: var(--bad-bg); }
.stat--bad dd { color: var(--bad); }
 
/* actions */
 
.ticket__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1.1rem 1.25rem 1.25rem;
}
 
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid transparent;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s ease, background 0.15s ease, transform 0.15s ease;
}
 
.btn :deep(svg) { width: 15px; height: 15px; }
 
.btn--primary {
  background: var(--navy);
  color: #f4efe2;
}
.btn--primary:hover { opacity: 0.92; transform: translateY(-1px); }
 
.btn--ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--ink);
}
.btn--ghost:hover { background: var(--bg); }
 
.btn--danger {
  background: transparent;
  color: var(--bad);
  margin-left: auto;
}
.btn--danger:hover { background: var(--bad-bg); }
 
/* ---------- responsive ---------- */
 
@media (min-width: 640px) {
  .ticket__stats {
    grid-template-columns: repeat(6, 1fr);
  }
}
 
@media (max-width: 480px) {
  .ticket__top { flex-direction: column; }
  .seal { align-self: flex-start; transform: rotate(0deg); }
  .btn--danger { margin-left: 0; }
}
 
@media (prefers-reduced-motion: reduce) {
  .ticket, .btn, .eh-header__home { transition: none; }
  .ticket:hover, .btn:hover { transform: none; }
}
</style>