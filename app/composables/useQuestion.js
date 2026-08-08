import { useDatabase } from "./useDatabase";


export async function createQuestionTable() {
  const db = await useDatabase();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      examType TEXT NOT NULL,
      year INTEGER,
      question TEXT NOT NULL,

      optionA TEXT,
      optionB TEXT,
      optionC TEXT,
      optionD TEXT,
      optionE TEXT,

      answer TEXT,

      category TEXT,

      image TEXT,

      questionNumber INTEGER,

      hasPassage INTEGER DEFAULT 0,

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}