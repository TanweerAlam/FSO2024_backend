// const http = require('http')

// const blog = {
//     title: "365 nights",
//     author: "TheTanweer"
// }

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'content-type': 'application/json'})
//     response.end(JSON.stringify({blog}))
// })

// app.listen(3001, () => console.log('Server is running on 3001'))


const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

const blogSchema =  new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

const MONGODB_URI= 'mongodb+srv://fso2024_admin:fso2024_password@university-of-helsinki.0ejfv.mongodb.net/blogApp?retryWrites=true&w=majority&appName=UNIVERSITY-OF-HELSINKI'

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)

app.get('/', (request, response) => {
    response.json(blogList)
})

app.get('/api/blogs', (request, response, next) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => next(error))

    console.log("Retrieve request called")
})

app.get('/api/blogs/:id', (request, response) => {
    const { id } = request.params

    Blog.findById(id)
        .then(blog => {
            response.json(blog)
        })
        .catch(error => next(error))

    console.log("Read request called")
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))

    console.log("Create request called")
})

app.put('/api/blogs/:id', (request, response) => {
    const { id } = request.params

    Blog.findByIdAndUpdate(id, request.body, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))

    console.log("Update request called")
})

app.delete('/api/blogs/:id', (request, response) => {
    const { id } = request.params

    Blog.findByIdAndDelete(id)
        .then(() => {
            response.status(204).send("Resource deleted successfully")
        })
        .catch(error => next(error))

    console.log("Delete request called")
})

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
