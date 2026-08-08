import { Store } from "@tauri-apps/plugin-store"

let store = null

async function getStore() {

    if (!store) {

        store = await Store.load("app-state.json")

    }

    return store

}

export async function loadSettings() {

    const store = await getStore()

    return await store.get("state")

}

export async function saveSettings(data) {

    const store = await getStore()

    await store.set("state", data)

    await store.save()

}