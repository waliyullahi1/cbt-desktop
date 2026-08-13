<template>
  <div class="q-search">
    <!-- ========================================= -->
    <!-- HEADER -->
    <!-- ========================================= -->
    <header class="qs-header">
      <div class="qs-header__brand">
        <span class="qs-header__mark">
          <Icon name="lucide:search-check" />
        </span>
        <div>
          <h1 class="qs-header__title">Question Bank</h1>
          <p class="qs-header__sub">Search by topic, subject, or any words</p>
        </div>
      </div>

      <button type="button" class="qs-header__home" @click="goHome" aria-label="Go home">
        <Icon name="lucide:house" />
      </button>
    </header>

    <!-- ========================================= -->
    <!-- MAIN -->
    <!-- ========================================= -->
    <main class="qs-main">

      <!-- SEARCH BOX -->
      <div class="lookup-slip">
        <Icon name="lucide:search" class="lookup-slip__icon" />
        <input
          v-model="query"
          type="text"
          class="lookup-slip__input"
          placeholder="Search questions — e.g. “ozone layer”, “galvanized iron”…"
          autocomplete="off"
          @input="onInput"
          @keydown.enter="runSearch"
        />
        <button
          v-if="query"
          type="button"
          class="lookup-slip__clear"
          aria-label="Clear search"
          @click="onClear"
        >
          <Icon name="lucide:x" />
        </button>
      </div>

      <!-- SUBJECT FILTER CHIPS -->
      <div v-if="subjects.length" class="filter-row">
        <button
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': !activeSubject }"
          @click="setSubject(null)"
        >
          All subjects
        </button>
        <button
          v-for="s in subjects"
          :key="s"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': activeSubject === s }"
          @click="setSubject(s)"
        >
          {{ formatLabel(s) }}
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="loading && !currentQuestion" class="qs-status">
        <Icon name="lucide:loader-2" class="qs-status__spin" />
        Searching…
      </div>

      <!-- EMPTY / IDLE -->
      <div v-if="!query && !currentQuestion" class="qs-empty">
        <div class="qs-empty__mark">
          <Icon name="lucide:layers" />
        </div>
        <h2 class="qs-empty__title">Search the question bank</h2>
        <p class="qs-empty__sub">Try a topic, a keyword, or part of a question.</p>
      </div>

      <!-- NO RESULTS -->
      <div v-else-if="query && !loading && !results.length && !currentQuestion" class="qs-empty">
        <div class="qs-empty__mark qs-empty__mark--bad">
          <Icon name="lucide:file-question" />
        </div>
        <h2 class="qs-empty__title">No matching questions</h2>
        <p class="qs-empty__sub">Try fewer or different words.</p>
      </div>

      <!-- RESULTS LIST -->
      <ul v-if="!currentQuestion && results.length" class="result-list overflow-y-scroll">
        <li
          v-for="row in results"
          :key="row.id"
          class="result-card"
          @click="openQuestion(row.id)"
        >
          <div class="result-card__tags">
            <span class="tag tag--subject">{{ formatLabel(row.subject) }}</span>
            <span v-if="row.year" class="tag">{{ row.year }}</span>
            <span v-if="row.topic" class="tag">{{ row.topic }}</span>
          </div>
          <p class="result-card__snippet" v-html="renderSnippet(row.snippet)"></p>
        </li>
      </ul>

      <!-- FULL QUESTION DETAIL -->
      <article v-if="currentQuestion" class="quiz-card">
        <div class="quiz-card__top">
          <div class="quiz-card__tags">
            <span class="tag tag--subject">{{ formatLabel(currentQuestion.subject) }}</span>
            <span v-if="currentQuestion.year" class="tag">{{ currentQuestion.year }}</span>
            <span v-if="currentQuestion.examType" class="tag">{{ currentQuestion.examType?.toUpperCase() }}</span>
          </div>
          <button type="button" class="quiz-card__close" aria-label="Back to results" @click="closeQuestion">
            <Icon name="lucide:x" />
          </button>
        </div>

        <p class="quiz-card__question">{{ currentQuestion.question }}</p>

        <ul class="options">
          <li
            v-for="(text, letter) in currentQuestion.options"
            :key="letter"
            class="option"
            :class="{ 'option--correct': letter === currentQuestion.answer }"
          >
            <span class="option__letter">{{ letter }}</span>
            <span class="option__text">{{ text }}</span>
            <Icon
              v-if="letter === currentQuestion.answer"
              name="lucide:check"
              class="option__check"
            />
          </li>
        </ul>

        <div v-if="currentQuestion.solution" class="explanation">
          <span class="explanation__label">
            <Icon name="lucide:lightbulb" />
            Explanation
          </span>
          <p class="explanation__text">{{ currentQuestion.solution }}</p>
        </div>
      </article>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['gohome'])

const {
  results,
  currentQuestion,
  subjects,
  loading,
  search,
  loadQuestion,
  loadSubjects,
  clear
} = useQuestionSearch()

const query          = ref('')
const activeSubject  = ref(null)
let debounceTimer     = null

onMounted(() => {
  loadSubjects()
})

// ---- search ---------------------------------------------------------

const runSearch = () => {
  search(query.value, { subject: activeSubject.value })
}

const onInput = () => {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    clear()
    return
  }
  debounceTimer = setTimeout(runSearch, 250)
}

const setSubject = (subject) => {
  activeSubject.value = subject
  if (query.value.trim()) runSearch()
}

const onClear = () => {
  query.value = ''
  clear()
}

// ---- question detail --------------------------------------------------

const openQuestion = async (id) => {
  await loadQuestion(id)
}

const closeQuestion = () => {
  currentQuestion.value = null
}

// ---- formatting ---------------------------------------------------------

const formatLabel = (s) =>
  String(s || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

// snippet() wraps matches in ⟦ ⟧ — turn those into <mark> for highlighting
const renderSnippet = (snippet) => {
  if (!snippet) return ''
  return snippet
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/⟦/g, '<mark>')
    .replace(/⟧/g, '</mark>')
}

const goHome = () => emit('gohome')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

.q-search {
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

.qs-header {
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

.qs-header__brand { display: flex; align-items: center; gap: 0.75rem; }

.qs-header__mark {
  display: flex; align-items: center; justify-content: center;
  width: 2.5rem; height: 2.5rem; border-radius: 0.75rem;
  background: rgba(244, 239, 226, 0.12); font-size: 1.1rem;
}

.qs-header__title {
  margin: 0; font-family: 'Fraunces', Georgia, serif;
  font-size: 1.05rem; font-weight: 600; letter-spacing: 0.01em;
}

.qs-header__sub { margin: 0.1rem 0 0; font-size: 0.75rem; color: rgba(244, 239, 226, 0.65); }

.qs-header__home {
  display: flex; align-items: center; justify-content: center;
  width: 2.5rem; height: 2.5rem; border: none; border-radius: 0.75rem;
  background: transparent; color: inherit; font-size: 1.25rem; cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}
.qs-header__home:hover { background: rgba(244, 239, 226, 0.12); transform: translateY(-1px); }

/* ---------- main ---------- */

.qs-main { flex: 1; min-height: 0; overflow-y: auto; padding: 1.25rem 1rem 5rem; }

/* ---------- search ---------- */

.lookup-slip {
  position: relative; display: flex; align-items: center; gap: 0.6rem;
    margin: 0 auto; padding: 0.1rem 0.9rem; max-width: 70%;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 0.5rem; box-shadow: 0 1px 2px rgba(36, 48, 74, 0.05);
}
.lookup-slip:focus-within { border-color: var(--navy-soft); box-shadow: 0 0 0 3px rgba(60, 76, 110, 0.12); }
.lookup-slip__icon { flex-shrink: 0; color: var(--ink-soft); font-size: 1rem; }
.lookup-slip__input { width: 90px;
  flex: 1; border: none; outline: none; background: transparent;
  padding: 0.65rem 0; font-size: 0.95rem; color: var(--ink);
}
.lookup-slip__input::placeholder { color: var(--ink-soft); }
.lookup-slip__clear {
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  width: 1.75rem; height: 1.75rem; border: none; border-radius: 50%;
  background: var(--bg); color: var(--ink-soft); cursor: pointer;
}
.lookup-slip__clear:hover { background: var(--line); }

/* ---------- filter chips ---------- */

.filter-row {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
  max-width: 90%; margin: 0.75rem auto 0;
}
.filter-chip {
  padding: 0.35rem 0.8rem; border-radius: 999px;
  border: 1px solid var(--line); background: var(--surface);
  font-size: 0.78rem; font-weight: 500; color: var(--ink-soft); cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.filter-chip:hover { background: var(--bg); }
.filter-chip--active {
  background: var(--navy); border-color: var(--navy); color: #f4efe2;
}

/* ---------- status / empty ---------- */

.qs-status {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  margin-top: 1.25rem; font-size: 0.85rem; color: var(--ink-soft);
}
.qs-status__spin { animation: qs-spin 0.8s linear infinite; }
@keyframes qs-spin { to { transform: rotate(360deg); } }

.qs-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 4rem 1rem 2rem; text-align: center;
}
.qs-empty__mark {
  display: flex; align-items: center; justify-content: center;
  width: 4.5rem; height: 4.5rem; margin-bottom: 1.1rem; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--line); color: var(--gold); font-size: 1.75rem;
}
.qs-empty__mark--bad { color: var(--bad); border-color: var(--bad-bg); background: var(--bad-bg); }
.qs-empty__title { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 1.15rem; font-weight: 600; }
.qs-empty__sub { margin: 0.4rem 0 0; font-size: 0.875rem; color: var(--ink-soft); }

/* ---------- result list ---------- */

.result-list {
  list-style: none; margin: 1rem auto 0; padding: 0;
  max-width: 640px; display: flex; flex-direction: column; gap: 0.6rem;
}
.result-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 0.85rem;
  padding: 0.9rem 1.05rem; cursor: pointer;
  box-shadow: 0 1px 2px rgba(36, 48, 74, 0.04);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.result-card:hover { box-shadow: 0 8px 20px -12px rgba(36, 48, 74, 0.25); transform: translateY(-1px); }

.result-card__tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }

.tag {
  padding: 0.15rem 0.55rem; border-radius: 999px; background: var(--bg);
  border: 1px solid var(--line); font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.03em; text-transform: uppercase; color: var(--ink-soft);
}
.tag--subject { color: var(--gold); }

.result-card__snippet { margin: 0; font-size: 0.9rem; line-height: 1.5; color: var(--ink); }
.result-card__snippet :deep(mark) {
  background: none; color: var(--navy); font-weight: 600;
  border-bottom: 2px solid var(--gold);
}

/* ---------- quiz card (full question) ---------- */

.quiz-card {
  max-width: 640px; margin: 1rem auto 0;
  background: var(--surface); border: 1px solid var(--line); border-radius: 1rem;
  box-shadow: 0 10px 24px -14px rgba(36, 48, 74, 0.22);
  padding: 1.25rem 1.25rem 1.4rem;
}

.quiz-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.quiz-card__tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }

.quiz-card__close {
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; border: none; border-radius: 50%;
  background: transparent; color: var(--ink-soft); cursor: pointer;
}
.quiz-card__close:hover { background: var(--bg); }

.quiz-card__question {
  margin: 0.9rem 0 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.15rem; line-height: 1.45; font-weight: 500; color: var(--ink);
  white-space: pre-line;
}

/* options */

.options {
  list-style: none; margin: 1.1rem 0 0; padding: 0;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.option {
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.6rem 0.8rem; border-radius: 0.65rem;
  background: var(--bg); border: 1px solid var(--line);
}
.option--correct { background: var(--good-bg); border-color: var(--good); }

.option__letter {
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  width: 1.6rem; height: 1.6rem; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--line);
  font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; font-weight: 600; color: var(--ink-soft);
}
.option--correct .option__letter { background: var(--good); border-color: var(--good); color: #fff; }

.option__text { flex: 1; font-size: 0.9rem; color: var(--ink); }
.option__check { flex-shrink: 0; color: var(--good); }

/* explanation */

.explanation {
  margin-top: 1.1rem; padding: 0.9rem 1rem;
  background: var(--bg); border-radius: 0.75rem; border: 1px solid var(--line);
}
.explanation__label {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 0.4rem;
}
.explanation__text { margin: 0; font-size: 0.88rem; line-height: 1.55; color: var(--ink-soft); white-space: pre-line; }

@media (prefers-reduced-motion: reduce) {
  .qs-status__spin { animation: none; }
  .result-card:hover { transform: none; }
}
</style>
