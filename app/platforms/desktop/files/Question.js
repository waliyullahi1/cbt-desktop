const { Model } = require('../orm')
const db = require('../database/sqlite')

const Question = new Model(db, 'questions')

module.exports = Question
