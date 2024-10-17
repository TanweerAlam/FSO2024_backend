const { test, beforeEach, after, describe, before} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY3MDNiMjllNWNhMjU3MTk5YTRjOWMyYiIsImlhdCI6MTcyOTA3OTE5OCwiZXhwIjoxNzI5MDgyNzk4fQ.9f0Xh3Er-ZozWA-OW0bMZRzLiq2gVgVKOOZJT6Su_J0'
let token
let user

before(async () => {
    await User.deleteMany({})
    console.log('Users deleted')

    const newUser = {
        username: "new user",
        password: "new user"
    }

    await api.post('/api/users').send(newUser)
    console.log('New user created')

    const result = await api.post('/api/login').send(newUser)
    console.log('The user is logged in')

    user = await User.findOne({ username: newUser.username })
    console.log("User found and assigned", user)

    token = result.body.token
    console.log('Token extracted and set', token)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    for (let blog of helper.initialBlogObjects) {
        const blogObject = new Blog(blog)
        blogObject.user = user
        await blogObject.save()
        console.log('saved')
    }

    console.log('done')
})

describe('retrieval of blogs', () => {
    test.only('all blogs are retrieved', async () => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log(blogs.text)
    })

    test.only('there are two blogs', async () => {
        const result = await api.get('/api/blogs')
        const resultBlogs = result.body

        assert.strictEqual(resultBlogs.length, 2)
    })

    test.only('unique identifier id exists in every blogs', async () => {
        const result = await api.get('/api/blogs')
        const blogs = result.body

        assert.ok((blogs && blogs.every(blog => blog && blog.id)))
    })
})

describe('addition of a new blog', () => {
    test.only('succeeds with valid data', async () => {
        const testBlog =     {
            title: "test: a native node library",
            author: "TheTanweer",
            url: "http://localhost:3003",
            likes: 741
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDB()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogObjects.length + 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes(testBlog.title))
    })

    test.only('succeeds with 0 likes if no likes yet', async () => {
        const testBlog =     {
            title: "something you don't like",
            author: "TheTanweer",
            url: "http://localhost:3003",
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const savedBlog = result.body

        // console.log('Saved blog in test', savedBlog)

        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogObjects.length + 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes(testBlog.title))

        assert.equal(savedBlog.likes, 0)
    })

    test.only('fails with status code 400 if title is missing', async () => {
        const testBlog =     {
            author: "TheTanweer",
            url: "http://localhost:3003",
            likes: 741
        }

        assert(await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(400), 'blog with no title cannot exist')

    })

    test.only('fails with status code 400 if url is missing', async () => {
        const testBlog =     {
            title: "Psychoanalysis",
            author: "TheTanweer",
            likes: 741
        }

        assert(await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(400), 'blog with no url cannot exist')
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogsToDelete = blogsAtStart[0]

        // console.log('Token in blog deletion test', token)
        await api
            .delete(`/api/blogs/${blogsToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogObjects.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(!titles.includes(blogsToDelete.title))
    })

    test('fails with status code 401 Unauthorized if a token is not provided', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })
})

describe('updation of a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToUpdate = blogsAtStart[0]
        const newBlog = {
            title: "Testing the updation",
            author: "TheTanweer",
            url: "https://localhost:3003",
            like: 3986
        }
        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

        const titles = (await blogsAtEnd).map(blog => blog.title)
        assert(titles.includes(newBlog.title))
        assert(!titles.includes(blogToUpdate.title))
    })
})

after(async () => {
    await mongoose.connection.close()
})
