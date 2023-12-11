const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const commentsRouter = require('./controllers/comments')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(
    console.log(`connected to MongoDB ${config.mode}, PORT=${config.PORT}`)
  )
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static('dist'))
app.use('/api/users', usersRouter)
app.use('/api/blogs/comments', commentsRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app