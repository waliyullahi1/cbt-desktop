const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'app.db'))
db.pragma('journal_mode = WAL')

// Demo schema so the usage example runs out of the box.
// Delete this block once you're managing your own migrations.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    age   INTEGER,
    role  TEXT DEFAULT 'student'
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS questions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectId   INTEGER,
    question    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exams (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER,
    subjectId   INTEGER,
    score       INTEGER
  );
`)

module.exports = db
