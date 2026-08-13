import Database from "@tauri-apps/plugin-sql"
import { resolveResource } from "@tauri-apps/api/path"
import { ref } from 'vue'
import { toHtml, optionsToHtml } from './formatHtml'

// ---------------------------------------------------------------------
// singleton connection
// ---------------------------------------------------------------------

let qDb = null

async function getQuestionsDB() {
  if (!qDb) {
    const dbPath = await resolveResource("resources/questions.db")
    qDb = await Database.load(`sqlite:${dbPath}`)
  }
  return qDb
}

// ---------------------------------------------------------------------
// composable
// ---------------------------------------------------------------------

export function useQuestionSearch() {

  const results = ref([])   // matched questions with snippet
  const currentQuestion = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const subjects = ref([])  // for filter chips

  // ----- turn "ozone layer" into an FTS5 query: ozone* layer* ------------
  // (prefix-matches each word so partial typing still returns results)

  const toFtsQuery = (term) => {
    return term
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w.replace(/["*]/g, '')}*`)
      .join(' ')
  }

  // ----- search question text / topic / subject / solution ---------------

  const search = async (term, { subject = null, year = null, limit = 30 } = {}) => {
    const query = term?.trim()

    if (!query) {
      results.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const db = await getQuestionsDB()
      const ftsQuery = toFtsQuery(query)

      const conditions = []
      const params = [ftsQuery]

      if (subject) {
        conditions.push('q.subject = ?')
        params.push(subject)
      }
      if (year) {
        conditions.push('q.year = ?')
        params.push(year)
      }

      const extraWhere = conditions.length ? `AND ${conditions.join(' AND ')}` : ''
      params.push(limit)

      const rows = await db.select(
        `SELECT
           q.id, q.question, q.subject, q.year, q.topic, q.category,
           snippet(questions_fts, 0, '⟦', '⟧', '…', 12) AS snippet
         FROM questions_fts
         JOIN questions q ON q.rowid = questions_fts.rowid
         WHERE questions_fts MATCH ?
           ${extraWhere}
         ORDER BY rank
         LIMIT ?`,
        params
      )

      results.value = rows
    } catch (err) {
      console.error('❌ question search error:', err)
      error.value = err
      results.value = []
    } finally {
      loading.value = false
    }
  }

  // ----- fetch one full question by id (options, answer, solution) -------

  const loadQuestion = async (id) => {
    loading.value = true
    error.value = null

    try {
      const db = await getQuestionsDB()

      const rows = await db.select(
        `SELECT * FROM questions WHERE id = ? LIMIT 1`,
        [id]
      )

      if (!rows.length) {
        currentQuestion.value = null
        return null
      }

      const row = rows[0]
      currentQuestion.value = {
        ...row,
        options: row.options ? JSON.parse(row.options) : {},
        optionsHtml: row.options_html ? JSON.parse(row.options_html) : {},
        hasPassage: !!row.hasPassage
      }

      return currentQuestion.value
    } catch (err) {
      console.error('❌ load question error:', err)
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  // ----- add a new question -------------------------------------------
  // generates question_html / options_html / solution_html automatically,
  // and (via the DB triggers) the search index updates itself — no
  // manual FTS syncing needed here.

  const addQuestion = async (q) => {
    loading.value = true
    error.value = null

    try {
      const db = await getQuestionsDB()

      const id = q.id || crypto.randomUUID()
      const options = q.options || {}

      await db.execute(
        `INSERT INTO questions (
           id, question, question_html, options, options_html, answer,
           examType, subject, year, section, topic, category, difficulty,
           source, solution, solution_html, imageUrl, hasPassage,
           country, institution, state
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          id,
          q.question ?? null,
          toHtml(q.question),
          JSON.stringify(options),
          JSON.stringify(optionsToHtml(options)),
          q.answer ?? null,
          q.examType ?? null,
          q.subject ?? null,
          q.year ?? null,
          q.section ?? null,
          q.topic ?? null,
          q.category ?? null,
          q.difficulty ?? null,
          q.source ?? null,
          q.solution ?? null,
          toHtml(q.solution),
          q.imageUrl ?? null,
          q.hasPassage ? 1 : 0,
          q.country ?? null,
          q.institution ?? null,
          q.state ?? null
        ]
      )

      return id
    } catch (err) {
      console.error('❌ add question error:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // ----- update an existing question ------------------------------------
  // pass only the fields you want to change; html fields are regenerated
  // for any of question / options / solution you include.

  const updateQuestion = async (id, patch) => {
    loading.value = true
    error.value = null

    try {
      const db = await getQuestionsDB()

      const fields = { ...patch }
      if ('question' in fields) fields.question_html = toHtml(fields.question)
      if ('solution' in fields) fields.solution_html = toHtml(fields.solution)
      if ('options' in fields) {
        fields.options_html = JSON.stringify(optionsToHtml(fields.options))
        fields.options = JSON.stringify(fields.options)
      }
      if ('hasPassage' in fields) fields.hasPassage = fields.hasPassage ? 1 : 0

      const keys = Object.keys(fields)
      if (!keys.length) return

      const setClause = keys.map((k) => `${k} = ?`).join(', ')
      const values = keys.map((k) => fields[k])

      await db.execute(
        `UPDATE questions SET ${setClause} WHERE id = ?`,
        [...values, id]
      )
    } catch (err) {
      console.error('❌ update question error:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // ----- delete a question -----------------------------------------------
  // the DB trigger removes it from the search index automatically

  const deleteQuestion = async (id) => {
    loading.value = true
    error.value = null

    try {
      const db = await getQuestionsDB()
      await db.execute('DELETE FROM questions WHERE id = ?', [id])

      if (currentQuestion.value?.id === id) currentQuestion.value = null
      results.value = results.value.filter((r) => r.id !== id)
    } catch (err) {
      console.error('❌ delete question error:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // ----- distinct subjects, for filter chips ------------------------------

  const loadSubjects = async () => {
    try {
      const db = await getQuestionsDB()
      const rows = await db.select(
        `SELECT DISTINCT subject FROM questions WHERE subject IS NOT NULL ORDER BY subject`
      )
      subjects.value = rows.map((r) => r.subject)
    } catch (err) {
      console.error('❌ load subjects error:', err)
    }
  }

  const clear = () => {
    results.value = []
    currentQuestion.value = null
    error.value = null
  }


  const getQuestions = async ({
    subject = null,
    year = null,
    examType = null,
    limit = 40
  } = {}) => {

    loading.value = true
    error.value = null

    try {

      const db = await getQuestionsDB()

      const conditions = []
      const params = []

      // -----------------------------
      // SUBJECT
      // -----------------------------

      if (subject) {
        conditions.push('subject = ?')
        params.push(subject)
      }

      // -----------------------------
      // YEAR
      // -----------------------------

      if (year) {
        conditions.push('year = ?')
        params.push(year)
      }

      // -----------------------------
      // EXAM TYPE
      // -----------------------------

      if (examType) {
        conditions.push('examType = ?')
        params.push(examType)
      }

      // -----------------------------
      // WHERE
      // -----------------------------

      const where = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : ''

      // -----------------------------
      // LIMIT
      // -----------------------------

      params.push(limit)

      const rows = await db.select(
        `
      SELECT *
      FROM questions
      ${where}
      ORDER BY RANDOM()
      LIMIT ?
      `,
        params
      )

      return rows.map(row => ({
        ...row,

        options: row.options
          ? JSON.parse(row.options)
          : {},

        optionsHtml: row.options_html
          ? JSON.parse(row.options_html)
          : {},

        hasPassage: !!row.hasPassage
      }))

    } catch (err) {

      console.error(
        '❌ get questions error:',
        err
      )

      error.value = err

      return []

    } finally {

      loading.value = false

    }
  }
  return {
    results,
    currentQuestion,
    subjects,
    loading,
    error,
    search,
    getQuestions, 
    loadQuestion,
    loadSubjects,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    clear
  }
}
