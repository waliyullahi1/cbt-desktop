import { Store } from '@tauri-apps/plugin-store'

const defaultState = {
  users: null,
  currentsuser:null,
  isHome: false,
  currentPage: null,
  showSecond: false,
  selectedSubjects: [],
  examQuestions: [],
  examSettings: {
    mode: 'practice',
    duration: '02:00:00',
    shuffleQuestions: true,
    shuffleOptions: true
  }
}

let store: Store | null = null

export async function getStore() {
  if (!store) {
    store = await Store.load('app-state.json')
  }

  return store
}

export const useAppState = () =>
  useState('appState', () => structuredClone(defaultState))

export async function loadAppState() {
  const appState = useAppState()

  const store = await getStore()

  const saved = await store.get('state')

  if (saved) {
    appState.value.users = saved.users
    appState.value.selectedSubjects =
      saved.selectedSubjects || []
      appState.value.currentsuser = saved.currentsuser
    appState.value.examSettings =
      saved.examSettings
  }
}

export async function saveAppState() {
  const appState = useAppState()

  const store = await getStore()

  await store.set('state', {
    users: appState.value.users,
     currentsuser : appState.value.currentsuser,
    selectedSubjects:  appState.value.selectedSubjects,
    examSettings:  appState.value.examSettings
  })

  await store.save()
}