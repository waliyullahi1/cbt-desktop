const { Relations } = require('../orm')

const User = require('./User')
const Subject = require('./Subject')
const Question = require('./Question')
const Exam = require('./Exam')

// Register relations once here, so doc.populate("userId") works
// anywhere without repeating { path, table } every time.
Relations.register('exams', 'userId', { table: 'users' })
Relations.register('exams', 'subjectId', { table: 'subjects' })
Relations.register('questions', 'subjectId', { table: 'subjects' })

module.exports = { User, Subject, Question, Exam }
