const { User, Subject, Exam } = require('./models')

async function main() {
  // ---- create() ----
  const user = await User.create({ name: 'Waheed', age: 22, role: 'admin' })
  console.log('created:', user)

  const subject = await Subject.create({ name: 'Mathematics' })

  // ---- mutate + save() (no updateOne() call needed) ----
  user.age = 23
  user.name = 'Waheed A.'
  await user.save()
  console.log('after save:', user)

  // ---- findOne() ----
  const found = await User.findOne({ name: 'Waheed A.' })
  console.log('findOne:', found)

  // ---- find() ----
  const admins = await User.find({ role: 'admin' })
  console.log('find (admins):', admins)

  if (admins[0]) {
    admins[0].name = 'John'
    await admins[0].save()
  }

  // ---- populate() ----
  const exam = await Exam.create({ userId: user.id, subjectId: subject.id, score: 87 })
  await exam.populate(['userId', 'subjectId'])
  console.log('populated exam:', exam)

  // ---- delete() ----
  await found.delete()

  // ---- validation errors (uncomment to see them) ----
  // await User.create({})                         // OrmError: empty data
  // await User.create({ notAColumn: 1 })           // OrmError: column doesn't exist
  // new (require('./orm').Model)(require('./database/sqlite'), 'nope') // OrmError: table doesn't exist
}

main().catch((err) => {
  console.error(err.name + ':', err.message)
})
