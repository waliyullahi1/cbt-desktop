const { Model } = require('../orm')
const db = require('../database/sqlite')

const Exam = new Model(db, 'exams')

module.exports = Exam
