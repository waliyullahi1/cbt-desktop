function tableExists(db, table) {
  const row = db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`)
    .get(table)
  return !!row
}

function getTableColumns(db, table) {
  if (!tableExists(db, table)) return []
  return db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name)
}

function columnExists(db, table, column) {
  return getTableColumns(db, table).includes(column)
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Turns { name: "Aisha", age: 21 } into
// { clause: "WHERE name = ? AND age = ?", params: ["Aisha", 21] }
function buildWhereClause(where = {}) {
  const keys = Object.keys(where)
  if (!keys.length) return { clause: '', params: [] }

  const clause = 'WHERE ' + keys.map((k) => `${k} = ?`).join(' AND ')
  const params = keys.map((k) => where[k])

  return { clause, params }
}

module.exports = {
  tableExists,
  getTableColumns,
  columnExists,
  isPlainObject,
  buildWhereClause
}
