// const http = require('http')

// let notes = [
//     {
//       id: "1",
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: "2",
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: "3",
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

// ########## eg of Pure Node server mentioned above ##########

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:", request.path)
  console.log("Body:", request.body)
  console.log("---")
  next()
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0

  return String(maxId + 1)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello, world! The app has started.</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  // const note = notes.find(note => note.id === id)

  Note.findById(id)
    .then(note => {
      if (note){
        response.json(note)
      } else {
          // response.statusMessage = "Item NOT FOUND"
          response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = request.params.id
  // notes = notes.filter(note => note.id !== id)

  // response.status(204).end()

  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // const note = {
  //   id: generateId(),
  //   content: body.content,
  //   important: Boolean(body.important) || false
  // }

  // notes = notes.concat(note)

  // response.json(note)

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {

  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
