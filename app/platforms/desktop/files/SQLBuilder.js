const { Validator, OrmError } = require('./Validator')
const { buildWhereClause } = require('./Helpers')

class SQLBuilder {
  static async create(model, data) {
    Validator.assertTableExists(model.db, model.table)
    Validator.assertNotEmptyObject(data, 'create() data')
    Validator.assertColumnsExist(model.db, model.table, data)

    const keys = Object.keys(data)
    const placeholders = keys.map(() => '?').join(', ')
    const sql = `INSERT INTO ${model.table} (${keys.join(', ')}) VALUES (${placeholders})`

    try {
      const info = model.db.prepare(sql).run(...keys.map((k) => data[k]))
      // Assumes an integer primary key column named "id", same as Mongoose's _id convention.
      return this.findOne(model, { id: info.lastInsertRowid })
    } catch (err) {
      throw new OrmError(`create() failed on "${model.table}": ${err.message}`)
    }
  }

  static async find(model, where = {}) {
    Validator.assertTableExists(model.db, model.table)
    if (Object.keys(where).length) {
      Validator.assertColumnsExist(model.db, model.table, where)
    }

    const { clause, params } = buildWhereClause(where)
    const sql = `SELECT * FROM ${model.table} ${clause}`

    try {
      const rows = model.db.prepare(sql).all(...params)
      const Document = require('./Document')
      return rows.map((row) => new Document(model, row))
    } catch (err) {
      throw new OrmError(`find() failed on "${model.table}": ${err.message}`)
    }
  }

  static async findOne(model, where = {}) {
    Validator.assertTableExists(model.db, model.table)
    if (Object.keys(where).length) {
      Validator.assertColumnsExist(model.db, model.table, where)
    }

    const { clause, params } = buildWhereClause(where)
    const sql = `SELECT * FROM ${model.table} ${clause} LIMIT 1`

    try {
      const row = model.db.prepare(sql).get(...params)
      if (!row) return null
      const Document = require('./Document')
      return new Document(model, row)
    } catch (err) {
      throw new OrmError(`findOne() failed on "${model.table}": ${err.message}`)
    }
  }

  static async updateOne(model, where, data) {
    Validator.assertTableExists(model.db, model.table)
    Validator.assertNotEmptyObject(where, 'updateOne() where')
    Validator.assertNotEmptyObject(data, 'updateOne() data')
    Validator.assertColumnsExist(model.db, model.table, where)
    Validator.assertColumnsExist(model.db, model.table, data)

    const setKeys = Object.keys(data)
    const setClause = setKeys.map((k) => `${k} = ?`).join(', ')
    const { clause: whereClause, params: whereParams } = buildWhereClause(where)
    const sql = `UPDATE ${model.table} SET ${setClause} ${whereClause}`

    try {
      const info = model.db
        .prepare(sql)
        .run(...setKeys.map((k) => data[k]), ...whereParams)
      return info.changes
    } catch (err) {
      throw new OrmError(`updateOne() failed on "${model.table}": ${err.message}`)
    }
  }

  static async deleteOne(model, where) {
    Validator.assertTableExists(model.db, model.table)
    Validator.assertNotEmptyObject(where, 'deleteOne() where')
    Validator.assertColumnsExist(model.db, model.table, where)

    const { clause, params } = buildWhereClause(where)
    const sql = `DELETE FROM ${model.table} ${clause}`

    try {
      const info = model.db.prepare(sql).run(...params)
      return info.changes
    } catch (err) {
      throw new OrmError(`deleteOne() failed on "${model.table}": ${err.message}`)
    }
  }
}

module.exports = SQLBuilder
