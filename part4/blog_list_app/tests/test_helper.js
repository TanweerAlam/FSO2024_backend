const Blog = require('../models/blog')

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

const blogsInDB = async () => {
    const blogs =  await Blog.find({})
    return blogs
}
module.exports = {
    initialBlogObjects,
    blogsInDB
}
