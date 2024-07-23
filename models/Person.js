const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
