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

app.use(express.json()) // implementing json-parser

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

const PORT = 3001
app.listen(PORT, () => console.log(`express server is running on ${PORT}`))
