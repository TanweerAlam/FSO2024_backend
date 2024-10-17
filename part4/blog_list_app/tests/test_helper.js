const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogObjects = [
    {
        title: "The esoteric philosophies",
        author: "TheTanweer",
        url: "http://localhost:3003",
        likes: 11981
    },
    {
        title: "365 nights",
        author: "TheTanweer",
        url: "http://localhost:3003",
        likes: 13462
    }
]

const initialUserObjects = [
    {
        username: "tester",
        name: "tester",
        password: "tester"
    },
    {
        username: "seniorTester",
        name: "seniorTester",
        password: "seniorTester"
    }
]

const blogsInDB = async () => {
    const blogs =  await Blog.find({})
    return blogs
}

const usersInDB = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    initialBlogObjects,
    initialUserObjects,
    blogsInDB,
    usersInDB
}
