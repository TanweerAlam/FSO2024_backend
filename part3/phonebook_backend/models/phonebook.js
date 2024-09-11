require('dotenv').config()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(response => {
        console.log('connecting to mongo db')
    })
    .catch(error => {
        console.log('error while connecting database', error.message)
    })

const phonebookSchema = mongoose.Schema({
    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const Person = mongoose.model('Person', phonebookSchema)

// Person.find({}).then(result => {
//     console.log("phonebook:")
//     result.forEach(person => {
//         console.log(person.name, person.number)
//     });
//     mongoose.connection.close()
// })

module.exports = mongoose.model('Person', phonebookSchema)
