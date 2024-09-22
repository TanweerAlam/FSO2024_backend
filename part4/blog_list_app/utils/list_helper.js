const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    const reducer = (acc, obj) => {
        return acc + obj.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = blogs => {
    const favouriteBlog = blogs.reduce((current, next) => {
        return current.likes > next.likes ? current : next
    })

    return favouriteBlog
}

// const blogs = [
//     {
//       _id: "5a422a851b54a676234d17f7",
//       title: "React patterns",
//       author: "Michael Chan",
//       url: "https://reactpatterns.com/",
//       likes: 7,
//       __v: 0
//     },
//     {
//       _id: "5a422aa71b54a676234d17f8",
//       title: "Go To Statement Considered Harmful",
//       author: "Edsger W. Dijkstra",
//       url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//       likes: 5,
//       __v: 0
//     }
//   ]

const mostBlogs = blogs => {
    // const publishes = blogs.reduce((acc, blog) => {
    //     acc[blog.author] = acc[blog.author] || 0
    //     acc[blog.author] += 1
    //     return acc
    // }, [])
    const highestBlogs = blogs.reduce(({ sums, most }, { author }) => {
        sums[author] = (sums[author] || 0) + 1

        if ( sums[author] > most.blogs ) {
            most = { author, blogs: sums[author] }
        }

        return { sums, most }
    }, { sums: {}, most: { blogs: 0 } }).most

    return highestBlogs
}

const mostLikes = blogs => {
    const highestLikes = blogs.reduce(( { sums, most }, { author, likes }) => {
        sums[author] = (sums[author] || 0) + likes

        if( sums[author] > most.likes ){
            most = { author, likes: sums[author] }
        }

        return { sums, most }
    }, { sums: {}, most: { likes: 0 } } ).most
    // console.log("Highest likes", highestLikes)
    return highestLikes
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
