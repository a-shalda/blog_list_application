const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// blogRouter.get('/info', (request, response) => {
//   const d = new Date()

//   Blog.find({}).then(blogs => {
//     const data = `
//       <p>Phonebook has info for ${blogs.length} blogs</p>
//       <p>${d}</p>
//     `
//     response.send(data)
//   })
//     .catch(error => next(error))
// })

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

// blogRouter.get('/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then(person => {
//       if (person) {
//         response.json(person)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// blogRouter.delete('/:id', (request, response, next) => {
//   Blog.findByIdAndDelete(request.params.id)
//     .then(result => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

blogRouter.post('/', (request, response, next) => {
  const body = request.body
  // const { name, number } = body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
    .catch(error => next(error))

  // Blog.find({ name: body.name }).then(blogs => {
  //   let id = blogs.map(person => person.id)[0]

  //   if (id) {
  //     Blog.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
  //       .then(updatedBlog => {
  //         response.json(updatedBlog)
  //       })
  //       .catch(error => next(error))
  //   }
  //   else if (!id) {
  //     const person = new Blog ({
  //       name: body.name,
  //       number: body.number,
  //     })

  //     person.save().then(savedBlog => {
  //       console.log(`Added ${person.name} number ${person.number} to phonebook`)
  //       response.json(savedBlog)
  //     })
  //       .catch(error => next(error))
  //   }
  // })
})

// blogRouter.put('/:id', (request, response, next) => {
//   const body = request.body
//   const { name, number } = body

//   Blog.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
//     .then(updatedBlog => {
//       response.json(updatedBlog)
//     })
//     .catch(error => next(error))
// })

module.exports = blogRouter