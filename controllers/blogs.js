const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  // const { name, number } = body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  if (!blog.likes) blog.likes = 0

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

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

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const { title, author, url, likes } = body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true, context: 'query' })
  response.status(200).json(updatedBlog)

})

module.exports = blogRouter