const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

const Order = require('../models/order')

blogRouter.post('/order', async (request, response) => {
  const body = request.body

  const order = new Order({
    order: body,
  })

  const savedOrder = await order.save()
  response.status(201).json(savedOrder)
})


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
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

blogRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({})

  if (comments) {
    response.json(comments)
  } else {
    response.status(404).end()
  }
})


blogRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const newComment = new Comment({
    comment: body.comment,
    blogId: body.blogId
  })

  const savedComment = await newComment.save()
  response.status(201).json(savedComment)
})


blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.likes) blog.likes = 0

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})


blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'only logged in users can delete their blogs' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const { likes } = body

  const blog = await Blog.findById(request.params.id)

  if (!request.user.id) {
    return response.status(401).json({ error: 'only logged in users can update blogs' })
  }

  // const user = await User.findById(request.user.id)

  // if (!user) {
  //   return response.status(401).json({ error: 'only logged in users can update blogs' })
  // }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true, context: 'query' })
  response.status(200).json(updatedBlog)

})

module.exports = blogRouter