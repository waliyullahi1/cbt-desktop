PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fullname TEXT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    photo TEXT,

    createdAt TEXT DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS settings (

    id INTEGER PRIMARY KEY,

    state TEXT

);

CREATE TABLE IF NOT EXISTS subjects (

    id TEXT PRIMARY KEY,

    name TEXT,

    questions INTEGER,

    enabled INTEGER DEFAULT 1

);

CREATE TABLE IF NOT EXISTS questions (

    id TEXT PRIMARY KEY,

    subject TEXT,

    year TEXT,

    examType TEXT,

    question TEXT,

     options TEXT, 
      
    answer TEXT,

    explanation TEXT,

    image TEXT

);

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

CREATE TABLE IF NOT EXISTS exam_answers (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    historyId INTEGER,

    questionId TEXT,

    subject TEXT,

    year TEXT,

    question TEXT,

    options TEXT,          -- JSON

    answer TEXT,

    userAnswer TEXT,

    isCorrect INTEGER,

    timeSpent INTEGER,

    bookmarked INTEGER DEFAULT 0,

    FOREIGN KEY(historyId)
    REFERENCES exam_history(id)
    ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS bookmarks (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    questionId TEXT UNIQUE,

    createdAt TEXT DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS favorites (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    questionId TEXT UNIQUE,

    createdAt TEXT DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS wrong_questions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    questionId TEXT,

    historyId INTEGER,

    subject TEXT,

    year TEXT,

    wrongCount INTEGER DEFAULT 1,

    lastAnswered TEXT,

    FOREIGN KEY(historyId)
    REFERENCES exam_history(id)
    ON DELETE CASCADE

);