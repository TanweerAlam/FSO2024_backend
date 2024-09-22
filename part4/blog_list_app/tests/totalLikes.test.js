const { test, describe } = require('node:test')
const assert = require('node:assert')

const list_helper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]

    const listWithTwoBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          likes: 12,
          __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
          }
    ]

    test('of empty list is zero', () => {
        const result = list_helper.totalLikes([])

        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = list_helper.totalLikes(listWithOneBlog)

        assert.strictEqual(result, listWithOneBlog[0].likes)
    })

    test('of a bigger list is calculated right ', () => {
        const result = list_helper.totalLikes(listWithTwoBlog)

        assert.strictEqual(result, 17)
    })
})
