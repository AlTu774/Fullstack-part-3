const express = require('express')
const app = express()

const persons = [
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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(contact => contact.id == id)
    if (person == undefined) {
        response.status(404).end()
    }
    response.json(person)  
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

const PORT = 3001
app.listen(PORT, () => {
})