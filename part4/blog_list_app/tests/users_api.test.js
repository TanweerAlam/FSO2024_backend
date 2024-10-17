const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')

const api = supertest(app)

describe('when there is initially some users saved', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        console.log('cleared')

        for(let user of helper.initialUserObjects) {
            const userObject = new User(user)
            await userObject.save()
            console.log('saved')
        }

        console.log('done')
    })

    test('there are two users', async () => {
        const usersAtStart = await helper.usersInDB()

        assert.strictEqual(usersAtStart.length, 2)
    })

    describe('addition of users', () => {
        test('succeeds with statuscode 201 if user is valid', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'autoTester',
                name: 'automatic tester',
                password: 'autoTester',
            }

            // console.log('New user =', newUser)

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            // console.log('Result: ', result.body)
            const savedUser = result.body

            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

            const usernames = usersAtEnd.map(user => user.username)
            assert(usernames.includes(savedUser.username))
        })

        test('failed with statuscode 400 if username is invalid', async () => {
            const newUser = {
                username: 'Fu',
                name: 'Fu Demon Realm',
                password: 'Fu Demon Realm'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // 400 Bad request statusCode is apt for the scenario
        })

        test('failed with statuscode 500 if username already used', async () => {
            const usersAtStart = await helper.usersInDB()

            const existingUser = usersAtStart[0]

            const newUser = {
                username: existingUser.username,
                name: 'existing user',
                password: 'existing user'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(500)
                // 409 is appropriate statusCode for already existing object

            const usersAtEnd = await helper.usersInDB()
            assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        })

        test('failed with statuscode 403 if password is shorter', async () => {
            const usersAtStart = await helper.usersInDB()

            const newUser = {
                username: 'newUser',
                name: 'New User',
                password: 'nU'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(403)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDB()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })

})


after(async () => {
    await mongoose.connection.close()
})
