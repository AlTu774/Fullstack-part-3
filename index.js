const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')


app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('data', (req, res) => {
    if (req.method == "POST") {
    return JSON.stringify(req.body)
    }
    else {
        return ''
    }
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const personId = request.params.id
    Person.findById(personId).then(person => { 
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    newPerson = request.body
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({error: "contact doesn't contain a name or a number"})
    }

    Person.find({name: newPerson.name}).then(name => {
        const person = Person({
            name: newPerson.name,
            number: newPerson.number
        })
        
        person.save().then(result => {
            return response.json(person)
        })
        .catch(error => next(error))
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const updated = request.body
    const updatedContact = {
        "id": updated.id,
        "name": updated.name,
        "number": updated.number
    }
    
    Person.findByIdAndUpdate(request.params.id, updatedContact, {new: true})
    .then(contact => {
        response.json(contact)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date()
    const contacts = persons.length
    response.send(
        `<div>
        <p>Phonebook has info for ${contacts} people</p>
        <p>${date}</p>
        </div>`
    )
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({error: 'malformatted id'})
    } 
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})