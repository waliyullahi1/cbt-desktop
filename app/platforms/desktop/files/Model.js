const SQLBuilder = require('./SQLBuilder')
const { Validator } = require('./Validator')

class Model {
  constructor(db, table) {
    Validator.assertValidIdentifier(table, 'table name')
    this.db = db
    this.table = table
  }

  async create(data) {
    return SQLBuilder.create(this, data)
  }

  async find(where = {}) {
    return SQLBuilder.find(this, where)
  }

  async findOne(where = {}) {
    return SQLBuilder.findOne(this, where)
  }

  async updateOne(where, data) {
    return SQLBuilder.updateOne(this, where, data)
  }

  async deleteOne(where) {
    return SQLBuilder.deleteOne(this, where)
  }

  async countDocuments(where = {}) {
    const rows = await SQLBuilder.find(this, where)
    return rows.length
  }
}

module.exports = Model
