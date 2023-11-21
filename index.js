require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.get('/info', (request, response) => {
  const d = new Date()

  Person.find({}).then(people => {
    const data = `
      <p>Phonebook has info for ${people.length} people</p>
      <p>${d}</p>
    `
    response.send(data)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const { name, number } = body

  Person.find({ name: body.name }).then(people => {
    let id = people.map(person => person.id)[0]

    if (id) {
      Person.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
    }
    else if (!id) {
      const person = new Person ({
        name: body.name,
        number: body.number,
      })

      person.save().then(savedPerson => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        response.json(savedPerson)
      })
        .catch(error => next(error))
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const { name, number } = body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {

    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)