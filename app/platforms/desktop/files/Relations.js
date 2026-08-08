// Lets you register a relation once, then call doc.populate("userId")
// instead of passing { path, table } every time.
//
// Relations.register("results", "userId", { table: "users" })
// Relations.register("results", "subjectId", { table: "subjects" })

class Relations {
  static registry = new Map()

  static register(table, relationName, config) {
    if (!this.registry.has(table)) {
      this.registry.set(table, {})
    }
    this.registry.get(table)[relationName] = config
  }

  static get(table, relationName) {
    return this.registry.get(table)?.[relationName]
  }
}

module.exports = Relations
