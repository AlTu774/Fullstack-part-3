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

app.get('/api/persons/:id', (request, response) => {
    const personId = request.params.id
    Person.findById(personId).then(person => { 
        response.json(person)})
        .catch(error => 
            {return response.status(404).end()}
        )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    let person = persons.find(contact => contact.id == id)
    if (person == undefined) {
        response.status(404).end()
    }
    else {
        persons = persons.filter((personInList) => {
            return (personInList.id !== person.id)})
        response.status(204).end()
    }
})

app.post('/api/persons', (request, response) => {
    newPerson = request.body
    newPerson.id = Math.floor(Math.random()*100)
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({error: "contact doesn't contain a name or a number"})
    }

    Person.find({name: newPerson.name}).then(name => {
        if (name != undefined) {
            return response.status(400).json({error: "contact name must be unique"})
        }
    })

    const person = Person({
        name: newPerson.name,
        number: newPerson.number
    })
    person.save().then(response.json(person))
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

const PORT = process.env.PORT || 3001   
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})