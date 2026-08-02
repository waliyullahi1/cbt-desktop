export default defineNuxtPlugin(async () => {
  await loadAppState()

  const appState = useAppState()

  watch(
    appState,
    async () => {
      await saveAppState()
    },
    { deep: true }
  )
})