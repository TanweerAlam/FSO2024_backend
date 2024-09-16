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
const Person = require('./models/phonebook')
const errorHandler = require('./middleware/ErrorHandler.middleware')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // implementing json-parser
// Using morgan middleware
const morgan = require('morgan')
const { default: mongoose } = require('mongoose')
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
    error: 'unknown endpoint'
  })
}
// above mentioned a middleware to handle non-existing routes

// app routes
app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  // const person = persons.find(person => person.id === id)

  // console.log("Requested id", id, person)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.statusMessage = "Requested ID not found"
  //   response.status(404).end()
  // }

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    // .catch(error => {
    //   console.log(error)
    //   response.status(400).send({ error: "malformatted id" })
    // })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  // const isFound = persons.find(person => person.id === id)

  Person.findByIdAndDelete(id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))

  // if (isFound){
  //   persons = persons.filter(person => person.id !== id)
  //   response.sendStatus(204)
  // } else {
  //   response.statusMessage = "No such record found"
  //   response.status(404).end()
  // }
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  console.log('Data posted: ', name, number)

  if (!name || !number) {
    return response.status(400).json({
      error: 'name and number must be enetered'
    })
  }

  Person.findOne({ name: name })
    .then(foundPerson => {
      if (!foundPerson) {
        console.log('Create new person')

        const newPerson = new Person({
          name: name,
          number: number,
        })

        newPerson.save()
          .then(savedPerson => response.status(201).json(savedPerson))
          .catch(error => next(error))
      }
      else{

        if (foundPerson.number !== number){

          foundPerson.number = number
          foundPerson.save()
            .then(updatedPerson => response.status(200).json(updatedPerson))

        } else {
          return response.status(204).send({ message: 'User already exists' })
        }

      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

  const id = request.params.id
  const { name, number } = request.body

  const newPerson = {
    name: name,
    number: number
  }

  Person.findByIdAndUpdate(id, newPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      console.log('Updated person: ', JSON.stringify(updatedPerson))
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  const time = new Date().toString()
  console.log(time)

  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})
// app routes end here

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => console.log(`express server is running on ${PORT}`))
