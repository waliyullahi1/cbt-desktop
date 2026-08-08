<template>
  <div class="dict-search">
    <!-- ========================================= -->
    <!-- HEADER -->
    <!-- ========================================= -->
    <header class="ds-header">
      <div class="ds-header__brand">
        <span class="ds-header__mark">
          <Icon name="lucide:book-marked" />
        </span>
        <div>
          <h1 class="ds-header__title">Dictionary</h1>
          <p class="ds-header__sub">Look up any word — fully offline</p>
        </div>
      </div>

      <button type="button" class="ds-header__home" @click="goHome" aria-label="Go home">
        <Icon name="lucide:house" />
      </button>
    </header>

    <!-- ========================================= -->
    <!-- MAIN -->
    <!-- ========================================= -->
    <main class="ds-main">

      <!-- SEARCH BOX -->
      <div class="lookup-slip">
        <Icon name="lucide:search" class="lookup-slip__icon" />
        <input
          ref="inputEl"
          v-model="query"
          type="text"
          class="lookup-slip__input"
          placeholder="Type a word…"
          autocomplete="off"
          spellcheck="false"
          @input="onInput"
          @keydown.enter="onEnter"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.esc="onEscape"
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

      <!-- LIVE SUGGESTIONS -->
      <ul v-if="showSuggestions" class="suggestions">
        <li
          v-for="(row, i) in results"
          :key="row.word"
          class="suggestion"
          :class="{ 'suggestion--active': i === highlighted }"
          @mouseenter="highlighted = i"
          @click="selectWord(row.word)"
        >
          <span class="suggestion__word">{{ row.word }}</span>
          <span class="suggestion__meaning">{{ firstSense(row.meaning) }}</span>
        </li>
      </ul>

      <!-- LOADING -->
      <div v-if="loading && !currentWord" class="ds-status">
        <Icon name="lucide:loader-2" class="ds-status__spin" />
        Searching…
      </div>

      <!-- EMPTY / IDLE STATE -->
      <div v-if="!query && !currentWord" class="ds-empty">
        <div class="ds-empty__mark">
          <Icon name="lucide:library-big" />
        </div>
        <h2 class="ds-empty__title">Nothing looked up yet</h2>
        <p class="ds-empty__sub">Start typing above to search the offline dictionary.</p>
      </div>

      <!-- NOT FOUND -->
      <div v-if="notFound && query" class="ds-empty">
        <div class="ds-empty__mark ds-empty__mark--bad">
          <Icon name="lucide:file-question" />
        </div>
        <h2 class="ds-empty__title">"{{ lastLookedUp }}" isn't in the dictionary</h2>
        <p class="ds-empty__sub">Check the spelling, or try a different word.</p>
      </div>

      <!-- WORD DETAIL CARD -->
      <article v-if="currentWord" class="index-card">
        <div class="index-card__top">
          <div>
            <h2 class="index-card__word">{{ currentWord.word }}</h2>
            <span v-if="currentWord.partOfSpeech" class="index-card__pos">
              {{ currentWord.partOfSpeech }}
            </span>
          </div>
          <button
            type="button"
            class="index-card__close"
            aria-label="Close"
            @click="onClear"
          >
            <Icon name="lucide:x" />
          </button>
        </div>

        <div class="index-card__rule" role="presentation"></div>

        <!-- has real definition -->
        <div v-if="currentWord.hasDefinition" class="index-card__body">
          <ol class="senses">
            <li v-for="(sense, i) in senseList(currentWord.meaning)" :key="i" class="sense">
              {{ sense }}
            </li>
          </ol>

          <p v-if="currentWord.example" class="index-card__example">
            &ldquo;{{ currentWord.example }}&rdquo;
          </p>
        </div>

        <!-- valid word, but no definition on file -->
        <div v-else class="index-card__body">
          <p class="index-card__no-def">
            <Icon name="lucide:info" />
            This is a recognized word, but no definition is on file for it yet.
          </p>
        </div>
      </article>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['gohome'])

const {
  results,
  currentWord,
  loading,
  notFound,
  search,
  lookup,
  clear
} = useDictionary()

// ---- state -------------------------------------------------------------

const query        = ref('')
const inputEl       = ref(null)
const highlighted   = ref(-1)
const lastLookedUp  = ref('')

let debounceTimer = null

// ---- debounced live search ---------------------------------------------

const onInput = () => {
  notFound.value = false
  highlighted.value = -1

  clearTimeout(debounceTimer)

  const term = query.value.trim()
  if (!term) {
    clear()
    return
  }

  debounceTimer = setTimeout(() => {
    search(term)
  }, 200)
}

onBeforeUnmount(() => clearTimeout(debounceTimer))

const showSuggestions = computed(() =>
  results.value.length > 0 && !currentWord.value && query.value.trim().length > 0
)

// ---- selecting a word ----------------------------------------------------

const selectWord = async (word) => {
  query.value = word
  results.value = []
  lastLookedUp.value = word
  await lookup(word)
}

const onEnter = async () => {
  const term = query.value.trim()
  if (!term) return

  // if a suggestion is highlighted, use that one
  if (highlighted.value >= 0 && results.value[highlighted.value]) {
    await selectWord(results.value[highlighted.value].word)
    return
  }

  lastLookedUp.value = term
  results.value = []
  await lookup(term)
}

const moveHighlight = (dir) => {
  if (!results.value.length) return
  const max = results.value.length - 1
  let next = highlighted.value + dir
  if (next < 0) next = max
  if (next > max) next = 0
  highlighted.value = next
}

const onEscape = () => {
  results.value = []
}

const onClear = () => {
  query.value = ''
  clear()
  highlighted.value = -1
  inputEl.value?.focus()
}

// ---- formatting helpers --------------------------------------------------

// meaning is stored as "1. (noun) def one 2. (verb) def two" — split into a list
const senseList = (meaning) => {
  if (!meaning) return []
  return meaning
    .split(/(?=\d+\.\s)/)
    .map((s) => s.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

const firstSense = (meaning) => {
  const list = senseList(meaning)
  return list.length ? list[0] : ''
}

// ---- nav -----------------------------------------------------------------

const goHome = () => emit('gohome')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

.dict-search {
  --bg: #f6f3ec;
  --surface: #fffdf8;
  --ink: #201f22;
  --ink-soft: #6b665c;
  --line: #e6e0d2;
  --navy: #24304a;
  --navy-soft: #3c4c6e;
  --gold: #b9873b;
  --good: #3f7a5c;
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

.ds-header {
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

.ds-header__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ds-header__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(244, 239, 226, 0.12);
  font-size: 1.1rem;
}

.ds-header__title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ds-header__sub {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: rgba(244, 239, 226, 0.65);
}

.ds-header__home {
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

.ds-header__home:hover {
  background: rgba(244, 239, 226, 0.12);
  transform: translateY(-1px);
}

/* ---------- main ---------- */

.ds-main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.25rem 1rem 5rem;
}

/* ---------- search / lookup slip ---------- */

.lookup-slip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 560px;
  margin: 0 auto;
  padding: 0.4rem 0.9rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 0.85rem;
  box-shadow: 0 1px 2px rgba(36, 48, 74, 0.05);
}

.lookup-slip:focus-within {
  border-color: var(--navy-soft);
  box-shadow: 0 0 0 3px rgba(60, 76, 110, 0.12);
}

.lookup-slip__icon {
  flex-shrink: 0;
  color: var(--ink-soft);
  font-size: 1rem;
}

.lookup-slip__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.65rem 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.1rem;
  color: var(--ink);
}

.lookup-slip__input::placeholder {
  color: var(--ink-soft);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
}

.lookup-slip__clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: var(--bg);
  color: var(--ink-soft);
  cursor: pointer;
}

.lookup-slip__clear:hover {
  background: var(--line);
}

/* ---------- suggestions ---------- */

.suggestions {
  list-style: none;
  margin: 0.5rem auto 0;
  padding: 0.35rem;
  max-width: 560px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 0.85rem;
  box-shadow: 0 8px 20px -12px rgba(36, 48, 74, 0.25);
  overflow: hidden;
}

.suggestion {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.6rem;
  cursor: pointer;
}

.suggestion--active,
.suggestion:hover {
  background: var(--bg);
}

.suggestion__word {
  flex-shrink: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 600;
  color: var(--navy);
}

.suggestion__meaning {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.82rem;
  color: var(--ink-soft);
}

/* ---------- status / empty states ---------- */

.ds-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.ds-status__spin {
  animation: ds-spin 0.8s linear infinite;
}

@keyframes ds-spin {
  to { transform: rotate(360deg); }
}

.ds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem 2rem;
  text-align: center;
}

.ds-empty__mark {
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

.ds-empty__mark--bad {
  color: var(--bad);
  border-color: var(--bad-bg);
  background: var(--bad-bg);
}

.ds-empty__title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--ink);
}

.ds-empty__sub {
  margin: 0.4rem 0 0;
  font-size: 0.875rem;
  color: var(--ink-soft);
}

/* ---------- word detail: index card ---------- */

.index-card {
  position: relative;
  max-width: 560px;
  margin: 1.1rem auto 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1rem;
  box-shadow: 0 10px 24px -14px rgba(36, 48, 74, 0.22);
  overflow: hidden;
}

/* faux ruled-paper lines, like an index card */
.index-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 1.65rem,
    var(--line) 1.65rem,
    var(--line) calc(1.65rem + 1px)
  );
  opacity: 0.5;
  pointer-events: none;
}

.index-card__top {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0.5rem;
}

.index-card__word {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--navy);
}

.index-card__pos {
  display: inline-block;
  margin-top: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--gold);
}

.index-card__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
}

.index-card__close:hover {
  background: var(--bg);
}

.index-card__rule {
  position: relative;
  height: 0;
  margin: 0.35rem 1.25rem 0;
  border-top: 2px dashed var(--line);
}

.index-card__body {
  position: relative;
  padding: 1rem 1.25rem 1.4rem;
}

.senses {
  margin: 0;
  padding-left: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.sense {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink);
}

.index-card__example {
  margin: 0.9rem 0 0;
  padding-left: 0.8rem;
  border-left: 2px solid var(--line);
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.index-card__no-def {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.88rem;
  color: var(--ink-soft);
}

/* ---------- responsive ---------- */

@media (prefers-reduced-motion: reduce) {
  .ds-status__spin { animation: none; }
}
</style>
