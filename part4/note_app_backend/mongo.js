const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

const url = `mongodb+srv://fso2024_admin:fso2024_password@university-of-helsinki.0ejfv.mongodb.net/testNoteApp?
retryWrites=true&w=majority&appName=UNIVERSITY-OF-HELSINKI`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// eslint-disable-next-line no-unused-vars
// const note = new Note({

//   content: 'Browser can execute only JavaScript',
//   important: false
// })


// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })


// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })
