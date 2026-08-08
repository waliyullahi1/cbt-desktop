export async function loadSettings() {

    return await $fetch("/api/settings")

}

export async function saveSettings(data) {

    return await $fetch("/api/settings", {

        method: "POST",

        body: data

    })

}