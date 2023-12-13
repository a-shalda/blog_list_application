const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  order: {
    type: String,
    required: true
  }
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // delete returnedObject.id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Order', orderSchema)