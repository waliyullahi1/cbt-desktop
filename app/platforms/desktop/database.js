import Database from "@tauri-apps/plugin-sql"

let db = null
export async function migrateExamAnswers(db) {
  try {
    const columns = await db.select(`
      PRAGMA table_info(exam_answers)
    `)

    console.log('exam_answers columns:', columns)

    const hasAnswer = columns.some(
      column => column.name === 'answer'
    )

    const hasCorrectAnswer = columns.some(
      column => column.name === 'correctAnswer'
    )

    // -----------------------------------------
    // OLD DATABASE:
    // correctAnswer exists
    // answer does not exist
    // -----------------------------------------

    if (!hasAnswer && hasCorrectAnswer) {

      await db.execute(`
        ALTER TABLE exam_answers
        ADD COLUMN answer TEXT
      `)

      await db.execute(`
        UPDATE exam_answers
        SET answer = correctAnswer
      `)

      console.log(
        '✅ Added answer column and copied correctAnswer'
      )

      return
    }

    // -----------------------------------------
    // VERY OLD DATABASE:
    // neither column exists
    // -----------------------------------------

    if (!hasAnswer && !hasCorrectAnswer) {

      await db.execute(`
        ALTER TABLE exam_answers
        ADD COLUMN answer TEXT
      `)

      console.log(
        '✅ Added answer column'
      )

      return
    }

    console.log(
      '✅ exam_answers already has answer column'
    )

  } catch (error) {

    console.error(
      '❌ migrateExamAnswers error:',
      error
    )

    throw error
  }
}

export async function getDB() {

    if (!db) {

        db = await Database.load("sqlite:cbt.db")

    }

    return db
 
}

export async function initializeDatabase() {

    const db = await getDB()

    await db.execute(`
        CREATE TABLE IF NOT EXISTS exam_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            examType TEXT,
            mode TEXT,

            startTime TEXT,
            endTime TEXT,

            total INTEGER,
            answered INTEGER,
            unanswered INTEGER,

            correct INTEGER,
            wrong INTEGER,

            percentage REAL,

            aggregate REAL,
            maxAggregate REAL,

            duration INTEGER,
            durationUsed INTEGER,
            timeSpent TEXT,
            speed REAL,

            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `)

    await db.execute(`
        CREATE TABLE IF NOT EXISTS exam_subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            historyId INTEGER,

            subjectId TEXT,
            subjectName TEXT,

            total INTEGER,
            answered INTEGER,
            correct INTEGER,
            wrong INTEGER,

            score REAL,
            maxScore REAL,

            FOREIGN KEY(historyId)
                REFERENCES exam_history(id)
                ON DELETE CASCADE
        );
    `)

    await db.execute(`
        CREATE TABLE IF NOT EXISTS exam_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            historyId INTEGER,

            questionId TEXT,

            subject TEXT,
            year TEXT,

            text TEXT,

            options TEXT,

            answer TEXT,
            userAnswer TEXT,

            isCorrect INTEGER,

            timeSpent INTEGER,

            bookmarked INTEGER,

            FOREIGN KEY(historyId)
                REFERENCES exam_history(id)
                ON DELETE CASCADE
        );
    `)

    // await migrateExamAnswers(db)

}