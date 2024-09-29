const { test, expect, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    for (let blog of helper.initialBlogObjects) {
        const blogObject = new Blog(blog)
        await blogObject.save()
        console.log('saved')
    }

    console.log('done')
})

test.only('all blogs are retrieved', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
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

test.only('blog post created successfully', async () => {
    const testBlog =     {
        title: "test: a native node library",
        author: "TheTanweer",
        url: "http://localhost:3003",
        likes: 741
    }

    await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogObjects.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(testBlog.title))
})

test.only('blog posts with no likes have 0 likes', async () => {
    const testBlog =     {
        title: "something you don't like",
        author: "TheTanweer",
        url: "http://localhost:3003",
    }

    const result = await api
        .post('/api/blogs')
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

test.only('blog with no title or url cannot exist', async () => {
    const testBlogOne =     {
        author: "TheTanweer",
        url: "http://localhost:3003",
        likes: 741
    }
    const testBlogTwo =     {
        title: "Psychoanalysis",
        author: "TheTanweer",
        likes: 741
    }

    assert(await api
        .post('/api/blogs')
        .send(testBlogOne)
        .expect(400), 'blog with no title cannot exist')

    assert(await api
        .post('/api/blogs')
        .send(testBlogTwo)
        .expect(400), 'blog with no url cannot exist')
})

after(async () => {
    await mongoose.connection.close()
})
