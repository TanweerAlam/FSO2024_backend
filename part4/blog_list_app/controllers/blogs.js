const router = require('express').Router()

const Blog = require('../models/blog')
const logger = require('../utils/logger')

// router.get('/', (request, response, next) => {
//     Blog.find({})
//         .then(blogs => {
//             response.json(blogs)
//         })
//         .catch(error => next(error))

//     console.log("Retrieve request called")
// })

// router.get('/:id', (request, response, next) => {
//     const { id } = request.params

//     Blog.findById(id)
//         .then(blog => {
//             if (blog) response.json(blog)
//             else response.status(404).end()
//         })
//         .catch(error => next(error))

//     console.log("Read request called")
// })

// router.post('/', (request, response, next) => {
//     const blog = new Blog(request.body)

//     blog.save()
//         .then(result => {
//             response.status(201).json(result)
//         })
//         .catch(error => next(error))

//     console.log("Create request called")
// })

// router.put('/:id', (request, response, next) => {
//     const { id } = request.params

//     Blog.findByIdAndUpdate(id, request.body, { new: true })
//         .then(updatedBlog => {
//             response.json(updatedBlog)
//         })
//         .catch(error => next(error))

//     console.log("Update request called")
// })

// router.delete('/:id', (request, response, next) => {
//     const { id } = request.params

//     Blog.findByIdAndDelete(id)
//         .then(() => {
//             response.status(204).send("Resource deleted successfully")
//         })
//         .catch(error => next(error))

//     console.log("Delete request called")
// })
// ******* Refactoring using async/await ********

router.get('/', async (request, response) => {
    const blogsList = await Blog.find({})
    if (blogsList) {
        return response.status(200).json(blogsList)
    } else {
        return response.status(200).send({ message: 'No blogs have been posted yet'})
    }

    logger.info('Get all request called')
})

router.post('/', async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).end()
    }

    body.likes = body.likes || 0

    const blog = new Blog(body)

    const savedBlog = await blog.save()
    // logger.info('Saved blog', savedBlog)
    response.status(201).json(savedBlog)

    logger.info('Create request called')
})

router.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
        return response.status(200).json(blog)
    } else {
        return response.status(404).json({ message: 'Item not found!'})
    }
})

router.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

router.put('/:id', async (request, response) => {
    const { id } = request.params
    const { body } = request

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
    response.status(200).json(updatedBlog)
})

module.exports = router
