const orderRouter = require('express').Router()

const Order = require('../models/order')

orderRouter.post('/', async (request, response) => {
  const body = request.body

  const order = new Order({
    order: body.order,
  })

  await order.save()
  // response.status(201).json(savedOrder)
})

orderRouter.get('/', async (request, response) => {
  const orders = await Order
    .find({})
  response.json(orders)
})


module.exports = orderRouter