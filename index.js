const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')


app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('data', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    else {
        return ''
    }
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const personId = request.params.id
    Person.findById(personId).then(person => {
        response.json(person)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({ error: 'contact does not contain a name or a number' })
    }

    Person.find({ name: newPerson.name }).then(() => {
        const person = Person({
            name: newPerson.name,
            number: newPerson.number
        })

        person.save().then(() => {
            return response.json(person)
        }).catch(error => next(error))
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const updated = request.body
    const updatedContact = {
        'id': updated.id,
        'name': updated.name,
        'number': updated.number
    }

    Person.findByIdAndUpdate(request.params.id, updatedContact, { new: true,  runValidators: true }).then(contact => {
        response.json(contact)
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(people => {
        const count = people.length
        response.send(
            `<div>
            <p>Phonebook has info for ${count} people</p>
            <p>${date}</p>
            </div>`
        )
    })
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})