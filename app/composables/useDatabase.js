import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function useDatabase() {
  if (!db) {
    db = await Database.load("sqlite:cbt.db");
  }

  return db;
}