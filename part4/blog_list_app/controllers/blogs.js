const router = require('express').Router()

const Blog = require('../models/blog')

router.get('/', (request, response, next) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => next(error))

    console.log("Retrieve request called")
})

router.get('/:id', (request, response, next) => {
    const { id } = request.params

    Blog.findById(id)
        .then(blog => {
            if (blog) response.json(blog)
            else response.status(404).end()
        })
        .catch(error => next(error))

    console.log("Read request called")
})

router.post('/', (request, response, next) => {
    const blog = new Blog(request.body)

    blog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))

    console.log("Create request called")
})

router.put('/:id', (request, response, next) => {
    const { id } = request.params

    Blog.findByIdAndUpdate(id, request.body, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))

    console.log("Update request called")
})

router.delete('/:id', (request, response, next) => {
    const { id } = request.params

    Blog.findByIdAndDelete(id)
        .then(() => {
            response.status(204).send("Resource deleted successfully")
        })
        .catch(error => next(error))

    console.log("Delete request called")
})

module.exports = router
