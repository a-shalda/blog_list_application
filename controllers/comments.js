const commentsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')


commentsRouter.get('/', middleware.userExtractor, async (request, response) => {
  const comments = await Comment.find({})

  if (comments) {
    response.json(comments)
  } else {
    response.status(404).end()
  }
})


commentsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const comment = await Comment.findById(request.params.id)

  if (comment.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'only logged in users can delete their blogs' })
  }

  await Comment.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = commentsRouter