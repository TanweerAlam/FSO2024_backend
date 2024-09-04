// const http = require('http')

// const persons = [
//     {
//       "id": "1",
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": "2",
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": "3",
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": "4",
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, 'Success', {
//         "content-type": "application/json"
//     })
//     response.end(JSON.stringify(persons))
// })

// const PORT = 3001
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })


// ########## Using Express ###########

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json()) // implementing json-parser

// Using morgan middleware
const morgan = require('morgan')
// defining a new token to extend morgan 'tiny' format
morgan.token('body', (request, response) => request.method === 'POST' && JSON.stringify(request.body))
// definition ends here
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body') )
// Implementing morgan by extend tiny configuration with :body

// Making own middleware to log details of request being sent
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}
// requestLogger middleware defined here

app.use(requestLogger) //implementing own-made middleware "requestLogger"

// defined middleware to catch non-existent routes requests
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint"
  })
}
// above mentioned a middleware to handle non-existing routes

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  return Math.floor(Math.random() * 10e6)
}

// app routes
app.get('/api/persons', (request, response) => response.json(persons))

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  console.log("Requested id", id, person)

  if (person) {
    response.json(person)
  } else {
    response.statusMessage = "Requested ID not found"
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const isFound = persons.find(person => person.id === id)

  if (isFound){
    persons = persons.filter(person => person.id !== id)
    response.sendStatus(204)
  } else {
    response.statusMessage = "No such record found"
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {


  const {name, number} = request.body
  // console.log(`Name ${name}, Number ${number}`)
  // console.log(request.body)

  if (!name || !number){
    return response.status(400).json({
      error: "name and number must be entered"
    })
  }

  const isFound = persons.find(person => person.name === name)

  if (isFound){
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const newPerson = {
    id: generateId(),
    name: name,
    number: number
  }

  persons = persons.concat(newPerson)
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const time = new Date().toString()
  console.log(time)

  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})
// app routes end here

app.use(unknownEndpoint)
//implementing unknownEndpoint middleware below routes so
// that it could catch routes that arent mentioned above

const PORT = 3001
app.listen(PORT, () => console.log(`express server is running on ${PORT}`))
