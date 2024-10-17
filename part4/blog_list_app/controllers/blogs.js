const router = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

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
    const blogsList = await Blog.find({}).populate('user', { 'username': 1, 'name': 1, 'id': 1 })
    if (blogsList) {
        return response.status(200).json(blogsList)
    } else {
        return response.status(200).send({ message: 'No blogs have been posted yet'})
    }

    logger.info('Get all request called')
})

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')){
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

router.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    // console.log('Decoded token', request.token)

    // const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    // if (!decodedToken.id){
    //     return response.status(401).json({ error: 'token invalid' })
    // }
    // const user = await User.findById(decodedToken.id)

    const user = await User.findById(request.user.id)
    logger.info('user in request', user)

    if (!body.title || !body.url) {
        return response.status(400).end()
    }

    body.likes = body.likes || 0

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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

router.delete('/:id', middleware.userExtractor, async (request, response) => {
    // const decodedToken = request.token
    // const verifiedUser = await jwt.verify(decodedToken, process.env.SECRET)

    const user = request.user
    logger.info("User id", user.id)

    if (!user) {
        return response.status(401).json({ error: "user not authenticated"})
    }

    // await Blog.findByIdAndDelete(request.params.id)
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() === user.id.toString()){
        await blog.deleteOne()
        return response.status(204).end()
    }
    response.status(401).json({ error: 'token or user invalid'})
})

router.put('/:id', middleware.userExtractor, async (request, response) => {
    const { id } = request.params
    const { body } = request

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
    response.status(200).json(updatedBlog)
})

module.exports = router
