const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// notesRouter.get('/', (request, response) => {
//   Note.find({})
//     .then(notes => {
//       response.json(notes)
//     })
// })
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// notesRouter.get('/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note){
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })
notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  // ******** Route using async/await with try-catch ***********
  // try {
  //   const note = await Note.findById(id)
  //   if (note) {
  //     response.json(note)
  //   } else {
  //     response.status(404).end()
  //   }
  // } catch (exception) {
  //   next(exception)
  // }

  // ********** Route after implementing the express-async-errors **********

  const note = await Note.findById(id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
  })

  //  ********** Route using promises ********

  // note.save()
  //   .then(savedNote => {
  //     response.status(201).json(savedNote)
  //   })
  //   .catch(error => next(error))

  // ****** Route  using async/await *********

  // try {
  //   const savedNote = await note.save()
  //   response.status(201).json(savedNote)
  // } catch (exception) {
  //   next(exception)
  // }

  // ******** Route after implementing express-async-errors library *******

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)

})

// ******* Route using promise******

// notesRouter.delete('/:id', (request, response, next) => {
//   Note.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// ******* Route using async/await with try-catch ********

// notesRouter.delete('/:id', async (request, response, next) => {
//   const id = request.params.id
//   try {
//     await Note.findByIdAndDelete(id)
//     response.status(204).end()
//   } catch (exception) {
//     next(exception)
//   }
// })

// ******* Route using express-async-errors library and simplifying routes *******
// Refactoring try-catch using express-async-errors library
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }
  // ******** Route using promises ***********

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))

  // // *******Route after implementing express-async-errors ***********

  // const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  // response.status(200).json(updatedNote)
})

module.exports = notesRouter
