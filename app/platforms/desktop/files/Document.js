const SQLBuilder = require('./SQLBuilder')
const Relations = require('./Relations')
const { OrmError } = require('./Validator')

class Document {
  constructor(model, data) {
    // Non-enumerable so console.log(doc) / Object.keys(doc) only show real columns.
    Object.defineProperty(this, '$model', { value: model, enumerable: false })
    Object.defineProperty(this, '$original', { value: { ...data }, enumerable: false, writable: true })

    Object.assign(this, data)
  }

  $dirtyFields() {
    const dirty = {}
    for (const key of Object.keys(this)) {
      if (this[key] !== this.$original[key]) {
        dirty[key] = this[key]
      }
    }
    return dirty
  }

  async save() {
    if (this.id === undefined) {
      throw new OrmError('Cannot save() a document without an "id" field')
    }

    const dirty = this.$dirtyFields()
    if (Object.keys(dirty).length === 0) return this

    await SQLBuilder.updateOne(this.$model, { id: this.id }, dirty)
    this.$original = { ...this.$original, ...dirty }

    return this
  }

  async delete() {
    if (this.id === undefined) {
      throw new OrmError('Cannot delete() a document without an "id" field')
    }
    return SQLBuilder.deleteOne(this.$model, { id: this.id })
  }

  // doc.populate("userId")
  // doc.populate([{ path: "userId", table: "users" }, { path: "subjectId", table: "subjects" }])
  async populate(paths) {
    const list = Array.isArray(paths) ? paths : [paths]

    for (const item of list) {
      let path, table, foreignKey

      if (typeof item === 'string') {
        const relation = Relations.get(this.$model.table, item)
        if (!relation) {
          throw new OrmError(
            `No relation registered for "${item}" on "${this.$model.table}". ` +
              `Pass { path, table } explicitly, or call Relations.register() first.`
          )
        }
        path = item
        table = relation.table
        foreignKey = relation.foreignKey || 'id'
      } else {
        path = item.path
        table = item.table
        foreignKey = item.foreignKey || 'id'
      }

      const foreignValue = this[path]
      if (foreignValue === undefined || foreignValue === null) continue

      // Lazy require to avoid a circular require with Model.js
      const Model = require('./Model')
      const relatedModel = new Model(this.$model.db, table)
      this[path] = await SQLBuilder.findOne(relatedModel, { [foreignKey]: foreignValue })
    }

    return this
  }
}

module.exports = Document
