const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

// beforeEach(async () => {
//   await Note.deleteMany({})

//   let noteObject = new Note(helper.initialNotes[0])
//   await noteObject.save()

//   noteObject = new Note(helper.initialNotes[1])
//   await noteObject.save()
// })

// ***** beforeEach function optimized using forEach ***********

// beforeEach(async () => {
//   await Note.deleteMany({})
//   console.log('cleared')

//   helper.initialNotes.forEach(async (note) => {
//     let noteObject = new Note(note)
//     await noteObject.save()
//     console.log('saved')
//   })
//   console.log('done')
// })

// ******** beforeEach optimized using promises *********
// good if promises execution order doesn't matter

// beforeEach(async () => {
//   await Note.deleteMany({})

//   const noteObjects = helper.initialNotes.map(note => new Note(note))
//   const promiseArray = noteObjects.map(note => note.save())

//   await Promise.all(promiseArray)
// })

// ******** beforeEach optimized using for...of... ********
// suitable if execution needs to be in order



describe('when there is initially some notes saved', () => {

  beforeEach(async () => {
    await Note.deleteMany({})
    console.log('cleared')

    for( let note of helper.initialNotes) {
      let noteObject = new Note(note)
      await noteObject.save()
      console.log('saving')
    }
    console.log('done')
  })

  test.only('notes are returned as json', async () => {
    console.log('entered test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('there are two notes', async () => {
    const response = await helper.notesInDb()
    // console.log('Length of db', response.length)

    assert.strictEqual(response.length, helper.initialNotes.length)
  })

  test.only('all notes are returned', async () => {
    const response = await helper.notesInDb()

    assert.strictEqual(response.length, helper.initialNotes.length)
  })

  test.only('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
  })

  describe('viewing a specific note', () => {

    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/notes/${validNonexistingId.id}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(404)
    })
  })

  describe('addition of a new note', () => {

    test.only('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(elem => elem.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test.only('fails with status code 400 if data invalid', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const response = await helper.notesInDb()

      assert.strictEqual(response.length, helper.initialNotes.length)
    })

  })

  describe('deletion of a note', () => {

    test.only('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(note => note.content)

      assert(!contents.includes(noteToDelete.content))
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })

  })

})


test.only('the first note is about HTTP methods', async () => {
  const response = await helper.notesInDb()

  const contents = response.map(elem => elem.content)
  assert(contents.includes('HTML is easy'))
})


after(async () => {
  mongoose.connection.close()
})
