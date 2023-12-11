const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const middleware = require('../utils/middleware')
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, likes: 1 })
  response.json(users)
})


usersRouter.post('/', async (request, response) => {
  const body = request.body
  const { username, name, password } = body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'Password must have at least 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})


usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})


usersRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  if (!request.user) {
    return response.status(401).json({ error: 'unauthorized' })
  }
  if (request.params.id !== request.user.id) {
    return response.status(401).json({ error: 'only logged in users can delete their blogs' })
  }

  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter