const { Model } = require('../orm')
const db = require('../database/sqlite')

const Subject = new Model(db, 'subjects')

module.exports = Subject
