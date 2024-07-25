const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url).then(() => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(val) {
                let correctForm1 = /^\d{2}-\d+/
                let correctForm2 = /^\d{3}-\d+/
                return (correctForm1.test(val) || correctForm2.test(val))
            },
            message: 'Phone number is not the right format'
        }
    }
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
