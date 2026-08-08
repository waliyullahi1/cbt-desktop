import  platform from "~/platforms"

export function useExamHistory() {

    const histories = ref([])
    const loading = ref(false)
    const currentHistory = ref(null)

    async function save(history) {

        loading.value = true

        try {

            return await platform.examHistory.saveExamHistory(history)

        } finally {

            loading.value = false

        }

    }

    async function load() {

        loading.value = true

        try {

            histories.value = await platform.examHistory.getExamHistories()

            return histories.value

        } finally {

            loading.value = false

        }

    }

    async function loadOne(id) {

        loading.value = true

        try {

            currentHistory.value = await platform.examHistory.getExamHistoryById(id)

            return currentHistory.value

        } finally {

            loading.value = false

        }

    }

    async function remove(id) {

        await platform.examHistory.deleteExamHistory(id)

        await load()

    }

    async function clear() {

        await platform.examHistory.clearExamHistory()

        histories.value = []

    }

    return {

        histories,

        currentHistory,

        loading,

        save,

        load,

        loadOne,

        remove,

        clear

    }

}