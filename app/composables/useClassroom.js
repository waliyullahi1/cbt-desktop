import { ref, computed } from 'vue'
import { getDB } from '../platforms/desktop/database'   // adjust path to wherever getDB() actually lives

export function useClassroom() {

  const appState = useAppState()

  // ----- study plan subject list, scoped to the current user -----------------
  // stored as: appState.value.studyPlans = { "WAHEED": [{id,name,icon}, ...], ... }

  const currentUser = computed(() => appState.value.currentsuser || 'unknown')

  const studySubjects = computed({
    get() {
      if (!appState.value.studyPlans) appState.value.studyPlans = {}
      return appState.value.studyPlans[currentUser.value] || []
    },
    set(list) {
      if (!appState.value.studyPlans) appState.value.studyPlans = {}
      appState.value.studyPlans[currentUser.value] = list
    }
  })

  const removeSubject = (id) => {
    studySubjects.value = studySubjects.value.filter((s) => s.id !== id)
  }

  const reorderSubject = (id, direction) => {
    const list = [...studySubjects.value]
    const index = list.findIndex((s) => s.id === id)
    const swapWith = direction === 'up' ? index - 1 : index + 1

    if (index < 0 || swapWith < 0 || swapWith >= list.length) return

    ;[list[index], list[swapWith]] = [list[swapWith], list[index]]
    studySubjects.value = list
  }

  // ----- add a new user ---------------------------------------------------------

  const addUser = (name) => {
    const trimmed = (name || '').trim()
    if (!trimmed) return false

    if (!appState.value.users) appState.value.users = []

    const exists = appState.value.users.some(
      (u) => u.toLowerCase() === trimmed.toLowerCase()
    )
    if (!exists) appState.value.users.push(trimmed)

    appState.value.currentsuser = trimmed
    return true
  }

  // ----- progress per subject, from real exam history ----------------------------
  // averages the score % across every past attempt at that subject.
  // NOTE: exam_history/exam_subjects don't currently store which user sat the
  // exam, so this averages across ALL attempts regardless of user until a
  // user_id column is added to exam_history.

  const progressCache = ref({})   // { [subjectId]: percent }

  const loadProgress = async (subjectId) => {
    try {
      const db = await getDB()
      const rows = await db.select(
        `SELECT AVG(score) as avgScore
         FROM exam_subjects
         WHERE subjectId = ?`,
        [subjectId]
      )
      const pct = rows?.[0]?.avgScore
      progressCache.value = {
        ...progressCache.value,
        [subjectId]: pct == null ? 0 : Math.round(pct)
      }
    } catch (err) {
      console.error('❌ loadProgress error:', err)
      progressCache.value = { ...progressCache.value, [subjectId]: 0 }
    }
  }

  const loadAllProgress = async () => {
    await Promise.all(studySubjects.value.map((s) => loadProgress(s.id)))
  }

  const progressFor = (subjectId) => progressCache.value[subjectId] ?? 0

  return {
    currentUser,
    studySubjects,
    removeSubject,
    reorderSubject,
    addUser,
    loadProgress,
    loadAllProgress,
    progressFor
  }
}
