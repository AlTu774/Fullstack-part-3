const mongoose = require('mongoose')

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://Fullstack1:${password}@phonebookcluster.cwvolmz.mongodb.net/?retryWrites=true&w=majority&appName=PhonebookCluster`

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (newName === undefined || newNumber === undefined) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}

else {
    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(() => {
        console.log(`added ${newName} ${newNumber} to the phonebook`)
        mongoose.connection.close()
    })
}