export async function findOne( db, table,
where = {},
  populate = []
) {
  // ------------------------------------------------
  // Validate
  // ------------------------------------------------
  if (!db) {
    throw new Error("Database instance is required.");
  }

  if (
    !table ||
    typeof table !== "string" ||
    !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)
  ) {
    throw new Error("Invalid table name.");
  }

  if (
    !where ||
    typeof where !== "object" ||
    Array.isArray(where)
  ) {
    throw new Error("Where must be an object.");
  }

  const keys = Object.keys(where);

  if (!keys.length) {
    throw new Error("No search conditions provided.");
  }

  // ------------------------------------------------
  // Query
  // ------------------------------------------------
  const sql = `
    SELECT *
    FROM ${table}
    WHERE ${keys.map(k => `${k} = ?`).join(" AND ")}
    LIMIT 1
  `;

  const result = await db.get(
    sql,
    keys.map(k => where[k])
  );

  if (!result) return null;

  // ------------------------------------------------
  // Populate
  // ------------------------------------------------
  for (const relation of populate) {
    const {
      path,
      table: relationTable,
      localKey = path,
      foreignKey = "id",
      many = false,
      orderBy = "id",
      transform
    } = relation;

    if (
      !relationTable ||
      !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(relationTable)
    ) {
      throw new Error(
        `Invalid populate table "${relationTable}".`
      );
    }

    const value = result[localKey];

    if (value == null) continue;

    if (many) {
      let rows = await db.select(
        `
        SELECT *
        FROM ${relationTable}
        WHERE ${foreignKey} = ?
        ORDER BY ${orderBy}
        `,
        [value]
      );

      if (typeof transform === "function") {
        rows = transform(rows);
      }

      result[path] = rows;
    } else {
      let row = await db.get(
        `
        SELECT *
        FROM ${relationTable}
        WHERE ${foreignKey} = ?
        LIMIT 1
        `,
        [value]
      );

      if (
        row &&
        typeof transform === "function"
      ) {
        row = transform(row);
      }

      result[path] = row;
    }
  }

  // ------------------------------------------------
  // save()
  // ------------------------------------------------
  Object.defineProperty(result, "save", {
    enumerable: false,
    value: async function () {
      if (!this.id) {
        throw new Error("Cannot save without id.");
      }

      const columns = Object.keys(this).filter(
        key =>
          ![
            "id",
            "save",
            "reload",
            "delete"
          ].includes(key)
      );

      if (!columns.length) return this;

      await db.run(
        `
        UPDATE ${table}
        SET ${columns
          .map(col => `${col} = ?`)
          .join(", ")}
        WHERE id = ?
        `,
        [
          ...columns.map(col => this[col]),
          this.id
        ]
      );

      return this;
    }
  });

  // ------------------------------------------------
  // reload()
  // ------------------------------------------------
  Object.defineProperty(result, "reload", {
    enumerable: false,
    value: async function () {
      const fresh = await db.get(
        `
        SELECT *
        FROM ${table}
        WHERE id = ?
        LIMIT 1
        `,
        [this.id]
      );

      if (!fresh) return null;

      Object.assign(this, fresh);

      return this;
    }
  });

  // ------------------------------------------------
  // delete()
  // ------------------------------------------------
  Object.defineProperty(result, "delete", {
    enumerable: false,
    value: async function () {
      await db.run(
        `
        DELETE FROM ${table}
        WHERE id = ?
        `,
        [this.id]
      );

      return true;
    }
  });

  return result;
}
//////Usage 
// const result = await findOne(
//   db,
//   "results",
//   { id: 1 },
//   [
//     {
//       path: "userId",
//       table: "users"
//     },
//     {
//       path: "subjectId",
//       table: "subjects"
//     }
//   ]
// )

const find = async (
  db,
  table,
  where = {},
  populate = []
) => {
  // Validate table
  if (!table || typeof table !== "string") {
    throw new Error("Table name is required.")
  }

  // Validate where
  if (!where || typeof where !== "object" || Array.isArray(where)) {
    throw new Error("Where must be an object.")
  }

  let sql = `SELECT * FROM ${table}`
  let values = []

  const keys = Object.keys(where)

  if (keys.length) {
    const conditions = keys
      .map(key => `${key} = ?`)
      .join(" AND ")

    sql += ` WHERE ${conditions}`
    values = Object.values(where)
  }

  // Execute query
  const results = await db.all(sql, values)

  // No populate
  if (!populate.length) {
    return results
  }

  // Populate each row
  for (const row of results) {
    for (const item of populate) {
      const {
        path,
        table,
        foreignKey = "id"
      } = item

      if (row[path] == null) continue

      row[path] = await db.get(
        `SELECT * FROM ${table} WHERE ${foreignKey} = ? LIMIT 1`,
        [row[path]]
      )
    }
  }

  return results
}

/////USAGE
// const results = await find(
//   db,
//   "results",
//   { status: "active" },
//   [
//     {
//       path: "userId",
//       table: "users"
//     },
//     {
//       path: "subjectId",
//       table: "subjects"
//     }
//   ]
// )


const updateOne = async (
  db,
  table,
  where = {},
  data = {},
  populate = []
) => {
  // Validate table
  if (!table || typeof table !== "string") {
    throw new Error("Table name is required.")
  }

  // Validate where
  if (!where || typeof where !== "object" || Array.isArray(where)) {
    throw new Error("Where must be an object.")
  }

  // Validate data
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Data must be an object.")
  }

  const whereKeys = Object.keys(where)
  const dataKeys = Object.keys(data)

  if (!whereKeys.length) {
    throw new Error("No search conditions provided.")
  }

  if (!dataKeys.length) {
    throw new Error("No update data provided.")
  }

  const setClause = dataKeys
    .map(key => `${key} = ?`)
    .join(", ")

  const whereClause = whereKeys
    .map(key => `${key} = ?`)
    .join(" AND ")

  const sql = `
    UPDATE ${table}
    SET ${setClause}
    WHERE ${whereClause}
  `

  const values = [
    ...Object.values(data),
    ...Object.values(where)
  ]

  // Execute update
  await db.run(sql, values)

  // Get updated record
  const selectSql = `
    SELECT *
    FROM ${table}
    WHERE ${whereClause}
    LIMIT 1
  `

  const result = await db.get(
    selectSql,
    Object.values(where)
  )

  if (!result) return null

  // Populate relations
  for (const item of populate) {
    const {
      path,
      table,
      foreignKey = "id"
    } = item

    if (result[path] == null) continue

    result[path] = await db.get(
      `SELECT * FROM ${table} WHERE ${foreignKey} = ? LIMIT 1`,
      [result[path]]
    )
  }

  return result
}
/// usege 
