const { Model } = require('../orm')
const db = require('../database/sqlite')

const User = new Model(db, 'users')

module.exports = User
