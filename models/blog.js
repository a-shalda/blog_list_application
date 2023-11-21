const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Minimum name length is 3'],
    required: [true, 'Name required']
  },
  number: {
    type: String,
    minLength: [8, 'Minimum number length is 8'],
    required: [true, 'Number required'],
    validate: {
      validator: function(v) {
        const reg = /^\d{2,3}-\d+/
        return (!v || !v.trim().length) || reg.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // delete returnedObject.id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)