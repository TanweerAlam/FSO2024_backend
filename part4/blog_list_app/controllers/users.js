const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (password.length < 3) {
        return response.status(403).json({ error: "Password length must be longer than 3"})
    }

    const saltRounds = 10
    // console.log('Password:', password, 'Salt: ', saltRounds)
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    // console.log('User is', user)

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter
