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

const persons = [
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

app.get('/api/persons', (request, response) => response.json(persons))

const PORT = 3001
app.listen(PORT, () => console.log(`express server is running on ${PORT}`))
