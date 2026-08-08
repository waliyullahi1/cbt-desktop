const { tableExists, getTableColumns, isPlainObject } = require('./Helpers')

// Table/column names go straight into SQL strings (SQLite doesn't let you
// parameterize identifiers), so this is what stops "users; DROP TABLE users"
// from ever being built into a query.
const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/

class OrmError extends Error {
  constructor(message) {
    super(message)
    this.name = 'OrmError'
  }
}

class Validator {
  static assertValidIdentifier(name, kind = 'identifier') {
    if (typeof name !== 'string' || !IDENTIFIER_REGEX.test(name)) {
      throw new OrmError(`Invalid ${kind}: "${name}"`)
    }
  }

  static assertTableExists(db, table) {
    this.assertValidIdentifier(table, 'table name')
    if (!tableExists(db, table)) {
      throw new OrmError(`Table "${table}" does not exist`)
    }
  }

  static assertColumnsExist(db, table, data) {
    const columns = getTableColumns(db, table)
    for (const key of Object.keys(data)) {
      this.assertValidIdentifier(key, 'column name')
      if (!columns.includes(key)) {
        throw new OrmError(`Column "${key}" does not exist on table "${table}"`)
      }
    }
  }

  static assertNotEmptyObject(data, context = 'data') {
    if (!isPlainObject(data) || Object.keys(data).length === 0) {
      throw new OrmError(`${context} must be a non-empty object`)
    }
  }
}

module.exports = { Validator, OrmError }
